const mongoose = require('mongoose');

// Used for inheritance
const options = { discriminatorKey: 'kind' };

/// MAIN SCHEMAS ///

/**
 * Notification Schema
 */
const NotificationSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    text: { type: String, required: true }
});

/**
 * Invitation Schema
 */
const InvitationSchema = new mongoose.Schema({
    event: { type: mongoose.ObjectId, required: true },
    accepted: { type: Boolean, require: true }
}, options);

/**
 * Join Request Schema
 */
const JoinRequestSchema = new mongoose.Schema({
    event: { type: mongoose.ObjectId, required: true },
    accepted: { type: Boolean, require: true },
}, options);


/// METHODS ///

/// MODELS ///

const Notification = mongoose.model('Notification', NotificationSchema);
const Invitation = Notification.discriminator('Invitation', InvitationSchema);
const JoinRequest = Notification.discriminator('JoinRequest', JoinRequestSchema);

/// EXPORTS ///
module.exports = {
    NotificationSchema,
    Notification, Invitation, JoinRequest
};