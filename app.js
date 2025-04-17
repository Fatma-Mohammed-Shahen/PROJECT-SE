require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser"); // Only needed if you're using cookies
const authRoutes = require("./Routes/auth");   // You need this!
const userRoutes = require("./Routes/user");
const bookingRoutes = require("./Routes/booking"); // You need this!
const eventRoutes = require("./Routes/event"); // You need this!

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the Event Ticketing Backend!");
});

// MongoDB connection
const db_url = `${process.env.DB_URL}/${process.env.DB_NAME}`;
mongoose.connect(db_url)
  .then(() => console.log(" MongoDB connected successfully"))
  .catch((err) => console.error(" MongoDB connection error:", err));


// Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookingRoutes);
app.use("/api/v1", eventRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});