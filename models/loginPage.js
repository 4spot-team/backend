const mongoose = require('mognoose');

const LoginPageSchema = new mongoose.Schema({
    username: String,
    hashPass: Number
});

LoginPageSchema.methods.authenticate = function() {
    // TODO
};

const LoginPage = mongoose.model('LoginPage', LoginPageSchema);
module.exports = LoginPage;