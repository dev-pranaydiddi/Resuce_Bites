import express from 'express';
import {Request} from '../models/request.model.js';
import {User} from '../models/user.model.js';
import { createRequest, deleteRequest, getRequest, getRequestsByRecipient, getRequestsByUser, updateRequest } from '../controllers/request.controller.js';


const router = express.Router();

router
    .route('/request')
    .post(createRequest);
router.route('/update').post(updateRequest);
router.route('/delete').get(deleteRequest);
router.route('/users').get(getRequest);
router.route('/:id').get( getRequestsByUser);
router.route('/:id/recipient').get(getRequestsByRecipient);

export default router;  