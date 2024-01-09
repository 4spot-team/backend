const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Stakeholder } = require('../models/stakeholder');
const { validationResult } = require('express-validator');
const { generateToken } = require('../middleware/token');

// POST '/login
async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Check if the user exists by username
        const user = await Stakeholder.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.hashPass);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Generate a JWT token for the authenticated user
        const token = generateToken(username);

        // Send the token in the response
        res.status(200).json({ message: 'Authentication successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Authentication failed' });
    }
}

module.exports = {
    login,
};

