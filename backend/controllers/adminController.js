const Admin = require('../models/Admin');

// Create an admin
exports.createAdmin = async (req, res) => {
    try {
        const { email, password, name, firstname, lastname } = req.body;

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        const admin = new Admin({
            email,
            password, // Ensure password is hashed in production
            name,
            firstname,
            lastname,
        });
        await admin.save();

        res.status(201).json(admin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
