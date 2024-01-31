require('dotenv').config();

const express = require("express");

const { fillEvent } = require("../controllers/addevent");
const { checkToken } = require("../middleware/token");
const { checkTermsAcceptance } = require("../middleware/terms");

const { setGlobalHeaders } = require("../middleware/headers");

const apiVersion = process.env.API_VERSION || 'v1';
const router = express.Router();

// OPTIONS `/api/${apiVersion}/users/:username`
router.options(
    `/api/${apiVersion}/users/:username`,
    setGlobalHeaders
);

// POST `/api/${apiVersion}/addevent`
router.post(
    `/api/${apiVersion}/addevent`, 
    setGlobalHeaders,
    [
        checkToken,
        checkTermsAcceptance
    ],
    fillEvent
);

module.exports = router;

