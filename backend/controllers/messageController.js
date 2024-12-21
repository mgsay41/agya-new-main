const Message = require('../models/message');

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all messages
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
