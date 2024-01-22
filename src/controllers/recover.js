require('dotenv').config();

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const { Stakeholder } = require('../models/stakeholder');
const RecoveryToken = require('../models/recoveryToken');

const apiVersion = process.env.API_VERSION || 'v1';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const SALT_ROUNDS = 10;

// Generate a random token
function generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Send a password reset mail
async function sendRecoveryEmail(user, token) {
    const resetLink = `http://localhost:${process.env.PORT}/api/${apiVersion}/recover/${token}`;

    const msg = {
        from: process.env.SENDER_MAIL,
        to: user.email,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetLink}`,
    };

    try {
        await sgMail.send(msg);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

// POST '/recover' controller
async function getRecoveryToken(req, res) {
    // Get a recoveryToken by email

    const { email } = req.body;
    console.log(email);

    try {
        // Check if the user with the provided email exists
        const existingUser = await Stakeholder.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User does not exist' 
            });
        }

        // Generate a random recovery token
        const recoveryToken = generateRandomToken();

        // Save the recovery token in the database
        const recoveryTokenDoc = new RecoveryToken({
            user: existingUser._id,
            token: recoveryToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000), // 1 hour
        });
        await recoveryTokenDoc.save();

        // Send the recovery email with the token
        await sendRecoveryEmail(existingUser, recoveryToken);

        res.status(200).json({ 
            success: true,
            message: 'Recovery email sent successfully' 
        });
    } catch (error) {
        console.error('Error recovering password:', error);
        res.status(500).json({ 
            success: false,
            message: 'Recovery failed' 
        });
    }
}

// POST '/recover/:token' controller
async function resetPassword(req, res) {
    // Reset password, providing recoveryToken

    const { token } = req.params;
    const { password } = req.body;

    const newPassword = password;

    console.log(newPassword);   // DEBUG

    try {
        // Find the recovery token in the database
        const recoveryTokenDoc = await RecoveryToken.findOne({ token });

        if (!recoveryTokenDoc) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired token' 
            });
        }

        // Check if the token has expired
        const currentTime = new Date();
        if (recoveryTokenDoc.expiresAt < currentTime) {
            return res.status(400).json({ 
                success: false,
                message: 'Token has expired' 
            });
        }

        // Find the associated user
        const existingUser = await Stakeholder.findById(recoveryTokenDoc.user);

        if (!existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Hash and update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        existingUser.hashPass = hashedPassword;
        await existingUser.save();

        // Delete the used recovery token
        await RecoveryToken.deleteOne({ token: recoveryTokenDoc.token });

        res.status(200).json({ 
            success: true,
            message: 'Password reset successfully' 
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ 
            success: false,
            message: 'Password reset failed' 
        });
    }
}

// GET '/recover/:token' controller
async function verifyToken(req, res) {
    // Verify if token is valid 

    const { token } = req.params;

    try {
        // Find the recovery token in the database
        const recoveryTokenDoc = await RecoveryToken.findOne({ token });

        if (!recoveryTokenDoc) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired token' 
            });
        }

        // Check if the token has expired
        const currentTime = new Date();
        if (recoveryTokenDoc.expiresAt < currentTime) {
            return res.status(400).json({ 
                success: false,
                message: 'Token has expired' 
            });
        }

        res.redirect(
            'http://' + process.env.FRONTEND_HOST + ':' +
            process.env.FRONTEND_PORT + '/passwordchange/' + 
            recoveryTokenDoc.token
        );
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ 
            success: false,
            message: 'Token verification failed' 
        });
    }
}


module.exports = {
    getRecoveryToken,
    resetPassword,
    verifyToken,
}

