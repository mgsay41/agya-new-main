// activityUploads.js
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import Activity from "../models/Activity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure Multer for Activity uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(process.cwd(), "uploads/activities");
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Create directories synchronously on startup
const uploadsDir = path.join(process.cwd(), "uploads");
const activitiesDir = path.join(uploadsDir, "activities");

fs.mkdir(uploadsDir, { recursive: true })
  .then(() => fs.mkdir(activitiesDir, { recursive: true }))
  .catch(console.error);

// Route to upload Activity Featured Image
router.post(
  "/:activityId/featured",
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

      // Delete old featured image if it exists
      if (existingActivity.featuredImage) {
        const oldImageName = path.basename(existingActivity.featuredImage);
        const oldImagePath = path.join(activitiesDir, oldImageName);
        await fs.unlink(oldImagePath).catch(console.error);
      }

      // Construct the URL for the new featured image
      const featuredImageUrl = `${
        process.env.BASE_URL || "http://localhost:4000"
      }/uploads/activities/${req.file.filename}`;

      existingActivity.featuredImage = featuredImageUrl;
      await existingActivity.save();

      res.status(200).json({
        success: true,
        message: "Featured Image uploaded successfully",
        activity: existingActivity,
      });
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Route to upload Activity Logos (multiple files)
router.post(
  "/:activityId/logos",
  upload.array("files", 10), // Allow up to 10 logo files
  async (req, res) => {
    try {
      const { activityId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid activity ID" });
      }

      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No files uploaded" });
      }

      const existingActivity = await Activity.findById(activityId);
      if (!existingActivity) {
        // Remove uploaded files if activity not found
        await Promise.all(req.files.map((file) => fs.unlink(file.path))).catch(
          console.error
        );
        return res
          .status(404)
          .json({ success: false, message: "Activity not found" });
      }

      // Delete old logos if they exist
      if (
        existingActivity.sponsorLogos &&
        existingActivity.sponsorLogos.length > 0
      ) {
        await Promise.all(
          existingActivity.sponsorLogos.map(async (logo) => {
            const oldLogoName = path.basename(logo);
            const oldLogoPath = path.join(activitiesDir, oldLogoName);
            await fs.unlink(oldLogoPath).catch(console.error);
          })
        );
      }

      // Construct the URLs for the new logos
      const logoUrls = req.files.map(
        (file) =>
          `${
            process.env.BASE_URL || "http://localhost:4000"
          }/uploads/activities/${file.filename}`
      );

      existingActivity.sponsorLogos = logoUrls;
      await existingActivity.save();

      res.status(200).json({
        success: true,
        message: "Sponsor logos uploaded successfully",
        activity: existingActivity,
      });
    } catch (error) {
      // Remove uploaded files in case of an error
      if (req.files) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path))).catch(
          console.error
        );
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
