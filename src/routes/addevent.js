require('dotenv').config();

const express = require("express");

const { fillEvent } = require("../controllers/addevent");
const { checkToken } = require("../middleware/token");
const { checkTermsAcceptance } = require("../middleware/terms");

const apiVersion = process.env.API_VERSION || 'v1';
const router = express.Router();

// POST `/api/${apiVersion}/addevent`
router.post(
    `/api/${apiVersion}/addevent`, 
    [
        checkToken,
        checkTermsAcceptance
    ],
    fillEvent
);

module.exports = router;
