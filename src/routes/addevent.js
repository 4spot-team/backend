require('dotenv').config();

const express = require("express");

const router = express.Router();
const addEventController = require("../controllers/addevent");

const apiVersion = process.env.API_VERSION || 'v1';

// POST `/api/${apiVersion}/addevent`
router.post(`/api/${apiVersion}/addevent`, addEventController.fillEvent);

module.exports = router;
