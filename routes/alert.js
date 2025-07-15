import express from 'express';
import { getAlerts } from '../controllers/alertController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all alerts
router.get('/', auth, getAlerts);

export default router; 