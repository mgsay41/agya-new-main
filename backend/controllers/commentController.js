const Comment = require('../models/Comment');

// Add a comment to a post
exports.addComment = async (req, res) => {
    try {
        const { postId, userId, content } = req.body;

        const comment = new Comment({
            postId,
            userId,
            content,
        });
        await comment.save();

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get comments for a post
exports.getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ postId }).populate('userId', 'firstname lastname');
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
