require('dotenv').config();

const express = require("express");

const router = express.Router();
const {
    getRecoveryController,
    verifyToken,
    resetPassword
} = require("../controllers/recover");
const { validateUserInput } = require("../middleware/validation");
const { checkToken } = require("../middleware/token");

const apiVersion = process.env.API_VERSION || 'v1';

// POST `/api/${apiVersion}/recover`
// Password recovery request route
router.post(
    `/api/${apiVersion}/recover`, 
    [
        checkToken,
        validateUserInput,
    ],
    getRecoveryToken
);

// GET `/api/${apiVersion}/recover/:token`
// Password reset route with token verification
router.get(
    `/api/${apiVersion}/recover/:token`, 
    checkToken,
    verifyToken
);

// POST `/api/${apiVersion}/recover/:token`
// Password reset form submission route
router.post(
    `/api/${apiVersion}/recover/:token`, 
    [
        checkToken,
        validateUserInput,
    ],
    resetPassword
);

module.exports = router;

