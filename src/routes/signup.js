require('dotenv').config();

const express = require('express');
const { validationResult } = require('express-validator');

const { validateUserInput } = require('../middleware/validation');
const { register } = require('../controllers/signup');

const apiVersion = process.env.API_VERSION || 'v1';
const router = express.Router();

// POST `/api/${apiVersion}/register`
router.post(
    `/api/${apiVersion}/register`, 
    validateUserInput, 
    async (req, res) => {

        // Check for validation errors from the Express Validator middleware
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Call the controller function to register the user
            const registrationResult = await register(req, res);

            // Return the response provided by the controller
            /* return res.status(registrationResult.status).json(registrationResult); */
            return res;

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Registration failed' });
        }
    }
);

module.exports = router;

