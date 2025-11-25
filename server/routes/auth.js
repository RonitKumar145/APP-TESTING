const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const InviteRequest = require('../models/InviteRequest');
const crypto = require('crypto');

// Register
router.post('/register', async (req, res) => {
    const { username, email, password, inviteCode } = req.body;

    try {
        // 1. Check Invite Code
        const validInvite = await InviteCode.findOne({ code: inviteCode, isUsed: false });
        if (!validInvite) {
            return res.status(400).json({ message: 'Invalid or used invite code' });
        }

        // 2. Check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const user = new User({
            username,
            email,
            password: hashedPassword,
            inviteCodeUsed: inviteCode
        });

        await user.save();

        // 5. Mark invite code as used
        validInvite.isUsed = true;
        validInvite.usedBy = user._id;
        await validInvite.save();

        // 6. Create Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, user: { id: user._id, username: user.username } });

    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate Token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send Email (Ethereal)
        const nodemailer = require('nodemailer');
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const resetUrl = `http://localhost:5173/reset-password/${token}`; // Assuming local dev for now, should be env var

        const info = await transporter.sendMail({
            from: '"Uni Guys Support" <support@uniguys.com>',
            to: user.email,
            subject: "Password Reset Request",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${resetUrl}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.json({ message: 'Email sent', previewUrl: nodemailer.getTestMessageUrl(info) });

    } catch (err) {
        console.error('Forgot Password Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        if (req.body.password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been updated.' });

    } catch (err) {
        console.error('Reset Password Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check User
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Create Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, username: user.username } });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Generate Invite Code (Admin only - simplified for now)
router.post('/generate-invite', async (req, res) => {
    try {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newInvite = new InviteCode({ code });
        await newInvite.save();
        res.json({ code });
    } catch (err) {
        res.status(500).json({ message: 'Error generating code' });
    }
});

// Request Invite
router.post('/request-invite', async (req, res) => {
    const { email, reason } = req.body;
    try {
        const existingRequest = await InviteRequest.findOne({ email });
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already pending for this email' });
        }

        const newRequest = new InviteRequest({ email, reason });
        await newRequest.save();
        res.status(201).json({ message: 'Request submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Invite Requests (Admin only)
router.get('/invite-requests', async (req, res) => {
    try {
        const requests = await InviteRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all users (for Who to Follow)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('username _id');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
