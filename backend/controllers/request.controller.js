// import { request } from 'express';
import { Request } from '../models/request.model.js';
import { User } from '../models/user.model.js';
import { Delivery } from '../models/delivery.model.js';
import { Donation } from '../models/donation.model.js';

import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
// import * as requests from 'requests';


// donor route
export const getApplicants = async (req, res) => {
    try {
        const { donationId } = req.params;
        const donation = await Donation.findById(donationId).sort({ createdAt: -1 }).populate({
            path: 'requests',
            populate: {
                path: 'applicant'
            }
        }).populate("donor");
        if(donation.donor._id.toString() !== req.id){
            return res.status(401).json({ message: 'You are not authorized to view this donation', success: false });
        }
        // if (!requests || requests.length === 0) {
        //     return res.status(404).json({ message: 'No requests found at this time.', success: false });
        // }
        // const activeRequests = donation.requests.filter(request => request.active === true);
        // const inactiveRequests = donation.requests.filter(request => request.active === false);
        res.status(200).json({ message: 'Requests retrieved successfully', success: true, requests: donation.requests });
    }
    catch (error) {
        console.error('Error retrieving requests:', error);
    }
};
export const applyDonation = async (req,res)=>{
    try{
        const {donationId} = req.params;
        const userId = req.id;
        // console.log("User : ", userId);
        const donation = await Donation.findById(donationId).populate('donor');
        if(!donation){
            return res.status(404).json({message: 'Donation not found', success: false});
        }
        // check whether he is an existing applicant or not in the applicants array of donation
       const existingRequest= await Request.findOne({ donation: donation._id, applicant:userId });
       console.log("Existing Request : ", existingRequest);
        if(existingRequest && existingRequest != null){
            return res.status(400).json({message: 'You have already applied for this donation', success: false});
        }
        // console.log("Donation : ", donation);
        const request = new Request({ donation: donation._id, donor: donation.donor, status: 'PENDING',active: true,applicant:userId });
        if(!request){   
            return res.status(404).json({message: 'Request not found', success: false});
        }
        // console.log("Request : ", request);
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found', success: false});
        }
        if(user.role !== 'RECIPIENT'){
            return res.status(400).json({message: 'You are not authorized to apply for this request', success: false});
        }
        // request.recipient.push(user._id);
        user.request.push(request._id);
        donation.requests.push(request._id);
        // request.applicant = user._id;
        await user.save();
        await request.save();
        await donation.save();
        // console.log("Request : ", request);
        // console.log("Donation : ", donation);
        // console.log("User : ", user);
        return res.status(200).json({message: 'Request applied successfully', success: true, request: request });

    }
    catch(error){
        console.error('Error applying for request:', error);
        res.status(500).json({message: 'Error applying for request', success: false});
    }
}

export const getAppliedDonations = async (req, res) => {
    try {
        const userId = req.id;
        console.log("Donor Id : ", userId);
        const user = await User.findById(userId);
        const requests = await Request.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'donation',
            populate: {
                path: 'donor'
            }
        }).populate('applicant');
        console.log(requests)
        if (!requests || requests.length === 0) {
            return res.status(400).json({ message: 'You have no applied Donations', success: false });
        }
        return res.status(200).json({ message: 'Requests retrieved successfully', success: true, requests: requests });
    }
    catch (error) {
        console.error('Error retrieving requests:', error);
        return res.status(500).json({ message: 'Error retrieving requests', success: false });
    }
};

// src/controllers/requestController.js



/**
 * @desc   Update a request's status. If accepting, reject all others for the same donation.
 * @route  PUT /api/requests/:id/status
 * @access Donor (must own the donation)
 */
// src/controllers/requestController.js

export const updateStatus = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;    // must be 'ACCEPTED' or 'REJECTED'
    const userId = req.id;          // set by your auth middleware
  
    // 1) Validate status value
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid status value' });
    }
  
    // 2) Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      // 3) Load the request
      const request = await Request.findById(requestId).session(session);
      if (!request) {
        throw new Error('Request not found');
      }
      if (request.status !== 'PENDING') {
        throw new Error('Request already processed');
      }
  
      // 4) Load the parent donation and check donor ownership
      const donation = await Donation.findById(request.donation)
        .session(session)
        .populate('donor', '_id'); // only need the _id
      if (!donation) {
        throw new Error('Donation not found');
      }
      if (donation.donor._id.toString() !== userId) {
        return res
          .status(403)
          .json({ success: false, message: 'Not authorized' });
      }
  
      // 5) Update the chosen request
      request.status = status;
      request.active = false;
      await request.save({ session });
  
      // 6) If accepted: reject siblings + create Delivery + link it
      if (status === 'ACCEPTED') {
        // a) reject all other pending requests for this donation
        await Request.updateMany(
          {
            donation: donation._id,
            _id: { $ne: request._id },
            status: 'PENDING'
          },
          { $set: { status: 'REJECTED', active: false } },
          { session }
        );
  
        // b) create a new Delivery document
        const [delivery] = await Delivery.create(
          [
            {
              donation: donation._id,
              donor: donation.donor._id,
              recipient: request.applicant,
              status: 'PENDING',
              request: request._id
            }
          ],
          { session }
        );
  
        // c) attach it to the Donation
        donation.delivery = delivery._id;
        donation.status = 'RESERVED';
        await donation.save({ session });
      }
  
      // 7) Commit & end session
      await session.commitTransaction();
      session.endSession();
  
      // 8) Return the updated docs
      // We refetch to ensure we return the latest populated state
      const updatedRequest = await Request.findById(requestId);
      const updatedDonation = await Donation.findById(donation._id)
        .populate('delivery')
        .lean();
  
      return res.status(200).json({
        success: true,
        message: `Request ${status.toLowerCase()} successfully.`,
        request: updatedRequest,
        donation: updatedDonation
      });
    } catch (error) {
      // rollback on error
      await session.abortTransaction();
      session.endSession();
  
      console.error('Error in updateStatus:', error);
      const statusCode = 
        error.message === 'Request not found' ? 404 :
        error.message === 'Request already processed' ? 400 :
        500;
  
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  });

