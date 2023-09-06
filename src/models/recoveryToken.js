const mongoose = require('mongoose');

const recoveryTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stakeholder',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const RecoveryToken = mongoose.model('RecoveryToken', recoveryTokenSchema);

module.exports = RecoveryToken;

