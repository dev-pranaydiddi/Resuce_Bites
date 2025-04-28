import e from 'express';
import {Delivery} from '../models/delivery.model.js';
import {User} from '../models/user.model.js';
import { getUser } from './user.controller.js';

export const createDelivery = async (req, res) => {
    try {
        const { pickupAddress, pickupLocationName, pickupTime, expiryTime, status, description } = req.body;
        if (!pickupAddress || !pickupLocationName || !pickupTime || !expiryTime || !status || !description) {
            return res.status(400).json({ message: 'Please provide all the required fields', success: false });
        }
        const delivery = new Delivery({ pickupAddress, pickupLocationName, pickupTime, expiryTime, status, description });
        const user = await User.findById(req.id).populate('donation').populate('delivery').populate('request');
        res.status(201).json({ message: 'Delivery created successfully', success: true, delivery: delivery, user: user });
    } catch (err) {
        console.error('Error creating delivery:', err);
    }
};

export const getDeliveriesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deliveries = await Delivery.find({ donor: userId }).sort({ createdAt: -1 }).populate('recipient').populate('request');
        if (!deliveries || deliveries.length === 0) {
            return res.status(404).json({ message: 'No deliveries found at this time.', success: false });
        }
        res.status(200).json({ message: 'Deliveries retrieved successfully', success: true, deliveries: deliveries });
    }
    catch (error) {
        console.error('Error retrieving deliveries:', error);
        res.status(500).json({ message: 'Error retrieving deliveries', success: false });
    }
};

export const getDeliveries = async (req, res) => {
    try {
      const userId = req.id;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      if (user.role !== 'VOLUNTEER') {
        return res
          .status(403)
          .json({ success: false, message: 'Not authorized' });
      }
  
      // only unassigned deliveries
      const deliveries = await Delivery.find({ volunteer: null })
        .sort({ createdAt: -1 })
        .populate({
          path: 'donation',
          select: 'name pickUpAddress',
          populate: { path: 'recipient' }
        })
        .populate({
          path: 'request',
          select: 'applicant deliveryAddress',
          populate: { path: 'applicant'}
        });
  
      if (!deliveries.length) {
        return res
          .status(404)
          .json({ success: false, message: 'No deliveries available' });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Deliveries retrieved successfully',
        deliveries
      });
    } catch (err) {
      console.error('Error retrieving deliveries:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Server error' });
    }
  };

export const acceptDelivery = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        console.log("Delivery ID:", deliveryId);
        const {status} = req.body;
        console.log(status)
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        if(user.role !== 'VOLUNTEER'){
            return res.status(403).json({ message: 'You are not authorized to accept this delivery', success: false });
        
        }
        const delivery = await Delivery.findById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found', success: false });
        }
        console.log('reach')
        if(status === 'ACCEPTED'){
            delivery.volunteer = req.id;
            delivery.status = status;
        }
        await delivery.save();
        return res.status(200).json({ message: 'Delivery accepted successfully', success: true, delivery: delivery });
    } catch (error) {
        console.error('Error accepting delivery:', error);
        res.status(500).json({ message: 'Error accepting delivery', success: false });
    }
};

export const getDelivery = async (req, res) => {
    
    try {
        const deliveryId = req.params.id;
        const delivery = await Delivery.findById(deliveryId).populate('recipient').populate('request');
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found.', success: false });
        }
        res.status(200).json({ message: 'Delivery retrieved successfully', success: true, delivery: delivery });
    }

    catch (error) {
        console.error('Error retrieving delivery:', error);
        // res.status(500).json({ message: 'Error retrieving delivery', success: false });
    }
};

import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';


export const updateDelivery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    pickupAddress,
    pickupLocationName,
    pickupTime,
    expiryTime,
    status,
    description
  } = req.body;
  const userId = req.id;       // From auth middleware
  const userRole = req.role;   // From auth middleware

  // 1) Validate required fields
  if (!id || !pickupAddress || !pickupLocationName || !pickupTime || !expiryTime || !status || !description) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  // 2) Validate status
  const allowed = ['ASSIGNED', 'PICKED_UP', 'DELIVERED', 'CANCELLED'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  // 3) Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 4) Load delivery
    const delivery = await Delivery.findById(id).session(session);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    // 5) Authorization: only donor (creator) or assigned volunteer can update
    if (userRole === 'VOLUNTEER' && delivery.volunteer.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (userRole === 'DONOR' && delivery.donor.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // 6) Load related docs
    const currRequest = await Request.findById(delivery.request).session(session);
    if (!currRequest) {
      throw new Error('Associated request not found');
    }
    const donation = await Donation.findById(currRequest.donation).session(session);
    if (!donation) {
      throw new Error('Associated donation not found');
    }

    // 7) Update delivery fields
    delivery.pickupAddress = pickupAddress;
    delivery.pickupLocationName = pickupLocationName;
    delivery.pickupTime = pickupTime;
    delivery.expiryTime = expiryTime;
    delivery.status = status;
    delivery.description = description;
    await delivery.save({ session });

    // 8) Cascade updates based on status
    if (status === 'DELIVERED') {
      // mark donation delivered, request fulfilled
      donation.status = 'DELIVERED';
      currRequest.status = 'FULFILLED';
      await donation.save({ session });
      await currRequest.save({ session });
    } else if (status === 'CANCELLED') {
      // if cancelled, revert donation to AVAILABLE
      donation.status = 'AVAILABLE';
      await donation.save({ session });
    }

    // 9) Commit
    await session.commitTransaction();
    session.endSession();

    // 10) Return updated delivery
    const updated = await Delivery.findById(id)
      .populate('donor', 'name email')
      .populate('volunteer', 'name email')
      .populate('request')
      .lean();

    return res.status(200).json({ success: true, message: 'Delivery updated successfully', delivery: updated });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error in updateDelivery:', error);
    const code = error.message === 'Delivery not found' ? 404 : 500;
    return res.status(code).json({ success: false, message: error.message });
  }
});


export const deleteDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Please provide a valid id' });
        }
        const delivery = await Delivery.findByIdAndDelete(id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found', success: false });
        }
        res.status(200).json({ message: 'Delivery deleted successfully', success: true, delivery: delivery });
    }
    catch (error) {
        console.error('Error deleting delivery:', error);
        res.status(500).json({ message: 'Error deleting delivery', success: false });
    }
};