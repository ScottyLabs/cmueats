import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import feedbackRoutes from './routes/feedback.js'; // Existing feedback routes
import ratingRoutes from './routes/rating.js'; // New rating routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Feedback Routes
app.use('/api/feedback', feedbackRoutes);

// Rating Routes
app.use('/api/ratings', ratingRoutes); // New addition for rating system

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
