const Reply = require('../models/Reply');
const Post = require('../models/Post');
const User = require('../models/User');
const AbuseLog = require('../models/AbuseLog');
const Notification = require('../models/Notification');
const { moderateContent } = require('../services/aiModeration');
const mongoose = require('mongoose');

const getRepliesByPostId = async (req, res) => {
    try {
        const replies = await Reply.find({ post: req.params.id, isFlagged: false })
            .populate('author', 'username profileImage')
            .sort({ createdAt: 1 });
        res.json(replies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createReply = async (req, res) => {
    const { content, images } = req.body;
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // AI Moderation
        const moderation = await moderateContent(content);
        
        if (moderation.is_abusive) {
            const user = await User.findById(req.user._id);
            user.abuse_count += 1;
            
            await AbuseLog.create({
                user: user._id,
                contentId: new mongoose.Types.ObjectId(),
                contentType: 'Reply',
                reason: moderation.reason,
                confidence: moderation.confidence,
                contentSnippet: content.substring(0, 50)
            });

            let notificationMsg = `Warning: Your reply was flagged for: ${moderation.reason}. Abuse count: ${user.abuse_count}/3.`;
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
                message: 'Content flagged as abusive.',
                reason: moderation.reason
            });
        }

        const reply = new Reply({
            post: postId,
            author: req.user._id,
            content,
            images,
        });

        const createdReply = await reply.save();
        
        // Increment reply count on post
        post.replyCount += 1;
        await post.save();

        // Notify post author
        if (post.author.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: post.author,
                type: 'reply',
                message: `${req.user.username} replied to your post: "${post.title}"`,
                relatedPost: post._id
            });
        }

        res.status(201).json(createdReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);

        if (reply) {
            if (reply.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            const post = await Post.findById(reply.post);
            if (post) {
                post.replyCount -= 1;
                await post.save();
            }

            await reply.deleteOne();
            res.json({ message: 'Reply removed' });
        } else {
            res.status(404).json({ message: 'Reply not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRepliesByPostId, createReply, deleteReply };
