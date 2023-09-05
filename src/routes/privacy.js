require('dotenv').config();

const express = require("express");

const router = express.Router();
const privacyController = require("../controllers/privacy");

const apiVersion = process.env.API_VERSION || 'v1';

// POST '/api/${apiVersion}/privacy'
router.post(
   '/api/${apiVersion}/privacy',
    privacyController.acceptTerms
);

module.exports = router;
