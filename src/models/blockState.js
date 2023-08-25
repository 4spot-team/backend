const mongoose = require('mongoose');

/// SCHEMAS ///

/**
 * Block State Schema
 */
const BlockStateSchema = new mongoose.Schema({
    blocked: { type: Boolean, required: true },
    definitive: { type: Boolean, required: true },
    blockingDate: Date,
    expiration: Date
});

/// MODELS ///

const BlockState = mongoose.model('BlockState', BlockStateSchema);


/// METHODS ///


/// EXPORTS ///
module.exports = {
    BlockStateSchema,
    BlockState
};