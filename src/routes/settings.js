require('dotenv').config();

const express = require("express");

const router = express.Router();
const settingsController = require("../controllers/settings");

const apiVersion = process.env.API_VERSION || 'v1';

// GET `/api/${apiVersion}/settings`
router.get(
    `/api/${apiVersion}/settings`, 
    settingsController.getSettingsPage
);

// POST `/api/${apiVersion}/settings`
router.post(
    `/api/${apiVersion}/settings`, 
    settingsController.modifySettings
);

module.exports = router;
