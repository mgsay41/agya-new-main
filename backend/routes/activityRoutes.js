import express from "express";
import mongoose from "mongoose";
import Activity from "../models/Activity.js";

const router = express.Router();
// Create a new activity
router.post("/", async (req, res) => {
  const {
    userId,
    activityName,
    activityType,
    date,
    time,
    featuredImage,
    organization,
    location,
    price,
    sponsors,
    description,
    timeline,
    activityExLink,
    apply,
    status,
  } = req.body;

  try {
    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Check if sponsors are an array of objects (with name and logo)
    if (
      !Array.isArray(sponsors) ||
      sponsors.some((sponsor) => !sponsor.name || !sponsor.logo)
    ) {
      return res.status(400).json({
        error: "Sponsors must be an array of objects with 'name' and 'logo'",
      });
    }

    // Create new activity
    const newActivity = new Activity({
      userId: new mongoose.Types.ObjectId(userId), // Convert to ObjectId with 'new'
      activityName,
      activityType,
      date,
      time,
      featuredImage,
      organization,
      location,
      price,
      sponsors, // Array of sponsor objects with 'name' and 'logo'
      description,
      timeline,
      activityExLink,
      apply,
      status,
    });

    // Save the activity to the database
    await newActivity.save();
    res.status(201).json(newActivity); // Respond with the created activity
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Get activities filtered by userId
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    
    // If userId is provided, filter activities
    const filter = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
    
    const activities = await Activity.find(filter);
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific activity by ID
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an activity
router.put("/:id", async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an activity
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
