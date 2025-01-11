import express from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

const router = express.Router();

// Create a new notification
router.post("/", async (req, res) => {
  const { userId, content, category } = req.body;

  try {
    const newNotification = new Notification({
      userId: new mongoose.Types.ObjectId(userId),
      content,
      category,
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read (Updated to PATCH)
router.patch("/:id/read", async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(updatedNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a notification
router.delete("/:id", async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      req.params.id
    );
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(204).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id/all", async (req, res) => {
  try {
    // Delete all notifications for the specific user ID
    const deletedNotifications = await Notification.deleteMany({
      userId: req.params.id, // Assuming your Notification model has a userId field
    });

    if (deletedNotifications.deletedCount === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    // Send response with the number of deleted notifications
    res.status(200).json({
      message: `Successfully cleared ${deletedNotifications.deletedCount} notifications`,
      deletedCount: deletedNotifications.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
