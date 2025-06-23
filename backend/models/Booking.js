// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    theatreName: { type: String, required: true },
    movieTitle: { type: String, required: true },
    date: { type: Date, required: true },               // ✅ Date
    showtime: { type: String, required: true },
    language: { type: String, required: true },
    seats: { type: [String], required: true },          // ✅ Array of seat strings
    totalPrice: { type: Number, required: true }
  },
  { timestamps: true }                                   // ✅ optional createdAt, updatedAt
);

module.exports = mongoose.model('Booking', bookingSchema);
