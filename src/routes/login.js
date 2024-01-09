require('dotenv').config();

const express = require('express');

const { login } = require('../controllers/login');
const { validateUserInput } = require('../middleware/validation');
const { setGlobalHeaders } = require('../middleware/headers');

const apiVersion = process.env.API_VERSION || 'v1';
const router = express.Router();

// OPTIONS `/api/${apiVersion}/login`
router.options(
    `/api/${apiVersion}/login`,
    setGlobalHeaders  
);

// POST `/api/${apiVersion}/login`
router.post(
    `/api/${apiVersion}/login`,
    setGlobalHeaders,
    validateUserInput,
    login,
);

module.exports = router;

