import express from "express";
import mongoose from "mongoose";
import Activity from "../models/Activity.js";

const router = express.Router();

// Create a new activity
router.post("/", async (req, res) => {
  const {
    userId,
    activityName,
    activityType,
    date,
    time,
    featuredImage,
    organization,
    location,
    price,
    sponsors,
    description,
    timeline,
    activityExLink,
    apply,
    status,
  } = req.body;

  try {
    if (!activityName || activityName === ""){
      return res.json({
        success: false,
        message: "activity name is required",
      });
    }
    if (!activityType || activityType === ""){
      return res.json({
        success: false,
        message: "activity Type is required",
      });
    }
    if (!date || date === ""){
      return res.json({
        success: false,
        message: "date is required",
      });
    }
    if (!time || time === ""){
      return res.json({
        success: false,
        message: "time is required",
      });
    }
    if (!userId){
      return res.json({
        success: false,
        message: "something wrong",
      });
    }
    if (!organization || organization === ""){
      return res.json({
        success: false,
        message: "organization is required",
      });
    }
    if (!userId){
      return res.json({
        success: false,
        message: "something wrong",
      });
    }
    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Create new activity
    const newActivity = new Activity({
      userId: new mongoose.Types.ObjectId(userId), // Convert to ObjectId with 'new'
      activityName,
      activityType,
      date,
      time,
      featuredImage,
      organization,
      location,
      price,
      sponsors, // Array of sponsor objects
      description,
      timeline,
      activityExLink,
      apply,
      status,
    });

    // Save the activity to the database
    await newActivity.save();
    res.status(201).json(newActivity); // Respond with the created activity
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Get activities filtered by userId
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    // If userId is provided, filter activities
    const filter = userId
      ? { userId: new mongoose.Types.ObjectId(userId) }
      : {};

    const activities = await Activity.find(filter);
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// In your activities route file
router.post("/:id/apply", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Find the activity and increment the appliedNumber
    const activity = await Activity.findByIdAndUpdate(
      id,
      { $inc: { appliedNumber: 1 } },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    console.error("Error applying to activity:", error);
    res.status(500).json({ message: "Error applying to activity" });
  }
});

// Get a specific activity by ID
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an activity
router.put("/:id", async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an activity
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/activ/activite", async (req, res) => {
  try {
    console.log('Received Request:', req.query); // Log query parameters
    const activities = await Activity.find();
    const numberOfActivity = await Activity.countDocuments();

    if (activities) {
      return res.json({
        success: true,
        numberOfActivity,
        data: activities,
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/activities/:type", async (req, res) => {
  const {type} = req.params 
  const activitie = await Activity.find({activityType : type});
  const activities = await Activity.find();
      if (activities) {
        return res.json({
          success: true,
          data: activitie,
        });
      } else {
        return res.json({
          success: false,
        });
      }
    
});

router.get("/activ/padding-activities", async (req, res) => {
    const activities = await Activity.find({status : "pending"});
      if (activities) {
        return res.json({
          success: true,
          data: activities,
        });
      } else {
        return res.json({
          success: false,
        });
      }
    
});
router.get("/padding-activities/:type", async (req, res) => {
  const {type} = req.params 
  const activitie = await Activity.find({activityType : type , status : "pending" });
  const activities = await Activity.find();
      if (activities) {
        return res.json({
          success: true,
          data: activitie,
        });
      } else {
        return res.json({
          success: false,
        });
      }
});

// Get a specific activity by ID
router.get("/activitiy/:id", async (req, res) => {
  const {id} = req.params 
  
    const activity = await Activity.findById(id);

    if (activity) {
      return res.json({
        success: true,
        data: activity,
      });
    } else {
      return res.json({
        success: false,
      });
    }
});

// Update an activity
router.put("/activities-updata/:id", async (req, res) => {
  const {id} = req.params 
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (updatedActivity) {
      return res.json({
        success: true,
        data: updatedActivity,
      });
    } else {
      return res.json({
        success: false,
      });
    }
});

// Delete an activity
// router.delete("/activities/:id", async (req, res) => {
//   try {
//     await Activity.findByIdAndDelete(req.params.id);
//     res.status(204).json({ message: "Activity deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


export default router;
