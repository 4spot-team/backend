const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users");

router.get("/:username", usersController.getUserPage);
router.post("/:username", usersController.postUserPage);

module.exports = router;
