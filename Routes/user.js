const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const authenticate = require("../Middleware/authenticationMiddleware");
const authorize = require("../Middleware/authorizationMiddleware");

// User Profile Routes (Any role)
router.get("/users/profile", authenticate, userController.getProfile);
router.put("/users/profile", authenticate, userController.updateProfile);
router.put("/forgetPassword", userController.forgetPassword);
router.get("/users/bookings", authenticate, userController.getUserBookings);

//event organizer
router.get("/users/events", authenticate, userController.getUserEvents);
router.get("/users/events/analytics", authenticate, userController.getUserEventAnalytics);

// Admin-only route example
router.get("/users", authenticate, authorize(["admin"]), async (req, res) => {
  const users = await require("../models/user").find();
  res.json(users);
});
router.get("/users/:id", authenticate, authorize(["admin"]), userController.getUserById);
router.put("/users/:id", authenticate, authorize(["admin"]), userController.updateUserRole);
router.delete("/users/:id", authenticate, authorize(["admin"]), userController.deleteUser);

module.exports = router;
