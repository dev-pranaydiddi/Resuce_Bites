import e from 'express';
import Delivery from '../models/delivery.model.js';
import User from '../models/user.model.js';
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
        const deliveries = await Delivery.find().sort({ createdAt: -1 }).populate('recipient').populate('request');
        if (!deliveries || deliveries.length === 0) {
            return res.status(404).json({ message: 'No deliveries found at this time.', success: false });
        }
        res.status(200).json({ message: 'Deliveries retrieved successfully', success: true, deliveries: deliveries });
    }
    catch (error) {
        console.error('Error retrieving deliveries:', error);
        res.status(500).json({ message: 'Error retrieving deliveries', success: false });
    }
}

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

export const updateDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { pickupAddress, pickupLocationName, pickupTime, expiryTime, status, donor, recipient, request, description } = req.body;
        if (!id || !pickupAddress || !pickupLocationName || !pickupTime || !expiryTime || !status || !donor || !recipient || !request || !description) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }
        if (user.role === 'VOLUNTEER')
            return res.status(403).json({ message: 'You are not authorized to update this delivery', success: false });

        const delivery = await Delivery.findById(id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found', success: false });
        }
        const currRequest = await Request.findById(delivery.request);
        const donation = await Donation.findById(currRequest.donation);

        if (status === 'ACCEPTED' && user.role === 'VOLUNTEER') {

        }
        else if (status === 'PICKED_UP' && user.role === 'VOLUNTEER') {
            delivery.status = status;
            await donation.save();
        }
        else if (status === 'DELIVERED'&& user.role === 'VOLUNTEER') {
            delivery.status = status;
            // donation status to be updated to DELIVERED
            donation.status = 'DELIVERED';
            currRequest.status = 'FULFILLED';
            // update the donation's delivery to the deliver's volunteer id
            donation.delivery = req.id;
            await donation.save();
            await currRequest.save();
        } 

        const updatedDelivery = await Delivery.findByIdAndUpdate(id, { pickupAddress, pickupLocationName, pickupTime, expiryTime, status, donor, recipient, request, description });
        res.status(200).json({ message: 'Delivery updated successfully', success: true, delivery: updatedDelivery });
    }

    catch (error) {
        console.error('Error updating delivery:', error);
        res.status(500).json({ message: 'Error updating delivery', success: false });
    }
};

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