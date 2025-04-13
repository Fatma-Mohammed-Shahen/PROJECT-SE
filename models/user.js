const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    password: { type: String, required: true },
    role: { type: String,
    enum: ['admin', 'organizer', 'user'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);