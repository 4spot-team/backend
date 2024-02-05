require('dotenv').config();

const express = require("express");

const { eventsMap } = require("../controllers/map");
const { checkToken } = require("../middleware/token");
const { checkTermsAcceptance } = require("../middleware/terms");

const { setGlobalHeaders } = require("../middleware/headers");

const apiVersion = process.env.API_VERSION || 'v1';
const router = express.Router();

// OPTIONS `/api/${apiVersion}/map`
router.options(
    `/api/${apiVersion}/map`,
    setGlobalHeaders
);

// POST `/api/${apiVersion}/map`
router.post(
    `/api/${apiVersion}/map`, 
    setGlobalHeaders,
    [
        checkToken,
        checkTermsAcceptance
    ],
    eventsMap
);

module.exports = router;

