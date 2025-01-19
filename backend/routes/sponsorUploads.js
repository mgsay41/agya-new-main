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

// Configure Multer for sponsor logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(process.cwd(), "uploads/sponsors");
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
const sponsorsDir = path.join(uploadsDir, "sponsors");

fs.mkdir(uploadsDir, { recursive: true })
  .then(() => fs.mkdir(sponsorsDir, { recursive: true }))
  .catch(console.error);

// Route to upload sponsor logo
router.post(
  "/:activityId/sponsors",
  upload.single("logo"),
  async (req, res) => {
    try {
      const { activityId } = req.params;
      const { name } = req.body;

      if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid activity ID" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No logo file uploaded" });
      }

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Sponsor name is required" });
      }

      const activity = await Activity.findById(activityId);
      if (!activity) {
        if (req.file) await fs.unlink(req.file.path);
        return res
          .status(404)
          .json({ success: false, message: "Activity not found" });
      }

      const logoUrl = `${
        process.env.BASE_URL || "https://agyademo.uber.space"
      }/uploads/sponsors/${req.file.filename}`;

      const newSponsor = { name, logo: logoUrl };
      activity.sponsors.push(newSponsor);

      await activity.save();

      res.status(200).json({
        success: true,
        message: "Sponsor added successfully",
        sponsor: newSponsor,
        activity,
      });
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
