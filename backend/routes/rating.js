import express from 'express';
import { createRating, getRatingsByRestaurant, getAverageRating } from '../controllers/ratingController.js';

const router = express.Router();

// POST: Create a new rating
router.post('/ratings', createRating);

// GET: Fetch all ratings for a restaurant
router.get('/ratings/:restaurantName', getRatingsByRestaurant);

// GET: Fetch the average rating for a restaurant
router.get('/ratings/average/:restaurantName', getAverageRating);

export default router;
