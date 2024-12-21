import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  const { userId, content ,authorName } = req.body;
  try {
    const newPost = new Post({ userId, content , authorName });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get posts by userId and populate user details
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ userId }).populate(
      "userId", // Populate the userId field with user details
      "firstname lastname image" // Include firstname, lastname, and image
    );
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this user" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a post
router.post("/like/:id", async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    // Remove the user from dislikedBy if they are there
    if (post.dislikedBy.includes(userId)) {
      post.dislikedBy = post.dislikedBy.filter(
        (id) => id.toString() !== userId
      );
      post.dislikes -= 1;
    }

    // If the user has already liked the article, remove the like
    if (post.likedBy.includes(userId)) {
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId
      );
      post.likes -= 1;
    } else {
      // Otherwise, add the like
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.status(200).json({ message: "post liked/unliked", post });
  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
});

// Dislike an article
router.post("/dislike/:id", async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    // Remove the user from likedBy if they are there
    if (post.likedBy.includes(userId)) {
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId
      );
      post.likes -= 1;
    }

    // If the user has already disliked the article, remove the dislike
    if (post.dislikedBy.includes(userId)) {
      post.dislikedBy = post.dislikedBy.filter(
        (id) => id.toString() !== userId
      );
      post.dislikes -= 1;
    } else {
      // Otherwise, add the dislike
      post.dislikedBy.push(userId);
      post.dislikes += 1;
    }

    await post.save();

    res.status(200).json({ message: "Article disliked/undisliked", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update post
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
