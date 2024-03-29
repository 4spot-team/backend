const mongoose = require('mongoose');

/// SCHEMAS ///

/**
 * Ticket Schema
 */
const TicketSchema = new mongoose.Schema({
    user: { type: mongoose.ObjectId, required: true },       // Personal
    event: { type: mongoose.ObjectId, required: true },      // Event
    checked: { type: Boolean, required: false },
    visibility: { type: String, required: true }
});


/// METHODS ///

/// MODELS ///

const Ticket = mongoose.model('Ticket', TicketSchema);


/// EXPORTS ///
module.exports = {
    TicketSchema,
    Ticket
};
