import { RatingModel } from '../../src/services/ratingModel.js';

// Create a new rating
export const createRating = async (req, res) => {
  try {
    const ratingData = req.body; // Ensure body-parser middleware is used
    const newRating = await RatingModel.create(ratingData);
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
};

// Get all ratings for a restaurant
export const getRatingsByRestaurant = async (req, res) => {
  try {
    const { restaurantName } = req.params;
    const ratings = await RatingModel.getRatingsByRestaurant(restaurantName);
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

// Get average ratings for a restaurant
export const getAverageRating = async (req, res) => {
  try {
    const { restaurantName } = req.params;
    const averageRating = await RatingModel.getAverageRating(restaurantName);
    if (averageRating) {
      res.status(200).json({ averageRating });
    } else {
      res.status(404).json({ error: 'No ratings found for this restaurant' });
    }
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ error: 'Failed to fetch average rating' });
  }
};
