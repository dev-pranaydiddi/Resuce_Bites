import express from 'express';
const router = express.Router();
import {Donation} from '../models/donation.model.js';
import { User } from '../models/user.model.js';
import { Request } from '../models/request.model.js';
import mongoose from 'mongoose';
import { createDonation, getDonation, getDonations, getDonationsByUser, deleteDonation, updateDonation } from'../controllers/donation.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

router.route('/all').get(getDonations);
router.route('/user/:userId').get(getDonationsByUser);
router.route('/:donationId').get(getDonation);
router.route('/:userId/new').post(isAuthenticated,createDonation);
router.route('/:id/update').put(updateDonation);
router.route('/:id/delete').delete(deleteDonation);



export default router; 