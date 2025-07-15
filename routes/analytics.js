import express from 'express';
import { totalStock, fastSlowMovingItems, reliableSuppliers } from '../controllers/analyticsController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/total-stock', auth, totalStock);
router.get('/fast-slow-moving', auth, fastSlowMovingItems);
router.get('/reliable-suppliers', auth, reliableSuppliers);

export default router; 