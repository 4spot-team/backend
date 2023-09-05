require('dotenv').config();

const express = require("express");

const router = express.Router();
const recoveryController = require("../controllers/recover");

const apiVersion = process.env.API_VERSION || 'v1';

// POST '/api/${apiVersion}/recover'
// Password recovery request route
router.post(
    '/api/${apiVersion}/recover', 
    recoverController.requestPasswordReset
);

// GET '/api/${apiVersion}/recover/:token'
// Password reset route with token verification
router.get(
    '/api/${apiVersion}/recover/:token', 
    recoverController.verifyPasswordResetToken
);

// POST '/api/${apiVersion}/recover/:token'
// Password reset form submission route
router.post(
    '/api/${apiVersion}/recover/:token', 
    recoverController.resetPassword
);

module.exports = router;

