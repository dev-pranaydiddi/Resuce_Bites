const express = require('express');
const router = express.Router();
const Donation = require('../models/donation.model');
const User = require('../models/User');
const Request = require('../models/Request');
const mongoose = require('mongoose');
const { createDonation, getDonation, getDonations, getDonationsByUser, deleteDonation, updateDonation } = require('../controllers/donation.controller');

router.route('/').get(getDonation);
router.route('/all').get(getDonations);
router.route('/:userId/new').post(createDonation);
router.route('/:userId').get(getDonationsByUser);
router.route('/:id/update').put(updateDonation);
router.route('/:id/delete').delete(deleteDonation);




// router.router('/donation').post( 


// router.get('/donation/:id',


// router.put('/donation/:id', 

// router.delete('/donation/:id',


// router.post('/donation/request',


// router.get('/donation/request/:id',


// router.put('/donation/request/:id',


// router.delete('/donation/request/:id',
 

// module.exports = router;    