const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// ✅ SUGGESTIONS should come first
router.get('/suggestions', async (req, res) => {
  const query = req.query.query || '';

  try {
    const suggestions = await Movie.find(
      { title: { $regex: new RegExp(query, 'i') } },
      { title: 1, _id: 0 }
    ).limit(5);

    res.json(suggestions);
  } catch (error) {
    console.error('Suggestion Error:', error);
    res.status(500).json({ message: 'Failed to fetch suggestions' });
  }
});

// ✅ MAIN SEARCH route
router.get('/', async (req, res) => {
  const movieName = req.query.name;

  try {
    const movie = await Movie.findOne({ title: { $regex: new RegExp(movieName, 'i') } });

    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ✅ POST route to add movies
router.post('/add', async (req, res) => {
  const { title, language, showtimes, theatres } = req.body;

  try {
    const newMovie = new Movie({ title, language, showtimes, theatres });
    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add movie' });
  }
});

module.exports = router;
// This file handles movie-related routes, including suggestions, main search, and adding movies.


