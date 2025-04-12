import Delivery from '../models/delivery.model.js';
import User from '../models/user.model.js';
import { getUser } from './user.controller.js';

export const createDelivery = async (req, res) => {
    try {
        const { pickupAddress, pickupLocationName, pickupTime, expiryTime, status, donor, recipient, request, description } = req.body;
        if (!pickupAddress || !pickupLocationName || !pickupTime || !expiryTime || !status || !donor || !recipient || !request || !description) {
            return res.status(400).json({ message: 'Please provide all the required fields', success: false });
        }
        const delivery = await Delivery.create({ pickupAddress, pickupLocationName, pickupTime, expiryTime, status, donor, recipient, request, description });
        const user = await getUser(req, res);
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
        const delivery = await Delivery.findById(id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found', success: false });
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