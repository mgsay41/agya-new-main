import express from "express";
import mongoose from "mongoose";
import Article from "../models/Article.js";

const router = express.Router();

// Create a new article
router.post("/", async (req, res) => {
  const { title, content, authorId, tags, references ,authorName } = req.body;

  // Validate references format
  if (references && !Array.isArray(references)) {
    console.log("jjjjjj")
    return res
      .status(400)
      .json({ error: "References must be an array of objects" });
  }

  if (references) {
    console.log(references)
    for (const reference of references) {
      if (!reference) {
        console.log("aaaaaaaaaaaa")
        return res
          .status(400)
          .json({ error: "Each reference must include a URL" });
      }
    }
  }

  try {
    const newArticle = new Article({
      title,
      content,
      authorId,
      authorName,
      tags,
      references,
      
    });
    await newArticle.save();
    res.status(201).json(newArticle);
    console.log("success")
  } catch (err) {
    console.log("ppppppppppppppppppppp")
    console.log(err.message)
    res.status(500).json({ error: err.message });
    
  }
});

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().populate(
      "authorId",
      "firstname lastname"
    );
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific article by ID
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "authorId",
      "firstname lastname image"
    );
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all articles by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const articles = await Article.find({ authorId: userId }).populate(
      "authorId",
      "firstname lastname image"
    );
    if (articles.length === 0) {
      return res
        .status(404)
        .json({ message: "No articles found for this user" });
    }
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an article
router.put("/:id", async (req, res) => {
  const { title, content, tags, references } = req.body;
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, references },
      { new: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(updatedArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an article
router.delete("/:id", async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(204).json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like an article
// Like an article
router.post("/like/:id", async (req, res) => {
  const { userId } = req.body;
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
     console.log(article)
    // Remove the user from dislikedBy if they are there
    if (article.dislikedBy.includes(userId)) {
      article.dislikedBy = article.dislikedBy.filter(
        (id) => id.toString() !== userId
      );
      article.dislikes -= 1;
    }

    // If the user has already liked the article, remove the like
    if (article.likedBy.includes(userId)) {
      article.likedBy = article.likedBy.filter(
        (id) => id.toString() !== userId
      );
      article.likes -= 1;
    } else {
      // Otherwise, add the like
      article.likedBy.push(userId);
      article.likes += 1;
    }

    await article.save();

    res.status(200).json({ message: "Article liked/unliked", article });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
});

// Dislike an article
router.post("/dislike/:id", async (req, res) => {
  const { userId } = req.body;
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Remove the user from likedBy if they are there
    if (article.likedBy.includes(userId)) {
      article.likedBy = article.likedBy.filter(
        (id) => id.toString() !== userId
      );
      article.likes -= 1;
    }

    // If the user has already disliked the article, remove the dislike
    if (article.dislikedBy.includes(userId)) {
      article.dislikedBy = article.dislikedBy.filter(
        (id) => id.toString() !== userId
      );
      article.dislikes -= 1;
    } else {
      // Otherwise, add the dislike
      article.dislikedBy.push(userId);
      article.dislikes += 1;
    }

    await article.save();

    res.status(200).json({ message: "Article disliked/undisliked", article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
