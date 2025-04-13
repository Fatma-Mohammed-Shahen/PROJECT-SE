const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const authenticate = require("../Middleware/authenticationMiddleware");
const authorize = require("../Middleware/authorizationMiddleware");

// User Profile Routes (Any role)
router.get("/users/profile", authenticate, userController.getProfile);
router.put("/users/profile", authenticate, userController.updateProfile);

// Admin-only route example
router.get("/users", authenticate, authorize(["admin"]), async (req, res) => {
  const users = await require("../models/user").find();
  res.json(users);
});

module.exports = router;
