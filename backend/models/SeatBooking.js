// models/SeatBooking.js
const mongoose = require('mongoose');

const seatBookingSchema = new mongoose.Schema({
  theatre: { type: String, required: true },
  showtime: { type: String, required: true },
  language: { type: String, required: true },
  date: { type: String, required: true }, // store as string "YYYY-MM-DD"
  bookedSeats: { type: [String], default: [] }
});

module.exports = mongoose.model('SeatBooking', seatBookingSchema);
