const express = require("express");

const router = express.Router();
const signupController = require("../controllers/signup");

router.get("/signup", signupController.getRegistrationPage);
router.post("/signup", signupController.register);

module.exports = router;
