const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  language: String,
  showtimes: [String], // Optional if not needed
  theatres: [
    {
      name: String,
      showtimes: [String],
      languages: [String]
    }
  ]
});

module.exports = mongoose.model('Movie', movieSchema);

