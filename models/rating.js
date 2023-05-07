const mongoose = require('mongoose');

/// SCHEMAS ///

/**
 * Rating Schema
 */
const RatingSchema = new mongoose.Schema({
    user: { type: ObjectId, required: true },       // User
    rating: { type: Number, required: true }
});


/// METHODS ///

/// MODELS ///
const Rating = mongoose.model('Rating', RatingSchema);

/// EXPORTS ///
module.exports = {
    RatingSchema,
    Rating
};