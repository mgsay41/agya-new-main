const Notification = require('../models/Notification');

// Create a notification
exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();

        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get notifications for a user
exports.getNotificationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.find({ userId });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
