import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import feedbackRoutes from './routes/feedback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/feedback', feedbackRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
