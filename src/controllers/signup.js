const bcrypt = require('bcrypt');
const { Stakeholder } = require('../models/stakeholder');
const { generateToken } = require('../middleware/token');

const SALT_ROUNDS = 10;

async function register(req, res) {

    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await Stakeholder.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash and salt the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new stakeholder document with the hashed password
        const newStakeholder = new Stakeholder({
            username,
            email,
            hashPass: hashedPassword,
        });

        // Save the stakeholder document to the database
        await newStakeholder.save();

        // Generate an access token for the newly registered user using token management middleware
        const accessToken = generateToken(username);

        // Send the access token in the response
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully', 
            token: accessToken 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed' });
    }
}

module.exports = {
    register,
};

