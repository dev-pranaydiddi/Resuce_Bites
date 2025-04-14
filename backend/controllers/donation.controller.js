import { Donation } from '../models/donation.model.js';
import { Request } from '../models/request.model.js';
import { User } from '../models/user.model.js';
import { getUser } from './user.controller.js';
export const createDonation = async (req, res) => {
    try {
        const { foodType, quantity, pickupAddress, pickupTime, pickupLocationName, expiryTime, status, description, name } = req.body;

        // Check required fields
        if (!name || !foodType || !quantity || !pickupAddress || !pickupTime || !pickupLocationName || !expiryTime || !status || !description) {
            return res.status(400).json({ message: "Please provide all the required fields", success: false });
        }
        const donor = req.id;
        console.log("Donor ID:", donor);
        //check if the donation already exists in the user data
        const user = await User.findById(donor).populate('donation').populate('delivery').populate('request');
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        // Check if the user has already made a donation with the same details
        let existingDonation = false;
        user.donation.forEach((donation) => {
            if (donation.name === name) {
                existingDonation = true;
                return res.status(400).json({ message: "Donation already exists", success: false });
            }
        });

        console.log("Existing Donation:", existingDonation);
        console.log("name:", name);
        // Get the donor's ID from the authenticated request (make sure your authentication middleware sets req.id)


        // Create a new Donation document using your Donation model
        const donation = new Donation({ name, foodType, quantity, pickupAddress, pickupTime, pickupLocationName, expiryTime, status, description, donor });
        console.log("Donation:", donation);
        if (donation && user.role === 'DONOR') {
            // create a new request using the request model
            const request = new Request({ donation: donation._id, donor: user._id, status: 'PENDING' });
            donation.request = request._id;
            user.donation.push(donation._id);
            await request.save();
            await donation.save();
            await user.save();
        }
        else {
            return res.status(403).json({ message: "You are not authorized to create a donation", success: false });
        }
        // Respond with success
        res.status(201).json({ message: "Donation created successfully", success: true, donation: donation, user });
    } catch (err) {
        console.error("Error creating donation:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getDonationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const donations = await User.findById(userId).populate('donation').populate('delivery').populate('request');
        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: 'No donations found at this time.', success: false });
        }
        res.status(200).json({ message: 'Donations retrieved successfully', success: true, donations: donations });
    }
    catch (error) {
        console.error('Error retrieving donations:', error);
        res.status(500).json({ message: 'Error retrieving donations', success: false });
    }
};

export const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 }).populate('recipient').populate('request').populate('delivery').populate('donor');
        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: 'No donations found at this time.', success: false });
        }
        res.status(200).json({ message: 'Donations retrieved successfully', success: true, donations: donations });
    }
    catch (error) {
        console.error('Error retrieving donations:', error);
        res.status(500).json({ message: 'Error retrieving donations', success: false });
    }
};

export const getDonation = async (req, res) => {
    try {
        const { donationId } = req.params;
        console.log("Donation ID:", donationId);
        const donation = await Donation.findById(donationId).populate('recipient').populate('request').populate('delivery').populate('donor');
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found.', success: false });
        }
        res.status(200).json({ message: 'Donation retrieved successfully', success: true, donation: donation });
    }
    catch (error) {
        console.error('Error retrieving donation:', error);
        // res.status(500).json({ message: 'Error retrieving donation', success: false });
    }
};

export const updateDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const { foodType, quantity, location, description, status } = req.body;
        if (!id || !foodType || !quantity || !location || !description) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }
        const donation = await Donation.findById(id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found', success: false });
        }
        if (status === 'DELIVERED') {
            const request = await Request.findById(delivery.request);
            request.status = 'APPROVED';
            await request.save();
        }
        const updatedDonation = await Donation.findByIdAndUpdate(id, { foodType, quantity, location, description });
        res.status(200).json({ message: 'Donation updated successfully', success: true, donation: updatedDonation });
    }
    catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({ message: 'Error updating donation', success: false });
    }
};

export const deleteDonation = async (req, res) => {
    try {
        const { id } = req;
        const { donationId } = req.params;
        if (!donationId) {
            return res.status(400).json({ message: 'Please provide a valid id' });
        }
        const donation = await Donation.findByIdAndDelete(donationId);
        const user = await User.findById(id);
        user.donation.pull(donationId);
        await user.save();
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found', success: false });
        }
        res.status(200).json({ message: 'Donation deleted successfully', success: true, donation: donation });
    }
    catch (error) {
        console.error('Error deleting donation:', error);
        res.status(500).json({ message: 'Error deleting donation', success: false });
    }
};


