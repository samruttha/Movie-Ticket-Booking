// routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const SeatBooking = require('../models/SeatBooking');

// Fetch already booked seats
router.get('/availability', async (req, res) => {
  const { theatre, showtime, language, date } = req.query;
  const booking = await SeatBooking.findOne({ theatre, showtime, language, date }) || { bookedSeats: [] };
  res.json({ bookedSeats: booking.bookedSeats });
});

// Book new seats
router.post('/book-seats', async (req, res) => {
  const { theatre, showtime, language, date, seats } = req.body;
  if (!theatre || !showtime || !language || !date || !Array.isArray(seats)) {
    return res.status(400).json({ message: 'Missing booking data!' });
  }

  let booking = await SeatBooking.findOne({ theatre, showtime, language, date });
  if (!booking) {
    booking = new SeatBooking({ theatre, showtime, language, date, bookedSeats: [] });
  }

  const conflict = seats.find(seat => booking.bookedSeats.includes(seat));
  if (conflict) return res.status(400).json({ message: `Seat ${conflict} is already booked.` });

  booking.bookedSeats.push(...seats);
  await booking.save();
  res.json({ message: 'Seats booked successfully!' });
});

module.exports = router;
