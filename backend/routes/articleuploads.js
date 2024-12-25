import express from "express";
import upload from "../multer.js";
import Article from "../models/Article.js";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads/articles");
fs.mkdir(uploadDir, { recursive: true }).catch((err) =>
  console.error("Error ensuring upload directory exists:", err)
);

// Middleware to set the destination folder to "articles"
const uploadArticleImage = upload.single("file");

// Upload file and update article's image
router.post("/articles/:articleId", uploadArticleImage, async (req, res) => {
  try {
    const { articleId } = req.params;

    // Validate articleId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    // Check if article exists before updating
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      // Clean up uploaded file if article doesn't exist
      await fs.unlink(req.file.path).catch((err) =>
        console.error("Error deleting uploaded file:", err)
      );
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    // Delete old image if it exists
    if (existingArticle.image) {
      const oldImagePath = existingArticle.image.replace(
        `${process.env.BASE_URL || "http://localhost:4000"}/uploads/articles/`,
        ""
      );
      const fullPath = path.join(uploadDir, oldImagePath);
      await fs.unlink(fullPath).catch((err) =>
        console.error("Error deleting old image:", err)
      );
    }

    // File path to save in the database
    const filePath = `${process.env.BASE_URL || "http://localhost:4000"}/uploads/articles/${req.file.filename}`;

    // Update the article's image in the database
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        image: filePath,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Article image uploaded and article updated successfully.",
      article: updatedArticle,
    });
  } catch (error) {
    // Clean up uploaded file in case of error
    if (req.file) {
      await fs.unlink(req.file.path).catch((err) =>
        console.error("Error deleting uploaded file after error:", err)
      );
    }
    console.error("Error updating article image:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

// Route to fetch all image links from the articles folder
router.get("/articles/images", async (req, res) => {
  try {
    const files = await fs.readdir(uploadDir);
    const fileLinks = files.map(
      (file) =>
        `${process.env.BASE_URL || "http://localhost:4000"}/uploads/articles/${file}`
    );

    res.status(200).json({
      success: true,
      message: "Fetched all article images successfully.",
      images: fileLinks,
    });
  } catch (error) {
    console.error("Error fetching article images:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

export default router;
