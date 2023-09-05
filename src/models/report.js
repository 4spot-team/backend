const mongoose = require('mongoose');

/// SCHEMAS ///

const ReportSchema = new mongoose.Schema({
    object: { type: mongoose.ObjectId, required: true },
    text: { type: String, required: true }
});

/// MODELS ///

const Report = mongoose.model('Report', ReportSchema);

/// EXPORTS ///

module.exports = {
    Report
};