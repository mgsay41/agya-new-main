const Report = require('../models/Report');

// File a report
exports.fileReport = async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();

        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
