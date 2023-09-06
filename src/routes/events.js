require('dotenv').config();

const express = require("express");

const router = express.Router();
const eventController = require("../controllers/events");

const apiVersion = process.env.API_VERSION || 'v1';

// GET `/api/${apiVersion}/events/:eventCode`
router.get(
    `/api/${apiVersion}/events/:eventCode`, 
    eventController.getEventPage
);

// POST `/api/${apiVersion}/events/:eventCode`
router.post(
    `/api/${apiVersion}/events/:eventCode`, 
    eventController.postEventPage
);

module.exports = router;

