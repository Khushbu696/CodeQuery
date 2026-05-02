const mongoose = require('mongoose');

const rateLimitTrackerSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    endpoint: { type: String, required: true },
    attempts: { type: Number, default: 1 },
    lastAttempt: { type: Date, default: Date.now },
    isBlocked: { type: Boolean, default: false },
    blockExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('RateLimitTracker', rateLimitTrackerSchema);
