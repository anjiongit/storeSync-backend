import express from 'express';
import { recordInbound, recordOutbound, getStockMovements } from '../controllers/stockMovementController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Record inbound stock (add to inventory)
router.post('/inbound', auth, recordInbound);
// Record outbound stock (remove from inventory)
router.post('/outbound', auth, recordOutbound);
// Get all stock movements (history)
router.get('/', auth, getStockMovements);

export default router; 