const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    category: String,
    image: String,
    ticket_price :{type : Number},
    total_tickets: {
    type: Number,
    required: true,
    min: 0, // Ensure the total tickets cannot be negative
  },
    remaining_tickets: {
        type: Number,
        required: true,
        default: 0, // Ensure it has a default value
      },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
      },
    created_at: { type: Date, default: Date.now }
   
});

module.exports = mongoose.model('Event', eventSchema);
