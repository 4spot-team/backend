require('dotenv').config();

const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users");

const apiVersion = process.env.API_VERSION || 'v1';

// GET `/api/${apiVersion}/users/:username`
router.get(
    `/api/${apiVersion}/users/:username`, 
    usersController.getUserPage
);

// POST `/api/${apiVersion}/users/:username`
router.post(
    `/api/${apiVersion}/users/:username`, 
    usersController.postUserPage
);

module.exports = router;
