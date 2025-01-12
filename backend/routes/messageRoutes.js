import express from "express";
import mongoose from "mongoose";
import Message from "../models/message.js";

const router = express.Router();

// Send a new message
router.post("/", async (req, res) => {
  const { userId, subject, email, message, senderName } = req.body;

  // Validate input fields
  if (!subject || !email || !message || !senderName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save the message in the database (MongoDB example)
    const newMessage = new Message({
      userId,
      subject,
      email,
      message,
      senderName,
    });

    await newMessage.save();
    res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Get a specific message by ID
router.get("/all-messages", async (req, res) => {
    const message = await Message.find();

    const numberOfMessage = await Message.countDocuments()

    if (message) {
      return res.json({
        success: true,
        numberOfMessage,
        data: message,
      });
    } else {
      return res.json({
        success: false,
      });
    }
  }
)

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
router.get("/message/:id", async (req, res) => {
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
