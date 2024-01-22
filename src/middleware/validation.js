require('dotenv').config();
const { body, validationResult } = require('express-validator');

// Validation rules using Express Validator middleware

// Username should contain only lowercase letters, digits, underscores, and dots.
// It must start with a lowercase letter and be between 3 and 20 characters long.
const usernameValidation = body('username')
    .isString()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-z][a-z0-9_.]+$/)
    .trim();

// Email should be a valid email address.
const emailValidation = body('email')
    .isEmail()
    .normalizeEmail();

// Password should contain at least one digit, one lowercase letter, one uppercase letter,
// and one special character (-_!@#$%^&*+=), and be between 8 and 128 characters long.
const passwordValidation = body('password')
    .isString()
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_!@#$%^&*+=])/)
    .trim();

// Used to build route paths
const apiVersion = process.env.API_VERSION || 'v1';


// Middleware for validating user input data
async function validateUserInput(req, res, next) {
    const route = req.path;
    const baseRoute = `/api/${apiVersion}`;

    console.log(route.startsWith(`${baseRoute}/recover/`))

    // Define validation rules based on the route
    let validationRules = [];
    if (route === `${baseRoute}/register`) {
        validationRules = [
            emailValidation,
            usernameValidation,
            passwordValidation,
        ];
    } else if (route === `${baseRoute}/login`) {
        validationRules = [
            usernameValidation,
            passwordValidation,
        ];
    } else if (route === `${baseRoute}/recover`) {
        validationRules = [
            emailValidation,
        ];
    } else if (route.startsWith(`${baseRoute}/recover/`)) {
        // for /recover/:token routes
        validationRules = [
            passwordValidation,
        ];
    }

    try {
        // Run validation for each rule asynchronously
        await Promise.all(validationRules.map(async (rule) => {
            await rule.run(req);
        }));

        const errors = validationResult(req);

        // Check if there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ message: 'Validation failed' });
    }
};


module.exports = {
    validateUserInput,
};

