const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InviteCode = require('../models/InviteCode');

// Register
router.post('/register', async (req, res) => {
    const { username, password, inviteCode } = req.body;

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

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const user = new User({
            username,
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

module.exports = router;
