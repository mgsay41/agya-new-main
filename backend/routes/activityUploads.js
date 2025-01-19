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

const uploadsDir = path.join(process.cwd(), "uploads");
const activitiesDir = path.join(uploadsDir, "activities");
const sponsorsDir = path.join(activitiesDir, "sponsors");

// Create directories synchronously on startup
fs.mkdir(uploadsDir, { recursive: true })
  .then(() =>
    Promise.all([
      fs.mkdir(activitiesDir, { recursive: true }),
      fs.mkdir(sponsorsDir, { recursive: true }),
    ])
  )
  .catch(console.error);

// Featured image upload route
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

    if (existingActivity.featuredImage) {
      const oldImageName = path.basename(existingActivity.featuredImage);
      const oldImagePath = path.join(activitiesDir, oldImageName);
      await fs.unlink(oldImagePath).catch(console.error);
    }

    const imageUrl = `${
      process.env.BASE_URL || "https://agyademo.uber.space"
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

// Sponsor images upload route
router.post(
  "/:activityId/sponsors",
  upload.single("file"),
  async (req, res) => {
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

      // Move the file to sponsors directory
      const sponsorFileName = `sponsor-${Date.now()}-${req.file.filename}`;
      const sponsorFilePath = path.join(sponsorsDir, sponsorFileName);
      await fs.rename(req.file.path, sponsorFilePath);

      const imageUrl = `${
        process.env.BASE_URL || "https://agyademo.uber.space"
      }/uploads/activities/sponsors/${sponsorFileName}`;

      res.status(200).json({ success: true, imageUrl });
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
