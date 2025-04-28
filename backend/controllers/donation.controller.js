import { Delivery } from '../models/delivery.model.js';
import { Donation } from '../models/donation.model.js';
import { Request } from '../models/request.model.js';
import { User } from '../models/user.model.js';
import { getUser } from './user.controller.js';
export const createDonation = async (req, res) => {
    try {
        const { foodType, quantity, pickUpAddress, expiryTime, description, name } = req.body;

        // Check required fields
        console.log("Name:", name, "Food Type:", foodType, "Quantity:", quantity, "Pickup Address:", pickUpAddress, "Expiry Time:", expiryTime, "Description:", description);
        if (!name || !foodType || !quantity || !pickUpAddress || !expiryTime || !description) {
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
        // Create a new Donation document using your Donation model
        const donation = new Donation({ name, foodType, quantity, pickUpAddress, expiryTime, description, donor });
        console.log("Donation:", donation);
        if (donation && user.role === 'DONOR') {
            user.donation.push(donation._id);
            console.log("saved");
            await donation.save();
            await user.save();
        }
        else {
            return res.status(403).json({ message: "You are not authorized to create a donation", success: false });
        }
        // Respond with success
        console.log("Donation:", donation);
        return res.status(201).json({ message: "Donation created successfully", success: true, donation: donation, user });
    } catch (err) {
        console.error("Error creating donation:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getDonationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const donations = await User.findById(req.id).populate('donation').populate('delivery').populate('request');
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
      // 1) Auto‐expire any past‐expiry donations
      const now = new Date();
      await Donation.updateMany(
        {
          expiryTime: { $lte: now },
          status: { $ne: 'EXPIRED' }
        },
        { status: 'EXPIRED' }
      );
  
      // 2) Fetch all with populated subdocuments
      const donations = await Donation.find()
        .sort({ createdAt: -1 })
        .populate('recipient')
        .populate({
          path: 'requests',
          options: { sort: { createdAt: -1 } },
          populate: { path: 'applicant' }
        })
        .populate('delivery')
        .populate('donor');
  
      if (!donations.length) {
        return res
          .status(404)
          .json({ success: false, message: 'No donations found at this time.' });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Donations retrieved successfully',
        donations
      });
    } catch (error) {
      console.error('Error retrieving donations:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Error retrieving donations' });
    }
  };
export const getDonationsByStatus = async (req, res) => {
    try {
        let status = req.params.status.toUpperCase();
        console.log("Status:", status);
        const donations = await Donation.find({ status: status }).sort({ createdAt: -1 }).populate('recipient').populate('request').populate('delivery').populate('donor');
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
        const donation = await Donation.findById(donationId).sort({ createdAt: -1 }).populate('recipient').populate({
            path: 'requests',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        }).populate('delivery').populate('donor');
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



export const updateDonationStatus = async (req, res) => {
    try {
        const NEXT = {
            AVAILABLE: ['RESERVED','REJECTED', 'CANCELLED'],
            RESERVED: ['IN_TRANSIT'],
            IN_TRANSIT: [],            // cannot manually go to DELIVERED
            DELIVERED: [],            // terminal
            REJECTED: [],            // terminal
            CANCELLED: [],            // terminal
            EXPIRED: [],            // terminal (system only)
        };
        const { donationId } = req.params;
        let { status: tgt } = req.body;
        console.log("Donation ID:", donationId, "Status:", tgt);
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        // **AUTO-EXPIRE** if past expiryTime
        if (donation.expiryTime && new Date(donation.expiryTime) < new Date() && donation.status !== 'EXPIRED') {
            console.log("Donation has expired.");
            donation.status = 'EXPIRED';
            await donation.save();
            return res.status(200).json({
                success: true,
                message: 'Donation has expired.',
                donation,
            });
        }

        // Manual change
        if (!tgt) {
            return res.status(400).json({ success: false, message: 'Must supply status' });
        }
        const newStatus = tgt.toUpperCase();
        const cur = donation.status.toUpperCase();

        if (cur === newStatus) {
            return res.status(400).json({ success: false, message: `Already "${cur}".` });
        }

        const allowed = NEXT[cur] || [];
        if (!allowed.includes(newStatus)) {
            return res.status(400).json({
                success: false,
                scroll:false,
                message: `Cannot transition from "${cur}" to "${newStatus}".`,
            });
        }
        if(newStatus ==='CANCELLED' && cur ==='AVAILABLE'){
            donation.status = newStatus;
            console.log("recieved req")
            await donation.save();
            return res.status(200).json({
                success: true,
                scroll:true,
                message: `DONATION CANCELLED`,
            })
        
        }
        if (newStatus ==='CANCELLED' && cur !=='AVAILABLE'){
            return res.status(400).json({
                success: false,
                scroll:false,
                message: `Cannot "${newStatus}" the Current Donation at this state.`,
            })
        }
        if(newStatus === 'RESERVED' && cur === 'AVAILABLE') {
            return res.status(400).json({
                success: false,
                scroll:true,
                message: `Accept any applicants request to get the donation reserved`,
            });
        }
        if(newStatus === 'IN_TRANSIT' && cur === 'RESERVED')
        {
            donation.status = newStatus;
            const delivery = await Delivery.findById(donation.delivery);
            if(delivery.volunteer === null || delivery.volunteer === undefined){
                return res.status(400).json({
                    success: false,
                    scroll:false,
                    message: `Volunteer is not Assigned to this delivery`,
                });
            }
            if(delivery.status === 'ACCEPTED') 
                delivery.status = 'PICKED_UP';
            else if(delivery.status ==='PENDING'){
                return res.status(400).json({
                    success: false,
                    scroll:false,
                    message: `Delivery is not Accepted by any Volunteer`,
                });
            }
            await donation.save();
            console.log("Delivery:", delivery);
            console.log("/n Donation:", donation);
            await delivery.save();
            // const newDeliver
            return res.status(200).json({
                success: true,
                scroll:false,
                message: `Status changed to ${newStatus}.`,
                donation,
            });
        }
        else if(newStatus === 'EXPIRED' && cur !== 'EXPIRED'){
            
        }
            donation.status = newStatus;
            await donation.save();

        return res.status(200).json({
            success: true,
            scroll:false,
            message: `Status changed to ${newStatus}.`,
            donation,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// controllers/donationController.js


export const updateDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const userId = req.id;
    const {
      name,
      description,
      foodType,
      quantity,
      pickUpAddress,
      expiryTime
    } = req.body;

    // 1) Find existing donation
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res
        .status(404)
        .json({ success: false, message: 'Donation not found' });
    }
    // (Optional) ensure only the original donor may update
    if (userId !== donation.donor.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    }

    // 2) Apply updates
    if (name !== undefined) donation.name = name;
    if (description !== undefined) donation.description = description;
    if (foodType !== undefined) donation.foodType = foodType;
    if (quantity !== undefined) {
      donation.quantity.amount = quantity.amount ?? donation.quantity.amount;
      donation.quantity.unit   = quantity.unit   ?? donation.quantity.unit;
    }
    if (pickUpAddress !== undefined) {
      donation.pickUpAddress.street  = pickUpAddress.street  ?? donation.pickUpAddress.street;
      donation.pickUpAddress.city    = pickUpAddress.city    ?? donation.pickUpAddress.city;
      donation.pickUpAddress.state   = pickUpAddress.state   ?? donation.pickUpAddress.state;
      donation.pickUpAddress.zip     = pickUpAddress.zip     ?? donation.pickUpAddress.zip;
      donation.pickUpAddress.country = pickUpAddress.country ?? donation.pickUpAddress.country;
      if (pickUpAddress.Geolocation?.coordinates) {
        donation.pickUpAddress.Geolocation.coordinates.lat  =
          pickUpAddress.Geolocation.coordinates.lat  ?? donation.pickUpAddress.Geolocation.coordinates.lat;
        donation.pickUpAddress.Geolocation.coordinates.long =
          pickUpAddress.Geolocation.coordinates.long ?? donation.pickUpAddress.Geolocation.coordinates.long;
      }
    }
    if (expiryTime !== undefined) {
      donation.expiryTime = new Date(expiryTime);
    }

    // 3) Save & respond
    const updated = await donation.save();
    return res.status(200).json({
      success: true,
      message: 'Donation updated successfully',
      donation: updated
    });
  } catch (err) {
    console.error('Error updating donation:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error' });
  }
};


export const deleteDonation = async (req, res) => {
    try {
        const { donationId } = req.params;
        if (!donationId) {
            return res.status(400).json({ message: 'Please provide a valid id' });
        }
        const currdonation = await Donation.findById(donationId);
        console.log("Current Donation:", currdonation);
        // check if the donation is already reserved
        if (currdonation.status === 'RESERVED') {
            return res.status(400).json({ message: 'Cant Delete, Cause Donation is already reserved', success: false });
        }

        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        user.donation.pull(donationId);
        await user.save();
        await Request.findByIdAndDelete(currdonation.request);
        const donation = await Donation.findByIdAndDelete(donationId);
        return res.status(200).json({ message: 'Donation deleted successfully', success: true, donation: donation });
    }
    catch (error) {
        console.error('Error deleting donation:', error);
        res.status(500).json({ message: 'Error deleting donation', success: false });
    }
};


