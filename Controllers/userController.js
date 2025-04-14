const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Booking = require("../models/Booking"); 
const Event = require("../models/event");

// Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, role: user.role, email: user.email } },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );
};

// @desc    Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default to "user"
    });

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @desc    Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
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
};

// @desc    Get current user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error: error.message });
  }
};

// @desc    Update current user's profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};


const forgetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error: error.message });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "organizer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
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
};
const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ user, msg: "User deleted successfully" , user: userToDelete });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// @desc    Get current user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated user's token

    // Fetch bookings based on userId (you can adjust this according to how bookings are stored)
    const bookings = await Booking.find({ user: userId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    return res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings: bookings,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the authenticated user's token

    // Check if the user is an EventOrganizer
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Forbidden: Only Event Organizers can access events" });
    }

    // Fetch the events based on the userId (assuming events are associated with user)
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
};
const getUserEventAnalytics = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated user's token

    // Check if the user is an EventOrganizer
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Forbidden: Only Event Organizers can access event analytics" });
    }

    // Fetch all events organized by the user
    const events = await Event.find({ organizer: userId });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for this organizer" });
    }

    // Analytics calculations
    const totalEvents = events.length;
    const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
    const pastEvents = totalEvents - upcomingEvents;
    const totalParticipants = events.reduce((sum, event) => sum + (event.participants || []).length, 0); // Assuming events have a 'participants' field
    const averageParticipants = totalEvents > 0 ? totalParticipants / totalEvents : 0;

    // You can add more analytics based on your event data model (e.g., revenue, cancellations, etc.)

    return res.status(200).json({
      message: "Event analytics retrieved successfully",
      analytics: {
        totalEvents,
        upcomingEvents,
        pastEvents,
        totalParticipants,
        averageParticipants
        // Include other metrics as needed
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching event analytics", error: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgetPassword,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserBookings,
  getUserEvents,
  getUserEventAnalytics
  
  
};