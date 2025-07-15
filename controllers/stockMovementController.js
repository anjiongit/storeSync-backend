import StockMovement from '../models/StockMovement.js';
import Item from '../models/Item.js';
import Alert from '../models/Alert.js';
import { sendLowStockAlert } from '../utils/email.js';

export const recordInbound = async (req, res) => {
  try {
    const { item: itemId, quantity, supplier, note } = req.body;
    const userId = req.user.userId;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.quantity += quantity;
    await item.save();
    const movement = new StockMovement({
      item: itemId,
      type: 'inbound',
      quantity,
      user: userId,
      supplier,
      note,
    });
    await movement.save();
    res.status(201).json(movement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const recordOutbound = async (req, res) => {
  try {
    const { item: itemId, quantity, note } = req.body;
    const userId = req.user.userId;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }
    item.quantity -= quantity;
    await item.save();
    const movement = new StockMovement({
      item: itemId,
      type: 'outbound',
      quantity,
      user: userId,
      note,
    });
    await movement.save();
    // Low stock alert logic
    if (item.quantity < item.lowStockThreshold) {
      // Create alert in DB
      const alert = new Alert({
        item: item._id,
        quantity: item.quantity,
        threshold: item.lowStockThreshold,
        message: `Low stock for item '${item.name}' (SKU: ${item.sku})`,
      });
      await alert.save();
      // Send email alert
      try {
        await sendLowStockAlert(process.env.EMAIL_USER, item, item.quantity, item.lowStockThreshold);
      } catch (emailErr) {
        // Log but don't block response
        console.error('Failed to send low stock email:', emailErr.message);
      }
    }
    res.status(201).json(movement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getStockMovements = async (req, res) => {
  try {
    const { item, type, user, supplier } = req.query;
    const filter = {};
    if (item) filter.item = item;
    if (type) filter.type = type;
    if (user) filter.user = user;
    if (supplier) filter.supplier = supplier;
    const movements = await StockMovement.find(filter)
      .populate('item')
      .populate('user')
      .populate('supplier')
      .sort({ date: -1 });
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 