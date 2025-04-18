import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secret_Key = process.env.SECRET_KEY;


// Function to register a new user
export const registerUser = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({ email, password: hashedPassword, name, role });

    // Create a token for the user using jwt.sign
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    // Set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true, // Ensures the cookie is accessible only by the web server
      secure: process.env.NODE_ENV === "production", // If in production, only send cookie over HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiry time
    });

    // Send success response
    res.status(201).json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Log the request body for debugging
    // Check if email and password are provided
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    // Log the password and the hash to check them

    // Compare the password with the hashed password in the database

    //const hash = await bcrypt.hash(password, 10);
    const auth = await bcrypt.compare(password, user.password);// This will tell if it's matching or not
    if (!auth) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Create a token for the user
    const token = jwt.sign({ id: user._id }, secret_Key, { expiresIn: '1d' });

    // Set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true,  // Ensures the cookie is accessible only by the web server
      secure: process.env.NODE_ENV === 'production', // If in production, only send cookie over HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Optional: Set an expiry time for the cookie (1 day)
    });

    // Send success response
    res.status(200).json({ user: user, message: 'User logged in successfully', success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      user,
      success: true
    }
    );
  } catch (err) {
    console.log(err);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    // Filter out sensitive information

    res.status(200).json({ message: 'Users retrieved successfully', success: true, users: users });
  } catch (err) {
    console.log(err);
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res.clearCookie("token").status(200).json({
      message: "Logged out successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
  }
}
