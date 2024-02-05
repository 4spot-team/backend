const mongoose = require('mongoose');

/// SCHEMAS ///

/**
 * Location Schema
 */
const LocationSchema = new mongoose.Schema({
    postalCode: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    houseNumber: { type: Number, required: true },
    coordinates: { type: Array, required: true },
});


/// METHODS ///


/// MODELS ///

const Location = mongoose.model('Location', LocationSchema);


/// EXPORTS ///
module.exports = {
    LocationSchema,
    Location
};
