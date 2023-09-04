const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login } = require('../controllers/login');
const { checkToken } = require('../middleware/token');

// POST '/login'
router.post(
    '/login',
    [
        body('username').isString().notEmpty(),
        body('password').isString().notEmpty(),
    ],
    login
);

module.exports = router;

