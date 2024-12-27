import express from "express";
import upload from "../multer.js";
import Activity from "../models/Activity.js";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create absolute path for uploads
const uploadsDir = path.join(process.cwd(), "uploads");
const activitiesDir = path.join(uploadsDir, "activities");

// Create directories synchronously on startup
fs.mkdir(uploadsDir, { recursive: true })
  .then(() => fs.mkdir(activitiesDir, { recursive: true }))
  .catch(console.error);

router.post("/:activityId", upload.single("file"), async (req, res) => {
  try {
    const { activityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid activity ID" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const existingActivity = await Activity.findById(activityId);
    if (!existingActivity) {
      if (req.file) await fs.unlink(req.file.path);
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }

    // Remove old featured image if it exists
    if (existingActivity.featuredImage) {
      const oldImageName = path.basename(existingActivity.featuredImage);
      const oldImagePath = path.join(activitiesDir, oldImageName);
      await fs.unlink(oldImagePath).catch(console.error);
    }

    const imageUrl = `${
      process.env.BASE_URL || "http://localhost:4000"
    }/uploads/activities/${req.file.filename}`;

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { featuredImage: imageUrl },
      { new: true }
    );

    res.status(200).json({ success: true, activity: updatedActivity });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
