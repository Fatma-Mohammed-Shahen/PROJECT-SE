const Booking = require("../models/Booking");
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

      if (event.availableTickets < ticketsBooked) {  // Check ticket availability
        return res.status(400).json({ message: "Not enough tickets available" });
      }

      event.availableTickets -= ticketsBooked;  // Reduce available tickets
      await event.save();

      const totalPrice = event.ticketPrice * ticketsBooked;  // Calculate total price
      const booking = new Booking({ user: req.user._id, event: eventId, ticketsBooked, totalPrice, status: "confirmed" });
      const savedBooking = await booking.save();

      res.status(201).json({ message: "Booking successful", booking: savedBooking });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // View booking by ID - EXTRA
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate("event");

      if (!booking || booking.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: "Booking not found or unauthorized access" });
      }

      res.status(200).json(booking);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Authenticated standard users can cancel their booking but keep in mind logic of deleting will increase number of tickets.
  cancelBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking || booking.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: "Booking not found or unauthorized access" });
      }

      const event = await Event.findById(booking.event);
      event.availableTickets += booking.ticketsBooked;  // Refund tickets
      await event.save();

      booking.status = "canceled";  // Update booking status
      await booking.save();

      res.status(200).json({ message: "Booking canceled and tickets refunded", booking });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = bookingController;
