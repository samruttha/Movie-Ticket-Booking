const express = require('express');
const router = express.Router();
const Theatre = require('../models/Theatre');

// 🔍 Search theatres by movie title
router.get('/search', async (req, res) => {
  const { title } = req.query;

  try {
    const results = await Theatre.find()
      .populate('movie')
      .where('movie.title').regex(new RegExp(title, 'i'));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
});

// 🆕 Add theatre (for testing in Postman)
router.post('/add', async (req, res) => {
  try {
    const newTheatre = new Theatre(req.body);
    await newTheatre.save();
    res.json({ message: 'Theatre added!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add theatre' });
  }
});

module.exports = router;
