const Event = require('../models/event');

// Public - View all events
exports.getAllEvents = async (req, res) => {
    const events = await Event.find();
    res.json(events);
};

// Public - Get one event
exports.getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
};

// Organizer - Create event
exports.createEvent = async (req, res) => {
    const { title, description, location, date, price, totalTickets } = req.body;

    const event = new Event({
        title,
        description,
        location,
        date,
        price,
        totalTickets,
        availableTickets: totalTickets,
        createdBy: req.user._id, // From auth middleware
    });

    await event.save();
    res.status(201).json(event);
};

// Organizer/Admin - Update event
exports.updateEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    console.log('req.user:', req.user); // Log user info
    console.log('event.createdBy:', event.createdBy); // Log event creator info

    if (req.user.role !== 'admin' && req.user.role !== 'organizer') {
        return res.status(403).json({ message: "Access denied" });
    }

    const updates = ['location', 'date', 'totalTickets'];
    updates.forEach(field => {
        if (req.body[field] !== undefined) {
            event[field] = req.body[field];
        }
    });

    await event.save();
    res.json(event);
};

// Organizer/Admin - Delete event
exports.deleteEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Log for debugging
    console.log('req.user:', req.user);  // To make sure req.user is properly populated

    // Check if the user is an admin or an organizer
    if (req.user.role !== 'admin' && req.user.role !== 'organizer') {
        return res.status(403).json({ message: "Access denied: You must be an admin or organizer" });
    }

    // Proceed with deletion
    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
};


// Admin - Approve or decline event
exports.updateEventStatus = async (req, res) => {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!['approved', 'pending', 'declined'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    event.status = status;
    await event.save();
    res.json({ message: `Event ${status}` });
};
