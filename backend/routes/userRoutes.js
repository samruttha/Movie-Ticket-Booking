const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Booking = require('../models/Booking'); 

// ✅ Add new user (for admin or testing)
router.post('/add', async (req, res) => {
  const { username, email, contact, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const newUser = new User({ username, email, contact, password }); // Save plain password for now
    await newUser.save();
    res.status(201).json({ message: 'User added successfully!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
});

// ✅ Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username email contact'); // omit password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// ✅ Get booking history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }); // newest first
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching booking history' });
  }
});

// ✅ Update user profile (username, email, contact)
router.put('/profile/:id', async (req, res) => {
  const { username, email, contact } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, contact }, // update all fields
      { new: true }
    ).select('username email contact');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated!', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;


