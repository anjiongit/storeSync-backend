import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Register (admin only in production, but open for now)
router.post('/register', register);

// Login
router.post('/login', login);

export default router; 