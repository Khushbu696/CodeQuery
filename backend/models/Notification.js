const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['reply', 'abuse_warning', 'account_blocked', 'account_unblocked'], 
        required: true 
    },
    message: { type: String, required: true },
    relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
