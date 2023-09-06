require('dotenv').config();

const express = require("express");

const router = express.Router();
const {
    getRecoveryController,
    verifyToken,
    resetPassword
} = require("../controllers/recover");
const { checkToken } = require("../middleware/token");

const apiVersion = process.env.API_VERSION || 'v1';

// POST `/api/${apiVersion}/recover`
// Password recovery request route
router.post(
    `/api/${apiVersion}/recover`, 
    checkToken
    recoverController.getRecoveryToken
);

// GET `/api/${apiVersion}/recover/:token`
// Password reset route with token verification
router.get(
    `/api/${apiVersion}/recover/:token`, 
    checkToken
    recoverController.verifyToken
);

// POST `/api/${apiVersion}/recover/:token`
// Password reset form submission route
router.post(
    `/api/${apiVersion}/recover/:token`, 
    checkToken
    recoverController.resetPassword
);

module.exports = router;

