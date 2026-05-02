const mongoose = require('mongoose');

const abuseLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    contentType: { type: String, enum: ['Post', 'Reply'], required: true },
    reason: { type: String, required: true },
    confidence: { type: Number, required: true },
    contentSnippet: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AbuseLog', abuseLogSchema);
