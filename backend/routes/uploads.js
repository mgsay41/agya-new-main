import express from "express";
import upload from "../multer.js"; // Import multer configuration
import User from "../models/User.js"; // Import User model

const router = express.Router();

// Upload file and update user's image
router.post("/:userId", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // File path to save in the database
    const filePath = `http://localhost:4000/uploads/${req.file.filename}`;

    // Update the user's image in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: filePath },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "File uploaded and user image updated successfully.",
      user: updatedUser, // Return the updated user
    });
  } catch (error) {
    console.error("Error updating user image:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
