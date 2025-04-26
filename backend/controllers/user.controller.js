// src/controllers/authController.js
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Register a new user with full profile
export const registerUser = async (req, res) => {
  try {
    // console.log("Registering user:", req.body);
    const { email, password, role, name, phone, address, bio } = req.body.userData;
    console.log("Registering user:", req.body.userData);
    // console.log("email:", email, "password:", password, "name:", name, "role:", role, "phone:", phone, "address:", address, "bio:", bio, "address:", address, "address.orgName:", address.orgName, "address.street:", address.street, "address.city:", address.city, "address.state:", address.state, "address.zip:", address.zip, "address.country:", address.country);

    if (!email || !password || !name?.first || !name?.last || !role  || !address.street || !address.city || !address.state || !address.zip || !address.country) {
      return res.status(400).json({ message: 'Missing required fields', success: false });
    }
    
    // orgName: "",
    //   street: "",
    //   city: "",
    //   state: "",
    //   zip: "",
    //   country: "",
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      phone: phone || null,
      address: address || {},
      bio: bio || ''
    });

    const payload = { id: user._id, user };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    const { password: _, ...userData } = user.toObject();
    return res.status(201).json({ message: 'User registered', success: true, user: userData });
  } catch (err) {
    console.error('registerUser error:', err);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

// Login existing user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.userData;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required', success: false });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }

    const payload = { id: user._id, user };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    const { password: _, ...userData } = user.toObject();
    return res.json({ message: 'Logged in', success: true, user: userData });
  } catch (err) {
    console.error('loginUser error:', err);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get session info
export const getSession = (req, res) => {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.json({ success: false });
  try {
    const { user } = jwt.verify(token, SECRET_KEY);
    return res.json({ success: true, user });
  } catch (err) {
    console.error('getSession error:', err);
    return res.json({ success: false });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  try {
    res.clearCookie('token').status(200).json({ message: 'Logged out Successfully', success: true });
  }
  catch (err) {
    console.error('logoutUser error:', err);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get single user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found', success: false });
    return res.json({ success: true, user });
  } catch (err) {
    console.error('getUser error:', err);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};
