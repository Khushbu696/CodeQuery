const express = require('express');
const router = express.Router();
const { getUsers, blockUser, unblockUser, getFlaggedContent, deleteContent, getStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/users', getUsers);
router.patch('/users/:id/block', blockUser);
router.patch('/users/:id/unblock', unblockUser);
router.get('/flagged', getFlaggedContent);
router.delete('/content/:type/:id', deleteContent);
router.get('/stats', getStats);

module.exports = router;
