const express = require("express");

const router = express.Router();
const addEventController = require("../controllers/addevent");

router.get("/addevent", addEventController.getAddEventPage);
router.post("/addevent", addEventController.fillEvent);

module.exports = router;
