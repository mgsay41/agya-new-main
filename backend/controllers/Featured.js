import FeaturedArticles from "../models/featuredArticles.js";
import mongoose from "mongoose";

// Add a new featured article
const add = async (req, res) => {
  try {
    const { articleID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(articleID)) {
      return res.status(400).json({ message: "Invalid article ID." });
    }

    const existing = await FeaturedArticles.findOne({ articleID });
    if (existing) {
      return res.status(409).json({ message: "Article is already featured." });
    }

    const newFeatured = new FeaturedArticles({ articleID });
    await newFeatured.save();

    res.status(201).json({ message: "Article added to featured list.", data: newFeatured });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding the article.", error: error.message });
  }
};

// Remove a featured article by its ID
const deleteFeatured = async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid featured article ID." });
    }

    const removed = await FeaturedArticles.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ message: "Featured article not found." });
    }

    res.status(200).json({ message: "Featured article removed successfully.", data: removed });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while removing the article.", error: error.message });
  }
};


// Get all featured articles
const getAll = async (req, res) => {
  try {
    const featuredArticles = await FeaturedArticles.find().populate("articleID");
    res.status(200).json({ data: featuredArticles });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching featured articles.", error: error.message });
  }
};

export { add, deleteFeatured, getAll };
