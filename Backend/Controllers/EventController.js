const Event = require('../models/event');

// Public: Get all approved events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find({});
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

// Public: Get single event details
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err.message });
  }
};

// Organizer: Create a new event
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      status: 'pending', // Force status to 'pending' regardless of what organizer sends
      remaining_tickets: req.body.total_tickets,
      organizer: req.user.id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

// Organizer: Update event (tickets, date, location)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { total_tickets, date, location } = req.body;
    if (total_tickets) {
      const ticketsDiff = total_tickets - event.total_tickets;
      event.remaining_tickets += ticketsDiff;
      event.total_tickets = total_tickets;
    }

    if (date) event.date = date;
    if (location) event.location = location;

    await event.save();
    res.json({ message: 'Event updated', event });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

// Organizer or Admin: Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};

// Organizer: View their events with analytics
const getOrganizerAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const analytics = events.map(event => {
      const booked = event.total_tickets - event.remaining_tickets;
      const percentageBooked = (booked / event.total_tickets) * 100;
      return {
        title: event.title,
        percentageBooked: Math.round(percentageBooked),
      };
    });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get analytics', error: err.message });
  }
};

////here only admins can change the status

const changeEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'pending', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json({ message: 'Event status updated', event });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// Organizer: Get their own events (not just analytics)
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get your events', error: err.message });
  }
};


module.exports = {
  getAllEvents,
  getAllEventsAdmin,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerAnalytics,
  changeEventStatus,
  getOrganizerEvents,
};

