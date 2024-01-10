require('dotenv').config();

const express = require('express');

const router = express.Router();
const { checkToken } = require('../middleware/token');
const { checkTermsAcceptance } = require('../middleware/terms');
const {
    getHomeFeed,
    filterEventsByQuery,
} = require('../controllers/home');

const { setGlobalHeaders } = require('../middleware/headers');

const apiVersion = process.env.API_VERSION || 'v1';

// OPTIONS `/api/${apiVersion}/home`
router.options(
    `/api/${apiVersion}/home`, 
    setGlobalHeaders
);

// GET `/api/${apiVersion}/home`
router.get(
    `/api/${apiVersion}/home`, 
    setGlobalHeaders,
    [
        checkToken, 
        checkTermsAcceptance
    ],
    getHomeFeed
);

// POST `/api/${apiVersion}/home`
router.post(
    `/api/${apiVersion}/home`, 
    setGlobalHeaders,
    [
        checkToken, 
        checkTermsAcceptance
    ],
    filterEventsByQuery
);

module.exports = router;

