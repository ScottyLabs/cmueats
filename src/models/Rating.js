const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  userEmail: { type: String, required: true },
  foodRating: Number,
  locationRating: Number,
  cleanlinessRating: Number,
  serviceRating: Number,
  valueForMoneyRating: Number,
  menuVarietyRating: Number,
  waitTimeRating: Number,
  staffRating: Number,
  overallSatisfactionRating: Number,
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
