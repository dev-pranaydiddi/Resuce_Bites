import {Request} from '../models/request.model.js';
import {User} from '../models/user.model.js';


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

export const getRequestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await Request.find({ user: userId }).sort({ createdAt: -1 }).populate({
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
        const { deliveryAddress, status , } = req.body;
        if (!id || !foodType || !quantity || !location || !description) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found', success: false });
        }
        const user = await User.findById(req.id);
        if(!user) {
            return res.status(404).json({ message: 'User not found', success: false }); }
        if(user.role === 'RECIPIENT' && status === 'PENDING') {
            request.status = 'ACCEPTED';
            request.recipient = req.id;
            user.requests.push(request._id);
            await user.save();
        }
        if(request.foodType !== foodType) request.foodType = foodType;
        if(request.quantity !== quantity) request.quantity = quantity;
        if(request.location !== location) request.location = location;
        if(request.description !== description) request.description = description;

        await request.save();

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
        if (!id) {
            return res.status(400).json({ message: 'Please provide a valid id' });
        }
        const request = await Request.findByIdAndDelete(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found', success: false });
        }
        res.status(200).json({ message: 'Request deleted successfully', success: true, request: request });
    }
    catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ message: 'Error deleting request', success: false });
    }
};      