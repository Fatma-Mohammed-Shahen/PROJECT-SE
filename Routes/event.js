const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/EventController');
const { protect } = require('../Middleware/authenticationMiddleware');
const { authorizeRoles } = require('../Middleware/authorizationMiddleware');

// Public route
router.get('/', eventController.getAllEvents);

// Protected routes
router.get('/:id', protect, eventController.getEventById);
router.post('/', protect, authorizeRoles('organizer'), eventController.createEvent);
router.put('/:id', protect, authorizeRoles('organizer'), eventController.updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), eventController.deleteEvent);

module.exports = router;
