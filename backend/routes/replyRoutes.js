const express = require('express');
const router = express.Router({ mergeParams: true });
const { getRepliesByPostId, createReply, deleteReply } = require('../controllers/replyController');
const { protect } = require('../middleware/authMiddleware');
const { postReplyLimiter } = require('../middleware/rateLimitMiddleware');

// These will be nested under /api/posts/:id/replies in server.js or handled here
router.route('/')
    .get(getRepliesByPostId)
    .post(protect, postReplyLimiter, createReply);

// This will be /api/replies/:id
router.delete('/:id', protect, deleteReply);

module.exports = router;
