
const Booking = require("../models/booking");
const Event = require("../models/event");

const bookingController = {
    
  // Authenticated standard users can view their bookings
  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user._id }).populate("event");
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Authenticated standard users can book tickets of an event
  createBooking: async (req, res) => {
    try {
      const { eventId, ticketsBooked } = req.body;
      const event = await Event.findById(eventId);
      
      if (!event || event.status !== "approved") {
        return res.status(404).json({ message: "Event not found or not approved" });
      }
      
      if (event.remaining_tickets < ticketsBooked) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }
      
      // Check if ticket_price is a valid number
      if (typeof event.ticket_price !== "number" || isNaN(event.ticket_price)) {
        return res.status(400).json({ message: "Event price is missing or invalid" });
      }
  
      // Check if ticketsBooked is a valid number
      if (typeof ticketsBooked !== "number" || isNaN(ticketsBooked)) {
        return res.status(400).json({ message: "Invalid number of tickets booked" });
      }
  
      // Calculate the total price
      const totalPrice = event.ticket_price * ticketsBooked;
  
      // Check if totalPrice is a valid number
      if (isNaN(totalPrice)) {
        return res.status(400).json({ message: "Failed to calculate total price" });
      }
  
      // Update remaining tickets and save event
      event.remaining_tickets -= ticketsBooked;
      await event.save();
  
      const booking = new Booking({
        user: req.user.id, // or _id depending on your decoded token
        event: eventId,
        eventName: event.title,  // add event title here!
        ticketsBooked,
        totalPrice,
        status: "confirmed"
      });
  
      const savedBooking = await booking.save();
  
      res.status(201).json({ message: "Booking successful", booking: savedBooking });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },


  // View booking by ID - EXTRA
  getBookingById : async (req, res) => {
    try {
      // Fetch booking by ID, populating both event and user fields
      const booking = await Booking.findById(req.params.id)
        .populate("event")
        .populate("user");  // Ensure 'user' field is populated too
  
      // Log the booking object to check if 'user' is populated correctly
      console.log("Booking:", booking);
  
      // If booking is not found, return 404
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // If user field is missing or null, return error
      if (!booking.user) {
        return res.status(404).json({ message: "Booking does not have a valid user" });
      }
  
      // Compare the user._id with req.user.id
      if (booking.user._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      // Return the booking details if everything is valid
      res.status(200).json(booking);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  

  // Authenticated standard users can cancel their booking but keep in mind logic of deleting will increase number of tickets.
  cancelBooking : async (req, res) => {
    console.log("User ID from token:", req.user?.id);  // Debugging log
    console.log("Booking ID from params:", req.params.id);  // Debugging log
  
    try {
      const booking = await Booking.findById(req.params.id);
  
      if (!booking || booking.user.toString() !== req.user.id.toString()){
        return res.status(404).json({ message: "Booking not found or unauthorized access" });
      }
  
      const event = await Event.findById(booking.event);
      event.availableTickets += booking.ticketsBooked;  // Refund tickets
      await event.save();
  
      booking.status = "canceled";  // Update booking status
      await booking.save();
  
      res.status(200).json({ message: "Booking canceled and tickets refunded", booking });
    } catch (err) {
      console.error("Error canceling booking:", err);  // Debugging log
      res.status(500).json({ message: err.message });
    }
  },
};
////
module.exports = bookingController;