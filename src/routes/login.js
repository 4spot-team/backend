require('dotenv').config();

const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const { login } = require('../controllers/login');
const { checkToken } = require('../middleware/token');

const apiVersion = process.env.API_VERSION || 'v1';

// POST `/api/${apiVersion}/login`
router.post(
    `/api/${apiVersion}/login`,
    [
        body('username').isString().notEmpty(),
        body('password').isString().notEmpty(),
    ],
    async (req, res) => {

        // Check for validation errors from the Express Validator middleware
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Call the controller function to login the user
            const loginResult = await login(req, res);

            // Return the response provided by the controller
            return res.status(loginResult.status).json(loginResult);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Login failed' });
        }
    }
);

module.exports = router;

