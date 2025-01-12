import express from "express";
import mongoose from "mongoose";
import Report from "../models/Report.js";

const router = express.Router();

// Create a new report
router.post("/", async (req, res) => {
  const { username, userImage, content, articleId, postId, commentId } = req.body;
  try {
    if (!username || !userImage || !content) {
      return res.status(400).json({ error: "username, userImage, and content are required" });
    }
    if (content === "") {
        return res.json({
          success: false,
          message: "content is empty",
        });
    }

    if (!articleId && !postId && !commentId) {
      return res.status(400).json({
        error: "At least one of articleId, postId, or commentId is required",
      });
    }

    // Validate ObjectIds
    if (articleId && !mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ error: "Invalid articleId" });
    }
    if (postId && !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }
    if (commentId && !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid commentId" });
    }

    const newReport = new Report({
      username,
      userImage,
      content,
      articleId: articleId ? new mongoose.Types.ObjectId(articleId) : undefined,
      postId: postId ? new mongoose.Types.ObjectId(postId) : undefined,
      commentId: commentId ? new mongoose.Types.ObjectId(commentId) : undefined,
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all-reports", async (req, res) => {
  const reports = await Report.find();
  const numberOfReports = await Report.countDocuments()
  
  if (reports) {
    return res.json({
      success: true,
      numberOfReports,
      data: reports,
    });
  } else {
    return res.json({
      success: false,
    });
  }
});

// Get a specific report by ID
router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/reports/:id/read", async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true } // Return the updated document
    );
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a report
router.delete("/:id", async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
