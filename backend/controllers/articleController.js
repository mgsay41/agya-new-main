const Article = require('../models/Article');

// Create an article
exports.createArticle = async (req, res) => {
    try {
        const { userId, content, tags } = req.body;

        const article = new Article({
            userId,
            content,
            tags,
        });
        await article.save();

        res.status(201).json(article);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all articles
exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate('userId', 'firstname lastname');
        res.status(200).json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
