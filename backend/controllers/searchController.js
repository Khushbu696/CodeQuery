const Post = require('../models/Post');

const searchPosts = async (req, res) => {
    const query = req.query.q;
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    try {
        if (!query) {
            return res.json({ posts: [], page: 1, pages: 0 });
        }

        const count = await Post.countDocuments({ $text: { $search: query } });
        const posts = await Post.find({ $text: { $search: query } })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('author', 'username profileImage');

        res.json({ posts, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { searchPosts };
