const express = require("express");

const router = express.Router();
const privacyController = require("../controllers/privacy");

router.get("/privacy", privacyController.getPrivacyPage);

module.exports = router;
