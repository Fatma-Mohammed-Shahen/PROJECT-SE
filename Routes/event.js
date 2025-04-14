const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/EventController');
const authenticate = require("../Middleware/authenticationMiddleware");
const authorize = require("../Middleware/authorizationMiddleware");

// Public route: Any user can access this
router.get("/events", eventController.getAllEvents);

// Protected routes
// Only authenticated users can access the event details
router.get("/events/:id", authenticate, eventController.getEventById);

// Only event organizers can create events
router.post("/events", authenticate, authorize(["organizer"]), eventController.createEvent);

// Only event organizers can update their own events
router.put("/events/:id", authenticate, authorize(["organizer"]), eventController.updateEvent);

// Only event organizers and admins can delete an event
router.delete("/events/:id", authenticate, authorize(["organizer", "admin"]), eventController.deleteEvent);

module.exports = router;
