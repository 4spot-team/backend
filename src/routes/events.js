const express = require("express");

const router = express.Router();
const eventController = require("../controllers/events");

router.get("/events/:event_code", eventController.getEventPage);
router.post("/events/:event_code", eventController.postEventPage);

module.exports = router;
