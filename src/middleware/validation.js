const { body } = require('express-validator');

// Validation rules using Express Validator middleware

// Username should contain only lowercase letters, digits, underscores, and dots.
// It must start with a lowercase letter and be between 3 and 20 characters long.
const usernameValidation = body('username')
    .isString()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-z][a-z0-9_.]+$/);

// Email should be a valid email address.
const emailValidation = body('email').isEmail();

// Password should contain at least one digit, one lowercase letter, one uppercase letter,
// and one special character (-_!@#$%^&*+=), and be between 8 and 128 characters long.
const passwordValidation = body('password')
    .isString()
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_!@#$%^&*+=])/);

module.exports = {
    usernameValidation,
    emailValidation,
    passwordValidation,
};

