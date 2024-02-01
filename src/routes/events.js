require('dotenv').config();

const express = require("express");

const router = express.Router();
const eventController = require("../controllers/events");
const { checkToken } = require("../middleware/token");
const { checkTermsAcceptance } = require("../middleware/terms");

const { setGlobalHeaders } = require("../middleware/headers");

const apiVersion = process.env.API_VERSION || 'v1';

// OPTIONS `/api/${apiVersion}/events/:eventCode`
router.options(
    `/api/${apiVersion}/events/:eventCode`,
    setGlobalHeaders
);


// GET `/api/${apiVersion}/events/:eventCode`
router.get(
    `/api/${apiVersion}/events/:eventCode`, 
    setGlobalHeaders,
    [
        checkToken,
        checkTermsAcceptance
    ],
    eventController.getEventPage
);

// POST `/api/${apiVersion}/events/:eventCode`
router.post(
    setGlobalHeaders,
    `/api/${apiVersion}/events/:eventCode`, 
    [
        checkToken,
        checkTermsAcceptance
    ],
    eventController.postEventPage
);

module.exports = router;

