const mongoose = require('mongoose');

const message = require('./message');

// For inheritance
const options = { discriminatorKey: 'kind' };

/// SCHEMAS ///

/**
 * Chat Schema
 */
const ChatSchema = new mongoose.Schema({
    messages: [message.MessageSchema],
    users: [mongoose.ObjectId],              // User
    blockedUsers: [mongoose.ObjectId]        // User
});

/**
 * Messagin Group Schema
 */
const MessagingGroupSchema = new mongoose.Schema({
    event: { type: mongoose.ObjectId, required: true },       // Event
    onlyAdminMessages: { type: Boolean, required: true }
}, options);

/// METHODS ///

/// MODELS ///

const Chat = mongoose.model('Chat', ChatSchema);
const MessagingGroup = Chat.discriminator('MessagingGroup', MessagingGroupSchema);

/// EXPORTS ///

module.exports = {
    ChatSchema,
    MessagingGroup
};