import express from "express";
import mongoose from "mongoose";
import Tag from "../models/Tag.js";

const router = express.Router();

// Create a new tag
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if the tag already exists
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    // Create and save the new tag
    const newTag = new Tag({ name, description });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(500).json({ error: err.message });
  }
});
// Create a new tag
router.post("/add-tag", async (req, res) => {
 const {
        name
    } = req.body;
    if (
        !name
      ) {
        return res.json({
          success: false,
          message: "please fill all the fields",
        });
      }
      const tag = await Tag.create({
        name,
      });
    
      if (tag) {
        res.json({
          success: true,
          message: "tag add successfully",
        });
      } else {
        res.json({
          success: false,
          message: "tag add failed",
        });
      }
});

// Get all tags
router.get("/all", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (err) {
    console.error("Error fetching all tags:", err);
    res.status(500).json({ error: err.message });
  }
});
// Get all tags
router.get("/all-tags", async (req, res) => {
     const tages = await Tag.find();
    const numberOftages = await Tag.countDocuments()
    
    if (tages) {
      return res.json({
        success: true,
        numberOftages,
        data: tages,
      });
    } else {
      return res.json({
        success: false,
      });
    }
});


// Get a tag by ID
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (err) {
    console.error("Error fetching tag by ID:", err);
    res.status(500).json({ error: err.message });
  }
});

// Bulk fetch tags by IDs
router.post("/bulk-fetch", async (req, res) => {
  try {
    const { tagIds } = req.body;

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      return res.status(400).json({ error: "Invalid tag IDs." });
    }

    // Validate each ID and filter invalid ones
    const validTagIds = tagIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validTagIds.length === 0) {
      return res.status(400).json({ error: "No valid tag IDs provided." });
    }

    // Find tags by valid IDs
    const tags = await Tag.find({ _id: { $in: validTagIds } });
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags in bulk:", error);
    res.status(500).json({ error: "Failed to fetch tags." });
  }
});

// Update a tag
router.put("/:id", async (req, res) => {
  const { name, description } = req.body;

  try {
    // Find and update the tag
    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true } // Return the updated document
    );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json(updatedTag);
  } catch (err) {
    console.error("Error updating tag:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a tag
router.delete("/:id", async (req, res) => {
  try {
    // Find and delete the tag
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);

    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.error("Error deleting tag:", err);
    res.status(500).json({ error: err.message });
  }
});
// Delete a tag
router.delete("/delete-tag/:id", async (req, res) => {
   const { id } = req.params;
    
    const tag = await Tag.findByIdAndDelete(id);

  if (tag) {
    return res.json({
      success: true,
      message: "the tag was deleted",
    });
  }
  if (!tag) {
    return res.json({
      success: false,
      message: "No tag found with this ID",
    });
  }
});

export default router;
