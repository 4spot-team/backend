const mongoose = require('mongoose');

// For inheritance
const options = { discriminatorKey: 'kind' };

/// SCHEMAS ///

/**
 * Chat Schema
 */
const ChatSchema = new mongoose.Schema({
    messages: [Message],
    users: [ObjectId],              // User
    blockedUsers: [ObjectId]        // User
});

/**
 * Messagin Group Schema
 */
const MessagingGroupSchema = new mongoose.Schema({
    event: { type: ObjectId, required: true },       // Event
    onlyAdminMessages: { type: Boolean, required: true },
    options
});

/// METHODS ///

/// MODELS ///

const Chat = mongoose.model('Chat', ChatSchema);
const MessagingGroup = Chat.discriminator('MessagingGroup', MessagingGroupSchema);

/// EXPORTS ///

module.exports = {
    ChatSchema,
    MessagingGroup
};