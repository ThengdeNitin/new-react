const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path as necessary

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, username, password } = req.body;

    // Basic validation
    if (!name || !email || !phone || !username || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    const existingUserEmail = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    if (existingUserEmail) {
      return res.status(409).json({ message: 'User Email already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({ name, email, phone, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
