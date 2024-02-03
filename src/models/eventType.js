const mongoose = require('mongoose');


/// SCHEMAS ///

const SuperEventTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true }      // base64 encoding
});

const EventTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    superType: mongoose.ObjectId,
    defaultImage: { type: String, required: true }
});

/// MODELS ///

const SuperEventType = mongoose.model('SuperEventType', SuperEventTypeSchema);
const EventType = mongoose.model('EventType', EventTypeSchema);

/// EXPORTS ///
module.exports = {
    SuperEventType, EventType
};
