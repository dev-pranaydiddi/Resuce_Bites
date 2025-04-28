import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import  isAuthenticated  from '../middlewares/isAuthenticated.js';
import { acceptDelivery, createDelivery, deleteDelivery, getDeliveries, getDeliveriesByUser, getDelivery, getVolunteerDeliveries, updateDeliveryStatus } from '../controllers/delivery.controller.js';

// Create a new delivery
router.route('/all').get(isAuthenticated, getDeliveries);
router.route('/new').post(isAuthenticated, createDelivery);
router.route('/my').get(isAuthenticated, getVolunteerDeliveries);
router.route('/:deliveryId/update').put(isAuthenticated, updateDeliveryStatus);
router.route('/delete/:id').delete(isAuthenticated, deleteDelivery);
router.route('/:deliveryId/accept').put(isAuthenticated, acceptDelivery);
router.route('/:id').get(isAuthenticated, getDelivery);
export default router;