require('dotenv').config();

const express = require('express');

const router = express.Router();
const { checkToken } = require('../middleware/token');
const { checkTermsAcceptance } = require('../middleware/terms');
const {
    getHomeFeed,
    postHomePage,
} = require('../controllers/home');

const apiVersion = process.env.API_VERSION || 'v1';

// GET `/api/${apiVersion}/home`
router.get(
    `/api/${apiVersion}/home`, 
    [
        checkToken, 
        checkTermsAcceptance
    ],
    getHomeFeed
);

/*
// POST `/api/${apiVersion}/home`
router.post(
    `/api/${apiVersion}/home`, 
    [
        checkToken, 
        checkTermsAcceptance
    ],
    postHomePage
);
*/

module.exports = router;

