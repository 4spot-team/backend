require('dotenv').config();

const express = require("express");

const { setGlobalHeaders } = require('../middleware/headers');

const router = express.Router();
const {
    getRecoveryToken,
    verifyToken,
    resetPassword
} = require("../controllers/recover");
const { validateUserInput } = require("../middleware/validation");
const { checkToken } = require("../middleware/token");

const apiVersion = process.env.API_VERSION || 'v1';

// OPTIONS `/api/${apiVersion}/recover`
router.options(
    `/api/${apiVersion}/recover`, 
    setGlobalHeaders,
);

// OPTIONS `/api/${apiVersion}/recover/:token`
router.options(
    `/api/${apiVersion}/recover/:token`, 
    setGlobalHeaders,
);

// POST `/api/${apiVersion}/recover`
// Password recovery request route
router.post(
    `/api/${apiVersion}/recover`, 
    setGlobalHeaders,
    [
        //checkToken,
        validateUserInput,
    ],
    getRecoveryToken
);

// GET `/api/${apiVersion}/recover/:token`
// Password reset route with token verification
router.get(
    `/api/${apiVersion}/recover/:token`, 
    setGlobalHeaders,
    //checkToken,
    verifyToken
);

// POST `/api/${apiVersion}/recover/:token`
// Password reset form submission route
router.post(
    `/api/${apiVersion}/recover/:token`, 
    setGlobalHeaders,
    [
        //checkToken,
        validateUserInput,
    ],
    resetPassword
);

module.exports = router;

