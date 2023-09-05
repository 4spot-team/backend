const mongoose = require('mongoose');

/// SCHEMAS ///

/**
 * Currency Schema
 */
const CurrencySchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
});

/// METHODS ///

/// MODELS ///
const Currency = mongoose.model('Currency', CurrencySchema);

/// EXPORTS ///
module.exports = {
    CurrencySchema,
    Currency
};