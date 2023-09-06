require('dotenv').config();

const express = require("express");

const router = express.Router();
const { fillEvent } = require("../controllers/addevent");
const { checkToken } = require("../middleware/token");
const { checkTermsAcceptance } = require("../middleware/token");

const apiVersion = process.env.API_VERSION || 'v1';

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
