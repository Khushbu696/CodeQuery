const User = require('../models/User');
const Post = require('../models/Post');
const Reply = require('../models/Reply');
const AbuseLog = require('../models/AbuseLog');
const Notification = require('../models/Notification');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.is_blocked = true;
            await user.save();
            
            await Notification.create({
                recipient: user._id,
                type: 'account_blocked',
                message: 'Your account has been blocked by an administrator.'
            });

            res.json({ message: 'User blocked' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unblockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.is_blocked = false;
            user.abuse_count = 0; // Reset abuse count on manual unblock
            await user.save();

            await Notification.create({
                recipient: user._id,
                type: 'account_unblocked',
                message: 'Your account has been unblocked by an administrator.'
            });

            res.json({ message: 'User unblocked' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFlaggedContent = async (req, res) => {
    try {
        const logs = await AbuseLog.find({}).populate('user', 'username email').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteContent = async (req, res) => {
    try {
        // Here we could handle both posts and replies, but for simplicity let's assume we pass type in query or body
        const { type, id } = req.params;
        if (type === 'post') {
            await Post.findByIdAndDelete(id);
        } else {
            await Reply.findByIdAndDelete(id);
        }
        res.json({ message: 'Content deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const totalReplies = await Reply.countDocuments();
        const flaggedCount = await AbuseLog.countDocuments();
        const blockedUsers = await User.countDocuments({ is_blocked: true });

        // Growth stats (simulated for now, real implementation would group by date)
        const postsOverTime = await Post.aggregate([
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalUsers,
            totalPosts,
            totalReplies,
            flaggedCount,
            blockedUsers,
            postsOverTime
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, blockUser, unblockUser, getFlaggedContent, deleteContent, getStats };
