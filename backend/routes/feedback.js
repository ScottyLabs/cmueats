import express from 'express';
import { sendFeedbackEmail } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', sendFeedbackEmail);

export default router;
