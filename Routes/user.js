const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const authenticate = require("../Middleware/authenticationMiddleware");
const authorize = require("../Middleware/authorizationMiddleware");

// User Profile Routes (Any role)
router.get("/users/profile", authenticate, userController.getProfile);
router.put("/users/profile", authenticate, userController.updateProfile);
router.put("/forgetPassword", userController.forgetPassword);
//bonus
router.put("/resetPasswordWithOtp", userController.resetPasswordWithOtp); // Reset password with OTP


// Admin-only route example
router.get("/users", authenticate, authorize(["admin"]), userController.getAllUsers);
router.get("/users/:id", authenticate, authorize(["admin"]), userController.getUserById);
router.put("/users/:id", authenticate, authorize(["admin"]), userController.updateUserRole);
router.delete("/users/:id", authenticate, authorize(["admin"]), userController.deleteUser);

//event organizer
router.get("/users/events", authenticate, userController.getUserEvents);

module.exports = router;