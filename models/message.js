const mongoose = require('mongoose');

/// SCHEMAS ///

/**
 * Message Schema
 */
const MessageSchema = new mongoose.Schema({
    user: { type: ObjectId, required: true },
    date: { type: Date, required: true },
    text: { type: String, required: true }
});

/// METHODS ///

/// MODELS ///

const Message = mongoose.model('Message', MessageSchema);

/// EXPORTS ///

module.exports = {
    MessageSchema,
    Message
};