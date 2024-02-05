const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    ticketVisibility: { type: String, required: true },
});

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = {
    Settings,
    SettingsSchema
};
