const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { userId, content } = req.body;

        const newPost = new Post({
            userId,
            content,
        });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'firstname lastname');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likes += 1;
        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
