const express = require('express');
const router = express.Router();
const Rating = require('./RatingModel'); // Adjust path as necessary

// Post a new rating
router.post('/ratings', async (req, res) => {
  try {
    const newRating = new Rating(req.body);
    const savedRating = await newRating.save();
    res.status(201).send(savedRating);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all ratings for a restaurant
router.get('/ratings/:restaurantId', async (req, res) => {
  try {
    const ratings = await Rating.find({ restaurantId: req.params.restaurantId });
    res.status(200).send(ratings);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
