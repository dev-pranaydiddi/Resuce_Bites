import { Donation } from '../models/donation.model.js';
import { User } from '../models/user.model.js';
import { getUser } from './user.controller.js';
export const createDonation = async (req, res) => {
    try {
      const { foodType, quantity, pickupAddress, pickupTime, pickupLocationName, expiryTime, status, description } = req.body;
      
      // Check required fields
      if (!foodType || !quantity || !pickupAddress || !pickupTime || !pickupLocationName || !expiryTime || !status || !description) {
        return res.status(400).json({ message: "Please provide all the required fields", success: false });
      }
  
      // Get the donor's ID from the authenticated request (make sure your authentication middleware sets req.id)
      const donor = req.id;
      console.log("Donor ID:", donor);
  
      // Create a new Donation document using your Donation model
      const donation = new Donation({ foodType, quantity, pickupAddress, pickupTime, pickupLocationName, expiryTime, status, description, donor });
      const savedDonation = await donation.save();
  
      // Find the user using the helper function and update their donation array
      const user = await User.findById(donor);
      
      // Assumes that the User model has a donation field (an array) defined
      user.donation.push(savedDonation._id);
      await user.save();
  
      // Respond with success
      res.status(201).json({ message: "Donation created successfully", success: true, donation: savedDonation, user });
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
        console.log("Donation:", donation);
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
        const { foodType, quantity, location, description } = req.body;
        if (!id || !foodType || !quantity || !location || !description) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }
        const donation = await Donation.findById(id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found', success: false });
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
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Please provide a valid id' });
        }
        const donation = await Donation.findByIdAndDelete(id);
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


