console.log("✅ This is the REAL server.js running.");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Route files
const userRoutes = require('./routes/userRoutes');
const authRoutes = require("./routes/auth");
const theatreRoutes = require('./routes/theatreRoutes');
const movieRoutes = require('./routes/movieRoutes');

// Models
const User = require('./models/User');

const app = express();
const PORT = 5000;

// 📦 Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🗂️ Static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/theatres', theatreRoutes);
app.use('/api/movies', movieRoutes);

// 🌐 Routes
app.use('/api/users', userRoutes);
console.log("✅ userRoutes are mounted!");

app.use('/api/auth', authRoutes);

// ⛳ Default route for frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 📝 Optional: Direct POST route for register (you may later move it to authRoutes.js)
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(200).json({ message: 'Registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});
app.post('/hello', (req, res) => {
  res.send("👋 Hello from server!");
});
app.get('/hello', (req, res) => {
  res.send("👋 Hello from server!");
});



// ✅ MongoDB + Start server once
mongoose.connect("mongodb://localhost:27017/movie-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
