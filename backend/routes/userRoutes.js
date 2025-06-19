const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed

router.post('/add', async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add user' });
  }
});

module.exports = router;

