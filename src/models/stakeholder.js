const mongoose = require('mongoose');

const creditMethods = require('./creditMethods');
const notification = require('./notification');
const blockState = require('./blockState');
const eventModels = require('./event');
const ticket = require('./ticket');

// Used for inheritance
const options = { discriminatorKey: 'kind' };


const StakeholderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    notifications: [mongoose.ObjectId]
    hashPass: {type: String, required: true },
    hasAcceptedTerms: {type: Boolean, default: false},
    // the next ones should be fields of the inherited schemas
    // they are here only to make things work (this version
    // of API only uses StakeholderSchema)
    followers: [mongoose.ObjectId],
    following: [mongoose.ObjectId],
});

const PersonalSchema = new mongoose.Schema({
    dateOfBirth: Date,
    preferences: [mongoose.ObjectId],    // SuperEventType
    defaultPaymentMethod: mongoose.ObjectId,     // CreditCard
    defaultCreditCard: mongoose.ObjectId,        // CreditMethod
    followers: [mongoose.ObjectId],    // UserSchema
    following: [mongoose.ObjectId],    // UserSchema
    publishedEvents: [mongoose.ObjectId],  // EventSchema
    // blockState: { type: blockState.BlockStateSchema, required: true },
    chats: [mongoose.ObjectId],   // Chat
    tickets: [ticket.TicketSchema]
    },
    options
);

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

const SupervisorSchema = new mongoose.Schema({
    phoneNumber: String,        // TODO: consider if setting required: true
    },
    options
);


const Stakeholder = mongoose.model('Stakeholder', StakeholderSchema);
const Supervisor = Stakeholder.discriminator('Supervisor', StakeholderSchema);
const Personal = Stakeholder.discriminator('Personal', PersonalSchema);
const Business = Stakeholder.discriminator('Business', BusinessSchema);


module.exports = { Stakeholder, Supervisor, Personal, Business };

