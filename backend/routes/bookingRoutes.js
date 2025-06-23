const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const router = express.Router();

// POST new booking
router.post('/', async (req, res) => {
  try {
    const { userId, theatreName, movieTitle, date, showtime, language, seats, totalPrice } = req.body;
    console.log('📡 Incoming booking data:', req.body);

    // Check for already booked seats
    const existing = await Booking.findOne({ theatreName, movieTitle, date, showtime, seats: { $in: seats } });
    if (existing) {
      return res.status(400).json({ message: 'Some seats are already booked!' });
    }

    const booking = new Booking({ userId, theatreName, movieTitle, date, showtime, language, seats, totalPrice });
    await booking.save();

    console.log('✅ Saved booking:', booking);
    res.status(201).json({ message: 'Booking saved!', bookingId: booking._id });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ message: 'Error saving booking', error: error.message });
  }
});

// GET booked seats
router.get('/booked-seats', async (req, res) => {
  try {
    const { movieTitle, theatreName, date, showtime } = req.query;
    const bookings = await Booking.find({ movieTitle, theatreName, date, showtime });
    const bookedSeats = bookings.flatMap(b => b.seats); // merge all booked seats
    res.status(200).json({ bookedSeats });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: 'Error fetching booked seats', error: error.message });
  }
});

module.exports = router;

