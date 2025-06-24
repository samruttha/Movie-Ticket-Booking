// ✅ This is the REAL server.js
console.log("✅ Starting the server...");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

// 🧭 Import route files
const userRoutes = require('./routes/userRoutes');      // User account routes
const authRoutes = require('./routes/auth');           // Login/Register routes
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// 🧭 Import models (for direct register if you want)
const User = require('./models/User');

const app = express();
const PORT = 5000;

// 📦 Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 📂 Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// 🧭 Mount routes
app.use('/api/users', userRoutes);      // User account/profile routes
app.use('/api/auth', authRoutes);       // Login/Register routes
app.use('/api/movies', movieRoutes);          // Movie routes
app.use('/api/bookings', bookingRoutes);// Booking routes

// ✅ Test routes
app.get('/hello', (req, res) => res.send('👋 Hello from server!'));
app.post('/hello', (req, res) => res.send('👋 Hello from server!'));

// 🏠 Fallback to index.html for frontend routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Route for Change Password
app.put('/api/users/change-password/:userId', async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating password.' });
  }
});

// ✅ MongoDB connection + server start
mongoose.connect('mongodb://localhost:27017/movie-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));


