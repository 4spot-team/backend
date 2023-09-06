require('dotenv').config();

const express = require("express");

const router = express.Router();
const { acceptTerms } = require('../controllers/acceptTerms');
const { checkToken } = require('../middleware/token');

const apiVersion = process.env.API_VERSION || 'v1';


// POST `/api/${apiVersion}/accept-terms`
router.post(
    `/api/${apiVersion}/accept-terms`, 
    checkToken,
    acceptTerms
);


module.exports = router;

