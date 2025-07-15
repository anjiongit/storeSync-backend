import express from 'express';
import { createItem, getItems, getItemById, updateItem, deleteItem } from '../controllers/itemController.js';
import { auth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all items
router.get('/', auth, getItems);
// Get single item
router.get('/:id', auth, getItemById);
// Create item (admin only)
router.post('/', auth, authorizeRoles('admin'), createItem);
// Update item (admin only)
router.put('/:id', auth, authorizeRoles('admin'), updateItem);
// Delete item (admin only)
router.delete('/:id', auth, authorizeRoles('admin'), deleteItem);

export default router; 