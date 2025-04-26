import express from 'express';
import {Request} from '../models/request.model.js';
import {User} from '../models/user.model.js';
import { deleteRequest, getRequest, getRequests,applyRequest, getRequestsByRecipient, getRequestsByUser, updateRequest } from '../controllers/request.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';


const router = express.Router();

router.route('/all').get(isAuthenticated,getRequests);
router.route('/apply/:donationId').post(isAuthenticated,applyRequest)
router.route('/recipient/:recipientId').get(isAuthenticated,getRequestsByRecipient);
router.route('/update/:requestId').put(isAuthenticated,updateRequest);
router.route('/delete/:requestId').delete(isAuthenticated,deleteRequest);
router.route('/:userId/all').get(isAuthenticated, getRequestsByUser);
router.route('/:requestId').get(isAuthenticated,getRequest);

export default router;