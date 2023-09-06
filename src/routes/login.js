require('dotenv').config();

const express = require('express');

const { login } = require('../controllers/login');
const { validateUserInput } = require('../middleware/validation');

const apiVersion = process.env.API_VERSION || 'v1';
const router = express.Router();

// POST `/api/${apiVersion}/login`
router.post(
    `/api/${apiVersion}/login`,
    validateUserInput,
    login
);

module.exports = router;

