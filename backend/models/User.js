const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String   // ✅ This is important!
});

module.exports = mongoose.model('User', userSchema);



