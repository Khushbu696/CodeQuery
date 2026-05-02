const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { postReplyLimiter } = require('../middleware/rateLimitMiddleware');

router.route('/')
    .get(getPosts)
    .post(protect, postReplyLimiter, createPost);

router.route('/:id')
    .get(getPostById)
    .delete(protect, deletePost);

module.exports = router;
