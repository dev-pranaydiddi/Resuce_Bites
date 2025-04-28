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

  export const getVolunteerDeliveries = async (req, res) => {
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
      const deliveries = await Delivery.find({ volunteer: userId })
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
          .json({ success: false, message: 'No deliveries available accept any' });
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
import { Request } from '../models/request.model.js';
import { Donation } from '../models/donation.model.js';


const ALLOWED_TRANSITIONS = {
  ACCEPTED:   ["PICKED_UP","CANCELLED"],
  PICKED_UP:  ["DELIVERED"],
  DELIVERED:  [],       // terminal
  CANCELLED:  [],       // terminal
  EXPIRED:    []        // if you support auto-expiry
};


export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { deliveryId } = req.params;
  const { status: tgt } = req.body;

  if (!deliveryId || !tgt) {
    return res
      .status(400)
      .json({ success: false, message: "Missing deliveryId or status" });
  }

  const newStatus = tgt.toUpperCase();
  if (!ALLOWED_TRANSITIONS[newStatus] && newStatus !== "ASSIGNED") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid status value" });
  }

  // 1) Load delivery
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    return res
      .status(404)
      .json({ success: false, message: "Delivery not found" });
  }

  // 2) Validate transition
  const current = delivery.status.toUpperCase();
  if (current === newStatus) {
    return res
      .status(400)
      .json({ success: false, message: `Already in "${current}"` });
  }
  const allowed = ALLOWED_TRANSITIONS[current] || [];
  if (!allowed.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: `Cannot transition from "${current}" to "${newStatus}".`
    });
  }

  // 3) Update delivery status
  delivery.status = newStatus;
  await delivery.save();

  // 4) Cascade updates
  const request = await Request.findById(delivery.request);
  const donation = await Donation.findById(request.donation);

  switch (newStatus) {
    case "PICKED_UP":
      donation.status = "IN_TRANSIT";
      request.status  = "ON_THE_WAY_ORG";
      break;
    case "DELIVERED":
      donation.status = "DELIVERED";
      request.status  = "FULFILLED";
      break;
    case "CANCELLED":
      donation.status = "AVAILABLE";
      break;
    // EXPIRED or ASSIGNED have no cascade
  }

  // save both if modified
  const saves = [donation.save()];
  if (newStatus === "DELIVERED" || newStatus ==="PICKED_UP") saves.push(request.save());
  await Promise.all(saves);

  // 5) Return updated
  const updated = await Delivery.findById(deliveryId)
    .populate("donation")
    .populate("volunteer")
    .populate({
      path: "request",
      populate: { path: "applicant" }
    });

  res.status(200).json({
    success: true,
    message: `Delivery status updated to ${newStatus}`,
    delivery: updated
  });
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