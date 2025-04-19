
const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/EventController");
const authenticate = require("../Middleware/authenticationMiddleware");
const authorize = require("../Middleware/authorizationMiddleware");

// Public routes
router.get("/events", eventController.getAllEvents);
router.get("/events/:id", eventController.getEventById);

// Organizer routes
router.post("/events", authenticate, authorize(["organizer"]), eventController.createEvent);
router.put("/events/:id", authenticate, authorize(["organizer", "admin"]), eventController.updateEvent);
router.delete("/events/:id", authenticate, authorize(["organizer", "admin"]), eventController.deleteEvent);
router.get("/users/events/analytics", authenticate, authorize(["organizer"]), eventController.getOrganizerAnalytics);

// Admin route
router.put("/events/:id/status", authenticate, authorize(["admin"]), eventController.changeEventStatus);

//admin
router.get("/events/all",  authenticate, authorize(["admin"]), eventController.getAllEventsAdmin);

module.exports = router;
