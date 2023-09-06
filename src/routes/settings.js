require('dotenv').config();

const express = require("express");

const router = express.Router();
const {
    getSettings,
    modifySettings
} = require("../controllers/settings");
const { checkToken } = require("../middleware/token");
const { checkTermsAcceptance } = require("../middleware/terms");

const apiVersion = process.env.API_VERSION || 'v1';

// GET `/api/${apiVersion}/settings`
router.get(
    `/api/${apiVersion}/settings`, 
    [
        checkToken,
        checkTermsAcceptance
    ],
    getSettings
);

// POST `/api/${apiVersion}/settings`
router.post(
    `/api/${apiVersion}/settings`, 
    [
        checkToken,
        checkTermsAcceptance
    ],
    modifySettings
);

module.exports = router;
