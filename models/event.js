const mongoose = require('mongoose');

const location = require('./location');
const currency = require('./currency');
const rating = require('./rating');
const comment = require('./comment');

// Used for inheritance
const options = { discriminatorKey: 'kind' };

/// SCHEMAS ///

/**
 * Event Schema
 */
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    organiser: { type: mongoose.ObjectId, required: true },  // User
    tickets: [mongoose.ObjectId],                            // Ticket
    types: { type: [mongoose.ObjectId], required: true },      // EventType
    location: { type: location.LocationSchema, required: true },
    date: { type: Date, required: true },
    noUnderage: { type: Boolean, required: true },
    hasQR: { type: Boolean, required: true },
    price: currency.CurrencySchema,
    messagingGroup: mongoose.ObjectId,       // Messaging Group
    hashtags: [String],
    description: String,
    numOfSpots: Number,
    occupiedSpots: Number,
    image: { type: String, required: true },          // Images are stored in the DB as base64
    ratings: [rating.RatingSchema],
    comments: [comment.CommentSchema]
}); 

/**
 * Request Event Schema
 */
const RequestEventSchema = new mongoose.Schema({}, options);

/**
 * Private Event Schema
 */
const PrivateEventSchema = new mongoose.Schema({
    invitations: [mongoose.ObjectId],     // Personal
}, options);

/// METHODS ///


/// MODELS ///

const Event = mongoose.model('Event', EventSchema);
const RequestEvent = Event.discriminator('RequestEvent', RequestEventSchema);
const PrivateEvent = Event.discriminator('PrivateEvent', PrivateEventSchema);

/// EXPORTS ///
module.exports = {
    EventSchema,
    Event, RequestEvent, PrivateEvent
};