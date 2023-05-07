const mongoose = require('mongoose');

const options = { discriminatorKey: 'kind' };

/// MAIN SCHEMAS ///

/**
 * Credit Method Schema
 */
const CreditMethodSchema = new mongoose.Schema({
    owner: { type: String, required: true}
});

/**
 * Credit Card Schema
 */
const CreditCardSchema = new mongoose.Schema({
    primaryAccountNumber: { type: String, required: true },
    expiration: { type: Date, required: true },
    verificationCode: { type: String, required: true },
    options
});

/**
 * Bank Account Schema
 */
const BankAccountSchema = new mongoose.Schema({
    IBAN: { type: String, required: true },
    jointOwner: String,
    bank: { type: String, required: true },
    branch: { type: String, required: true },
    options
});


/// MODELS ///

const CreditMethod = mongoose.model('CreditMethod', CreditMethodSchema);
const CreditCard = CreditMethod.discriminator('CreditCard', CreditCardSchema);
const BankAccount = CreditMethod.discriminaror('BankAccount', BankAccountSchema);


/// EXPORTS ///

module.exports = {
    CreditMethodSchema, CreditCardSchema, BankAccountSchema,
    CreditMethod, CreditCard, BankAccount
};