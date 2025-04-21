import express from 'express';
import {Request} from '../models/request.model.js';
import {User} from '../models/user.model.js';
import { deleteRequest, getRequest, getRequests, getRequestsByRecipient, getRequestsByUser, updateRequest } from '../controllers/request.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';


const router = express.Router();

router.route('/all').get(isAuthenticated,getRequests);
router.route('/recipient/:recipientId').get(isAuthenticated,getRequestsByRecipient);
router.route('/update/:requestId').put(isAuthenticated,updateRequest);
router.route('/delete/:requestId').delete(isAuthenticated,deleteRequest);
router.route('/:requestId').get(isAuthenticated,getRequest);
router.route('/:userId').get(isAuthenticated, getRequestsByUser);

export default router;