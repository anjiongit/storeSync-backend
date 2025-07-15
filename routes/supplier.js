import express from 'express';
import { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier } from '../controllers/supplierController.js';
import { auth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all suppliers
router.get('/', auth, getSuppliers);
// Get single supplier
router.get('/:id', auth, getSupplierById);
// Create supplier (admin only)
router.post('/', auth, authorizeRoles('admin'), createSupplier);
// Update supplier (admin only)
router.put('/:id', auth, authorizeRoles('admin'), updateSupplier);
// Delete supplier (admin only)
router.delete('/:id', auth, authorizeRoles('admin'), deleteSupplier);

export default router; 