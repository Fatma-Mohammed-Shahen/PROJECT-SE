const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Booking = require("../models/booking"); 
const Event = require("../models/event");
//for bonus
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Helper: generate JWTs
const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, role: user.role, email: user.email } },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );
};

// @desc    Register a new user
const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Check if user exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user", // Default to "user"
      });

      // Generate token
      const token = generateToken(newUser);

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed", error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const currentDateTime = new Date();
      const expiresAt = new Date(+currentDateTime + 1800000); // 30 mins

      // Generate token
      const token = generateToken(user);

      res.cookie("token", token, {
        expires: expiresAt,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  },
  forgetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password are required" });
      }

      const user = await userModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update password", error: error.message });
    }
  },
};


const usersController = {
  // @desc    Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await userModel.findById(req.user.userId).select("-password"); // assuming req.user.userId from JWT
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile", error: error.message });
    }
  },
 // @desc    Update user profile
  updateProfile: async (req, res) => {
    try {
      const updates = req.body;

      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        req.user.userId,
        updates,
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
  },

};




const adminController = {
// @desc    Get all users (Admin only)
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.find().select("-password");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
  },
// @desc    Get user by ID (Admin only)
  getUserById: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error: error.message });
    }
  },

};

module.exports = {
  ...authController,
  ...usersController,
  ...adminController
};

