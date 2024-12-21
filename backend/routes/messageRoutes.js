import express from "express";
import mongoose from "mongoose";
import Message from "../models/message.js";

const router = express.Router();

// Send a new message
router.post("/", async (req, res) => {
  const { userId, subject, message, senderName } = req.body;

  try {
    const newMessage = new Message({
      userId: new mongoose.Types.ObjectId(userId), // Add `new`
      subject,
      message,
      senderName,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      userId: new mongoose.Types.ObjectId(userId), // Add `new`
    }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all messages for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      userId: mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific message by ID
router.get("/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark a message as read
router.patch("/:id/read", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.read = true; // Mark the message as read
    await message.save();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a message
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(204).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
