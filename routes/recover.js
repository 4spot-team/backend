const express = require("express");

const router = express.Router();
const recoveryController = require("../controllers/recover");

router.get("/recover", recoveryController.getRecoveryPage);
router.post("/recover", recoveryController.fillRecovery);

module.exports = router;
