// const express = require("express");
// const router = express.Router();
// const bookingController = require("../Controllers/BookingController");
// const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
// const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

// // Get current user’s bookings
// router.get("/users/bookings",authenticationMiddleware,authorizationMiddleware(["standard"]),bookingController.getUserBookings
// );

// //Book tickets for an event
// router.post("/bookings",authenticationMiddleware,authorizationMiddleware(["standard"]),bookingController.createBooking
// );

// //Get booking details by ID
// router.get("/bookings/:id",authenticationMiddleware,authorizationMiddleware(["standard"]),bookingController.getBookingById
// );

// // Cancel a booking
// router.delete("/bookings/:id",authenticationMiddleware,authorizationMiddleware(["standard"]),bookingController.cancelBooking
// );

// module.exports = router;


const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/BookingController");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

// Get current user’s bookings
router.get("/users/bookings",authenticationMiddleware,authorizationMiddleware(["user"]),bookingController.getUserBookings
);

//Book tickets for an event
router.post("/bookings",authenticationMiddleware,authorizationMiddleware(["user"]),bookingController.createBooking
);

//Get booking details by ID
router.get("/bookings/:id",authenticationMiddleware,authorizationMiddleware(["user"]),bookingController.getBookingById
);

// Cancel a booking
router.delete("/bookings/:id",authenticationMiddleware,authorizationMiddleware(["user"]),bookingController.cancelBooking
);

module.exports = router;
