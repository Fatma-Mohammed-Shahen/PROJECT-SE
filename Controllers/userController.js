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
  //this is for public
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

  //for bonus
  forgetPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await userModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const otp = crypto.randomBytes(3).toString('hex');
      const otpExpires = Date.now() + 15 * 60 * 1000;

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      console.log("OTP saved to DB:", user.otp);

      await sendOtpEmail(email, otp);

      res.status(200).json({ message: "OTP sent to your email address" });
    } catch (error) {
      res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
  },

  // Public - Step 2: Reset with OTP
  resetPasswordWithOtp: async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    try {
      const user = await userModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "OTP is invalid or has expired" });
      }

      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error: error.message });
    }
  },
};
//to send OTP email!
const sendOtpEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Hello!\nIt seems like you forgot your password.\nHere is your OTP for password reset: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
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

  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;

      if (!["user", "organizer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "User role updated",
        user,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update role", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userToDelete = await userModel.findById(req.params.id);
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }

      await userModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        msg: "User deleted successfully",
        user: userToDelete,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },



};

const organizerController = {
  getUserEvents: async (req, res) => {
    try {
      const userId = req.user.id; // Get the user ID from the authenticated user's token

      // Check if the user is an Event Organizer
      if (req.user.role !== "organizer") {
        return res.status(403).json({ message: "Forbidden: Only Event Organizers can access events" });
      }

      // Fetch the events based on the userId
      const events = await Event.find({ organizer: userId });

      if (!events || events.length === 0) {
        return res.status(404).json({ message: "No events found for this organizer" });
      }

      return res.status(200).json({
        message: "Events retrieved successfully",
        events: events,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching events", error: error.message });
    }
  },

};

module.exports = {
  ...authController,
  ...usersController,
  ...adminController,
  ...organizerController
};

