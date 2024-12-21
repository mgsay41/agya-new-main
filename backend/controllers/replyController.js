const Reply = require('../models/Reply');

// Add a reply to a comment
exports.addReply = async (req, res) => {
    try {
        const { commentId, userId, content } = req.body;

        const reply = new Reply({
            commentId,
            userId,
            content,
        });
        await reply.save();

        res.status(201).json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get replies for a comment
exports.getRepliesByComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const replies = await Reply.find({ commentId }).populate('userId', 'firstname lastname');
        res.status(200).json(replies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
