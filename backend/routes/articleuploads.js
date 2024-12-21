import express from "express";
import upload from "../multer.js";
import Article from "../models/Article.js";
import path from "path";
import fs from 'fs';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads/articles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware to set the destination folder to "articles"
const uploadArticleImage = upload.single("file");

// Upload file and update article's image
router.post("/articles/:articleId", uploadArticleImage, async (req, res) => {
  try {
    const { articleId } = req.params;

    // Validate articleId
    if (!articleId) {
      return res.status(400).json({ 
        success: false, 
        message: "Article ID is required." 
      });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded." 
      });
    }

    // Check if article exists before updating
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      // Clean up uploaded file if article doesn't exist
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false, 
        message: "Article not found." 
      });
    }

    // Delete old image if it exists
    if (existingArticle.image) {
      const oldImagePath = existingArticle.image.replace('http://localhost:4000/uploads/articles/', '');
      const fullPath = path.join(uploadDir, oldImagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    // File path to save in the database
    const filePath = `http://localhost:4000/uploads/articles/${req.file.filename}`;

    // Update the article's image in the database
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { 
        image: filePath,
        updatedAt: new Date()
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
      fs.unlinkSync(req.file.path);
    }
    console.error("Error updating article image:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error." 
    });
  }
});

export default router;