const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);

    try {
        // Find the user by username
        const logged_in_user = await User.findOne({ username });
        console.log('User found:', logged_in_user);
        if (!logged_in_user) {
            // User not found
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, logged_in_user.password);

        if (!isMatch) {
            // Password does not match
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Successful login
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'User Not Found' });
    }
});

module.exports = router;
