const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: String,
  location: String,
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  showtimes: [String],     // ["10:00 AM", "1:00 PM"]
  languages: [String]      // ["English", "Kannada"]
});

module.exports = mongoose.model('Theatre', theatreSchema);
