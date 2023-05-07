const mongoose = require('mongoose');

const creditMethods = require('./creditMethods');
const notification = require('./notification');
const blockState = require('./blockState');
const eventModels = require('./event');

// Used for inheritance
const options = { discriminatorKey: 'kind' };

// MAIN SCHEMAS //

/** 
 * Stackeholder Schema
*/
const StakeholderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    hashPass: { type: Number, required: true },
    salt: { type: String, required: true },
    cookie: String,         // TODO: to decide whether use it or tokens
    notifications: [ObjectId],      // Notification
    options
});

/**
 * User Schema 
 */
const UserSchema = new mongoose.Schema({
    dateOfBirth: Date,
    preferences: [ObjectId],    // SuperEventType
    defaultPaymentMethod: ObjectId,     // CreditCard
    defaultCreditCard: ObjectId,        // CreditMethod
    followers: [ObjectId],    // UserSchema
    following: [ObjectId],    // UserSchema
    publishedEvents: [ObjectId],  // EventSchema
    blockState: { type: blockState.BlockStateSchema, required: true },
    chats: [ObjectId],   // Chat
    options
});

/**
 * Personal
 */
const PersonalSchema = new mongoose.Schema({
    tickets: [TicketSchema],
    options
});

/**
 * Business
 */
const BusinessSchema = new mongoose.Schema({
    IVA: { type: String, required: true },
    options
});


/**
 * Supervisor Schema
 */
const SupervisorSchema = new mongoose.Schema({
    phoneNumber: String,        // TODO: consider if setting required: true
    options
});



/// METHODS ///

// Stakeholder methods

// User methods

// Supervisor methods


/// MODELS ///

const Stakeholder = mongoose.model('Stakeholder', StakeholderSchema);

const User = Stakeholder.discriminator('User', UserSchema);
const Supervisor = Stakeholder.discriminator('Supervisor', StakeholderSchema);

const Personal = User.discriminator('Personal', PersonalSchema);
const Business = User.discriminator('Business', BusinessSchema);


/// EXPORTS ///

module.exports = { Stakeholder, User, Supervisor, Personal, Business };