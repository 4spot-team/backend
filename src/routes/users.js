require('dotenv').config();

const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users");
const { checkToken } = require("../middleware/token");
const { checkTermsAcceptance } = require("../middleware/terms");

const apiVersion = process.env.API_VERSION || 'v1';

// GET `/api/${apiVersion}/users/:username`
router.get(
    `/api/${apiVersion}/users/:username`, 
    [
        checkToken,
        checkTermsAcceptance
    ],
    usersController.getUserPage
);

// POST `/api/${apiVersion}/users/:username`
router.post(
    `/api/${apiVersion}/users/:username`, 
    [
        checkToken,
        checkTermsAcceptance
    ],
    usersController.postUserPage
);

module.exports = router;
