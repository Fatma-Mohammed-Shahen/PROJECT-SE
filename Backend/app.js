require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const cookieParser = require("cookie-parser"); // Only needed if you're using cookies
const authRoutes = require("./Routes/auth");   // You need this!
const userRoutes = require("./Routes/user");
const bookingRoutes = require("./Routes/booking"); // You need this!
const eventRoutes = require("./Routes/event"); // You need this!
const authenticationMiddleware=require('./Middleware/authenticationMiddleware')


require('dotenv').config();


// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
    
  })
);

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

//
app.use(authenticationMiddleware);
//

app.use("/api/v1", userRoutes);
app.use("/api/v1", bookingRoutes);
app.use("/api/v1", eventRoutes);


app.use(function (req, res, next) {
  return res.status(404).send("404");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});