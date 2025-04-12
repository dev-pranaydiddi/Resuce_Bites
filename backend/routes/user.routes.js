import express from 'express';
// import mongoose from 'mongoose';
// import {User} from '../models/user.model.js';
import { registerUser, loginUser, logoutUser, getUser, getUsers } from '../controllers/user.controller.js';
import isAutenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();
router.route('/register').post(registerUser);
router.route('/login').post(isAutenticated,loginUser);
router.route('/logout').get(isAutenticated,logoutUser);
router.route('/users').get(isAutenticated,getUsers);
router.route('/:userId').get(isAutenticated,getUser);

export default router;