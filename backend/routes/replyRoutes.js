import express from "express";
import mongoose from "mongoose";
import Reply from "../models/Reply.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// Create a reply to a comment
router.post("/:id/reply", async (req, res) => {
  const { userId, content } = req.body; // Get userId and content from the request body
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Create and save the reply
    const newReply = new Reply({
      commentId: comment._id,
      userId,
      content,
    });

    await newReply.save();
    res.status(201).json(newReply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all replies for a specific comment
router.get("/:id/replies", async (req, res) => {
  try {
    const replies = await Reply.find({ commentId: req.params.id }).populate(
      "userId",
      "firstname lastname"
    );
    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a reply
router.delete("/replies/:id", async (req, res) => {
  try {
    await Reply.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Reply deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
