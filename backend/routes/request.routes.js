import express from 'express';
import {Request} from '../models/request.model.js';
import {User} from '../models/user.model.js';
import { deleteRequest, getRequest, getRequestsByRecipient, getRequestsByUser, updateRequest } from '../controllers/request.controller.js';


const router = express.Router();


router.route('/users').get(getRequest);
router.route('/recipient/:recipientId').get(getRequestsByRecipient);
router.route('/update/:requestId').post(updateRequest);
router.route('/delete/:requestId').get(deleteRequest);
router.route('/:userId').get( getRequestsByUser);

export default router;