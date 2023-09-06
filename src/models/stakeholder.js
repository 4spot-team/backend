const mongoose = require('mongoose');

//const creditMethods = require('./creditMethods');
//const notification = require('./notification');
const blockState = require('./blockState');
//const eventModels = require('./event');
const ticket = require('./ticket');

// Used for inheritance
const options = { discriminatorKey: 'kind' };

// MAIN SCHEMAS //

/** 
 * Stackeholder Schema
*/
const StakeholderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    /*
    hashPass: { type: Number, required: true },
    salt: { type: String, required: true },
    cookie: String,         // TODO: to decide whether use it or tokens
    notifications: [mongoose.ObjectId]      // Notification
    */
    hashPass: {type: String, required: true },
    hasAcceptedTerms: {type: Boolean, default: false},
});


/**
 * Personal
 */
const PersonalSchema = new mongoose.Schema({
    dateOfBirth: Date,
    preferences: [mongoose.ObjectId],    // SuperEventType
    defaultPaymentMethod: mongoose.ObjectId,     // CreditCard
    defaultCreditCard: mongoose.ObjectId,        // CreditMethod
    followers: [mongoose.ObjectId],    // UserSchema
    following: [mongoose.ObjectId],    // UserSchema
    publishedEvents: [mongoose.ObjectId],  // EventSchema
    blockState: { type: blockState.BlockStateSchema, required: true },
    chats: [mongoose.ObjectId],   // Chat
    tickets: [ticket.TicketSchema]
    },
    options
);

/**
 * Business
 */
const BusinessSchema = new mongoose.Schema({
    preferences: [mongoose.ObjectId],    // SuperEventType
    defaultPaymentMethod: mongoose.ObjectId,     // CreditCard
    defaultCreditCard: mongoose.ObjectId,        // CreditMethod
    followers: [mongoose.ObjectId],    // UserSchema
    following: [mongoose.ObjectId],    // UserSchema
    publishedEvents: [mongoose.ObjectId],  // EventSchema
    blockState: { type: blockState.BlockStateSchema, required: true },
    chats: [mongoose.ObjectId],   // Chat
    IVA: { type: String, required: true }
    },
    options
);


/**
 * Supervisor Schema
 */
const SupervisorSchema = new mongoose.Schema({
    phoneNumber: String,        // TODO: consider if setting required: true
    },
    options
);



/// METHODS ///

// Stakeholder methods

// User methods

// Supervisor methods


/// MODELS ///

const Stakeholder = mongoose.model('Stakeholder', StakeholderSchema);

const Supervisor = Stakeholder.discriminator('Supervisor', StakeholderSchema);

const Personal = Stakeholder.discriminator('Personal', PersonalSchema);
const Business = Stakeholder.discriminator('Business', BusinessSchema);


/// EXPORTS ///

module.exports = Stakeholder;
/*
module.exports = { Stakeholder, Supervisor, Personal, Business };
*/
