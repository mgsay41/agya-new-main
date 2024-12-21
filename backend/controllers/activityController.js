const Activity = require('../models/Activity');

// Create an activity
exports.createActivity = async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();

        res.status(201).json(activity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all activities
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an activity
exports.updateActivity = async (req, res) => {
    try {
        const { activityId } = req.params;

        const updatedActivity = await Activity.findByIdAndUpdate(activityId, req.body, { new: true });
        if (!updatedActivity) return res.status(404).json({ message: 'Activity not found' });

        res.status(200).json(updatedActivity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
