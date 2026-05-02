const Post = require('../models/Post');
const User = require('../models/User');
const AbuseLog = require('../models/AbuseLog');
const Notification = require('../models/Notification');
const { moderateContent } = require('../services/aiModeration');
const mongoose = require('mongoose');

const getPosts = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const sort = req.query.sort || 'latest';
    const tag = req.query.tag;

    let query = { isFlagged: false };
    if (tag) {
        query.tags = tag;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'mostViewed') sortOption = { viewCount: -1 };
    if (sort === 'mostReplied') sortOption = { replyCount: -1 };

    try {
        const count = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('author', 'username profileImage');

        res.json({ posts, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username profileImage');
        if (post) {
            post.viewCount += 1;
            await post.save();
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    const { title, description, tags, images } = req.body;

    try {
        // AI Moderation
        const moderation = await moderateContent(`${title} ${description}`);
        
        if (moderation.is_abusive) {
            // Log abuse
            const user = await User.findById(req.user._id);
            user.abuse_count += 1;
            
            const abuseLog = await AbuseLog.create({
                user: user._id,
                contentId: new mongoose.Types.ObjectId(), // Placeholder since post isn't saved yet
                contentType: 'Post',
                reason: moderation.reason,
                confidence: moderation.confidence,
                contentSnippet: title
            });

            let notificationMsg = `Warning: Your post was flagged for: ${moderation.reason}. Abuse count: ${user.abuse_count}/3.`;
            let type = 'abuse_warning';

            if (user.abuse_count >= 3) {
                user.is_blocked = true;
                notificationMsg = 'Your account has been permanently blocked due to repeated violations.';
                type = 'account_blocked';
            }

            await user.save();
            await Notification.create({
                recipient: user._id,
                type,
                message: notificationMsg
            });

            return res.status(400).json({ 
                message: moderation.is_abusive ? 'Content flagged as abusive.' : 'Error processing content.',
                reason: moderation.reason,
                abuse_count: user.abuse_count
            });
        }

        const post = new Post({
            title,
            description,
            tags,
            images,
            author: req.user._id,
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPosts, getPostById, createPost, deletePost };
