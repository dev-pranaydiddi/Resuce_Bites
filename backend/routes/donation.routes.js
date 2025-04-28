import express from 'express';
const router = express.Router();
import {Donation} from '../models/donation.model.js';
import { User } from '../models/user.model.js';
import { Request } from '../models/request.model.js';
import mongoose from 'mongoose';
import { createDonation, getDonation, getDonations, getDonationsByUser, deleteDonation,getDonationsByStatus, updateDonationStatus, updateDonation } from'../controllers/donation.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

router.route('/all').get(getDonations);
router.route('/new').post(isAuthenticated,createDonation);
router.route('/all/:status').get(getDonationsByStatus);
router.route('/user/:userId').get(isAuthenticated,getDonationsByUser);
router.route('/update/:donationId').put(isAuthenticated, updateDonation);
router.route('/status/:donationId/update').put(isAuthenticated,updateDonationStatus);
router.route('/delete/:donationId').delete(isAuthenticated,deleteDonation);
router.route('/:donationId').get(getDonation);



export default router; 