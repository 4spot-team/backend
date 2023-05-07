const mongoose = require('mongoose');

const SignupPageSchema = new mongoose.Schema({
    username: String,
    hashPass: Number,
    email: String,
    dateOfBirth: {type: String, default: new Date()},
    preferences: [{type: String, default: new SuperEventType()}],       // Consider if changing it with EventType
    defaultPaymentMethod: {type: String, default: new CreditCard},
    defaultCreditCard: {type: String, default: new CreditMethod} 
});

SignupPageSchema.methods.registerUser = function() {
    // TODO
};

SignupPage = mongoose.model('SignupPage', SignupPageSchema);
module.exports = SignupPage;