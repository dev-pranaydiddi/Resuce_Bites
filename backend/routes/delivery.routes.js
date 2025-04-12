import express from 'express';
const router = express.Router();
import {Delivery} from '../models/delivery.model.js';
import { User } from '../models/user.model.js';
import { Request } from '../models/request.model.js';
import mongoose from 'mongoose';

router.get('/', async (req, res) => {
    try {
        const deliveries = await Delivery.find({});
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving deliveries' });
    }
});

router.post('/delivery', async (req, res) => {
    try {
        const { delivery } = req.body;
        const deliverySchema = new Delivery({
            delivery,
        });
        await deliverySchema.save();
        res.status(201).json({ message: 'Delivery created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating delivery' });
    }
});

router.get('/delivery/:id', async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const delivery = await Delivery.findById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving delivery' });
    }
});

router.put('/delivery/:id', async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const { delivery } = req.body;
        const deliveryToUpdate = await Delivery.findById(deliveryId);
        if (!deliveryToUpdate) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        deliveryToUpdate.delivery = delivery;
        await deliveryToUpdate.save();
        res.status(200).json({ message: 'Delivery updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating delivery' });
    }
});

router.delete('/delivery/:id', async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const deliveryToDelete = await Delivery.findById(deliveryId);
        if (!deliveryToDelete) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        await deliveryToDelete.remove();
        res.status(200).json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting delivery' });
    }
});

router.post('/delivery/request', async (req, res) => {
    try {
        const { deliveryId, requestId } = req.body;
        const delivery = await Delivery.findById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        const user = await User.findById(request.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delivery.requestId = requestId;
        delivery.userId = user._id;
        await delivery.save();
        res.status(201).json({ message: 'Delivery request created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating delivery request' });
    }
});

router.get('/delivery/request/:id', async (req, res) => {
    try {
        const deliveryRequestId = req.params.id;
        const deliveryRequest = await Delivery.findById(deliveryRequestId);
        if (!deliveryRequest) {
            return res.status(404).json({ message: 'Delivery request not found' });
        }
        res.status(200).json(deliveryRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving delivery request' });
    }
});

router.put('/delivery/request/:id', async (req, res) => {
    try {
        const deliveryRequestId = req.params.id;
        const { deliveryId, requestId } = req.body;
        const deliveryRequestToUpdate = await Delivery.findById(deliveryRequestId);
        if (!deliveryRequestToUpdate) {
            return res.status(404).json({ message: 'Delivery request not found' });
        }
        deliveryRequestToUpdate.deliveryId = deliveryId;
        deliveryRequestToUpdate.requestId = requestId;
        await deliveryRequestToUpdate.save();
        res.status(200).json({ message: 'Delivery request updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating delivery request' });
    }
});

router.delete('/delivery/request/:id', async (req, res) => {
    try {
        const deliveryRequestId = req.params.id;
        const deliveryRequestToDelete = await Delivery.findById(deliveryRequestId);
        if (!deliveryRequestToDelete) {
            return res.status(404).json({ message: 'Delivery request not found' });
        }
        await deliveryRequestToDelete.remove();
        res.status(200).json({ message: 'Delivery request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting delivery request' });
    }
});     

export default router;