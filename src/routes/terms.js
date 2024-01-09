require('dotenv').config();

const express = require("express");

const router = express.Router();
const { acceptTerms } = require('../controllers/terms');
const { checkToken } = require('../middleware/token');
const { setGlobalHeaders } = require('../middleware/headers');

const apiVersion = process.env.API_VERSION || 'v1';

// OPTIONS `/api/${apiVersion}/accept-terms`
router.options(
    `/api/${apiVersion}/accept-terms`,
    setGlobalHeaders  
);

// POST `/api/${apiVersion}/accept-terms`
router.post(
    `/api/${apiVersion}/accept-terms`, 
    setGlobalHeaders,
    checkToken,
    acceptTerms
);


module.exports = router;

