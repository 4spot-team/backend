const express = require("express");

const router = express.Router();
const settingsController = require("../controllers/settings");

router.get("/settings", settingsController.getSettingsPage);
router.post("/settings", settingsController.modifySettings);

module.exports = router;
