const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt'); // ✅ Import bcrypt

// ✅ REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, contact, password } = req.body;

    // Validate inputs
    if (!username || !email || !contact || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered. Please log in." });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      username, 
      email, 
      contact, 
      password: hashedPassword 
    }); 
    await newUser.save();

    res.status(201).json({
      message: "You've registered!",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        contact: newUser.contact
      }
    });
  } catch (err) {
    console.error('Error during register:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // ✅ Compare password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', userId: user._id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;





