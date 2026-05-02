const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    isFlagged: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Reply', replySchema);
