const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    images: [{ type: String }], // Cloudinary URLs
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    isFlagged: { type: Boolean, default: false },
}, { timestamps: true });

// Text index for search
postSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
