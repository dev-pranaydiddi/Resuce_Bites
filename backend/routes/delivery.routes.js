import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import  isAuthenticated  from '../middlewares/isAuthenticated.js';
import { acceptDelivery, createDelivery, deleteDelivery, getDeliveries, getDeliveriesByUser, getDelivery, updateDelivery } from '../controllers/delivery.controller.js';

// Create a new delivery
router.route('/all').get(isAuthenticated, getDeliveries);
router.route('/new').post(isAuthenticated, createDelivery);
router.route('/user/:userId').get(isAuthenticated, getDeliveriesByUser);
router.route('/update/:id').put(isAuthenticated, updateDelivery);
router.route('/delete/:id').delete(isAuthenticated, deleteDelivery);
router.route('/:deliveryId/accept').put(isAuthenticated, acceptDelivery);
router.route('/:id').get(isAuthenticated, getDelivery);
export default router;