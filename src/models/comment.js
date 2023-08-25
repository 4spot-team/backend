const mongoose = require('mongoose');


/// SCHEMAS ///

/**
 * Comment Schema
 */
const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.ObjectId, required: true },       // User
    date: { type: Date, required: true },
    text: { type: String, required: true }
});

/// METHODS ///

/// MODELS ///
const Comment = mongoose.model('Comment', CommentSchema);

/// EXPORTS ///
module.exports = {
    CommentSchema,
    Comment
};