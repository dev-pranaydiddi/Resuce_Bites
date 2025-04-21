import express from 'express';
import {Request} from '../models/request.model.js';
import {User} from '../models/user.model.js';
import { deleteRequest, getRequest, getRequestsByRecipient, getRequestsByUser, updateRequest } from '../controllers/request.controller.js';


const router = express.Router();


// router.route('/users').get(getRequestsByUser);
router.route('/recipient/:recipientId').get(getRequestsByRecipient);
router.route('/update/:requestId').put(updateRequest);
router.route('/inactive/:requestId').delete(inactiveRequest);
router.route('/:requestId').get(getRequest);
router.route('/:userId').get( getRequestsByUser);

export default router;