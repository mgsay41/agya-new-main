import express from "express";
import upload from "../multer.js";
import Article from "../models/Article.js";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create absolute path for uploads
const uploadsDir = path.join(process.cwd(), "uploads");
const articlesDir = path.join(uploadsDir, "articles");

// Create directories synchronously on startup
fs.mkdir(uploadsDir, { recursive: true })
  .then(() => fs.mkdir(articlesDir, { recursive: true }))
  .catch(console.error);

router.post("/:articleId", upload.single("file"), async (req, res) => {
  try {
    const { articleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid article ID" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      if (req.file) await fs.unlink(req.file.path);
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    if (existingArticle.image) {
      const oldImageName = path.basename(existingArticle.image);
      const oldImagePath = path.join(articlesDir, oldImageName);
      await fs.unlink(oldImagePath).catch(console.error);
    }

    const imageUrl = `${
      process.env.BASE_URL || "https://agyademo.uber.space"
    }/uploads/articles/${req.file.filename}`;

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { featuredImage: imageUrl },
      { new: true }
    );

    res.status(200).json({ success: true, article: updatedArticle });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
