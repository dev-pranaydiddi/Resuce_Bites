import express from 'express';
import {Request} from '../models/request.model.js';
import {User} from '../models/user.model.js';
import { applyDonation,getApplicants, getAppliedDonations, updateStatus} from '../controllers/request.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';


const router = express.Router();

router.route('/all').get(isAuthenticated,getAppliedDonations);
router.route('/apply/:donationId').post(isAuthenticated,applyDonation)
router.route('/applicants/:donationId').get(isAuthenticated, getApplicants);
router.route("/status/:requestId/update").put(isAuthenticated, updateStatus);
// router.route('/recipient/:recipientId').get(isAuthenticated,getRequestsByRecipient);
// router.route('/update/:requestId').put(isAuthenticated,updateRequest);
// router.route('/delete/:requestId').delete(isAuthenticated,deleteRequest);
// router.route('/:userId/all').get(isAuthenticated, getRequestsByUser);
// router.route('/:requestId').get(isAuthenticated,getRequest);

export default router;