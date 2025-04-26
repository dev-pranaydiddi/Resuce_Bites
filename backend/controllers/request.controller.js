import { request } from 'express';
import { Request } from '../models/request.model.js';
import { User } from '../models/user.model.js';
import { Delivery } from '../models/delivery.model.js';
import { Donation } from '../models/donation.model.js';


export const getRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found.', success: false });
        }
        res.status(200).json({ message: 'Request retrieved successfully', success: true, request: request });
    }
    catch (error) {
        console.error('Error retrieving request:', error);
        // res.status(500).json({ message: 'Error retrieving request', success: false });
    }
};

export const getRequests = async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 }).populate({
            path: 'donation',
            populate: {
                path: 'donor'
            }
        }).populate('recipient');
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: 'No requests found at this time.', success: false });
        }
        const activeRequests = requests.filter(request => request.active === true);
        const inactiveRequests = requests.filter(request => request.active === false);
        res.status(200).json({ message: 'Requests retrieved successfully', success: true, requests: requests });
    }
    catch (error) {
        console.error('Error retrieving requests:', error);
    }
};
export const applyRequest = async (req,res)=>{
    try{
        const {donationId} = req.params;
        const userId = req.id;
        console.log("User : ", userId);
        const donation = await Donation.findById(donationId).populate('donor');
        if(!donation){
            return res.status(404).json({message: 'Donation not found', success: false});
        }
        console.log("Donation : ", donation);
        const request = new Request({ donation: donation._id, donor: donation.donor, status: 'PENDING',active: true,recipient:userId });
        if(!request){   
            return res.status(404).json({message: 'Request not found', success: false});
        }
        console.log("Request : ", request);
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found', success: false});
        }
        if(user.role !== 'RECIPIENT'){
            return res.status(400).json({message: 'You are not authorized to apply for this request', success: false});
        }
        if(request.recipient === (user._id)){
            return res.status(400).json({message: 'You have already applied for this request', success: false});
        }
        // request.recipient.push(user._id);
        user.request.push(request._id);
        await user.save();
        await request.save();
        return res.status(200).json({message: 'Request applied successfully', success: true, request: request});

    }
    catch(error){
        console.error('Error applying for request:', error);
        res.status(500).json({message: 'Error applying for request', success: false});
    }
}

export const getRequestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("User : ", userId);
        const requests = await Request.find({ recipient: userId }).sort({ createdAt: -1 }).populate({
            path: 'donation',
            populate: {
                path: 'donor'
            }
        }).populate('recipient');
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: 'No requests found at this time.', success: false });
        }
        const activeRequests = requests.filter(request => request.active === true);
        const inactiveRequests = requests.filter(request => request.active === false);
        res.status(200).json({ message: 'Requests retrieved successfully', success: true, requests: requests });
    }
    catch (error) {
        console.error('Error retrieving requests:', error);
    }
};

export const getRequestsByRecipient = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const requests = await Request.find({ recipient: recipientId }).sort({ createdAt: -1 }).populate({
            path: 'donation',
            populate: {
                path: 'donor'
            }
        }).populate('recipient');
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: 'No requests found at this time.', success: false });
        }
        res.status(200).json({ message: 'Requests retrieved successfully', success: true, requests: requests });
    }
    catch (error) {
        console.error('Error retrieving requests:', error);
    }
};


export const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryAddress,active,status,} = req.body;
        const request = await Request.findById(id);
        const currDonation = await Donation.findById(request.donation);
        if (!currDonation) {
            return res.status(404).json({ message: 'Donation not found', success: false });
        }
        if (!request) {
            return res.status(404).json({ message: 'Request not found', success: false });
        }
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        if (user.role === 'RECIPIENT' && status === 'ACCEPTED' && request.active === true && request.status === 'PENDING') {
            request.status = 'ACCEPTED';
            // assigning the delivery address given by the recipient while accepting the request
            request.deliveryAddress = deliveryAddress || request.deliveryAddress;
            request.recipient = req.id;
            currDonation.status = 'RESERVED';
            user.requests.push(request._id);
            const delivery  = new Delivery({status: 'STAND_BY', donation: currDonation._id});
            await user.save();
        }
        if (user.role === 'DONOR' && request.status === 'PENDING' && request.active === true && !active)
            request.active = false;
        if (user.role === 'DONOR' && body.status === 'PENDING' && request.active === false && active)
            request.active = true;

        //update the request with the new data which is passed in the body of the request


        await request.save();
        await currDonation.save();
        
        const updatedRequest = await Request.findById(id).populate('donation').populate('recipient').populate('donor');
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found', success: false });
        }
        res.status(200).json({ message: 'Request updated successfully', success: true, request: updatedRequest });
    }
    catch (error) {
        console.error('Error updating request:', error);
    }
};


export const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        if (!requestId) {
            return res.status(400).json({ message: 'Please provide a valid id' });
        }
        const user = await User.findById(req.id);
        console.log("User ID:", req.id);
        console.log("Request ID:", requestId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        const existRequest = await Request.findById(requestId);
        const existdonation = await Donation.findById(existRequest.donation);
        if (!existRequest) {
            return res.status(404).json({ message: 'Request not found', success: false });
        }
        if (!existdonation) {
            return res.status(404).json({ message: 'Donation not found', success: false });
        }
        if (user.role === 'DONOR' && existRequest.active && existRequest.status === 'PENDING') {
            user.requests.pull(requestId);
            existdonation.request = null;
        }
        await user.save();   
        await existdonation.save();
        const request = await Request.findByIdAndDelete(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found', success: false });
        }
        await request.save();
        res.status(200).json({ message: 'Request deleted successfully', success: true, request: request });
    }
    catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ message: 'Error deleting request', success: false });
    }
};      