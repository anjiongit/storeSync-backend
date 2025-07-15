import Item from '../models/Item.js';
import StockMovement from '../models/StockMovement.js';
import Supplier from '../models/Supplier.js';

// 1. Total items in stock
export const totalStock = async (req, res) => {
  try {
    const result = await Item.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    res.json({ totalStock: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Fast-moving vs slow-moving items (by movement count in last 30 days)
export const fastSlowMovingItems = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const movements = await StockMovement.aggregate([
      { $match: { date: { $gte: since } } },
      { $group: { _id: '$item', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    // Define fast/slow threshold (top 20% fast, bottom 20% slow)
    const total = movements.length;
    const fastCount = Math.ceil(total * 0.2);
    const slowCount = Math.ceil(total * 0.2);
    const fastIds = movements.slice(0, fastCount).map(m => m._id);
    const slowIds = movements.slice(-slowCount).map(m => m._id);
    const fastItems = await Item.find({ _id: { $in: fastIds } });
    const slowItems = await Item.find({ _id: { $in: slowIds } });
    res.json({ fastMoving: fastItems, slowMoving: slowItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Most reliable suppliers (top 5 by reliability, then performance)
export const reliableSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .sort({ reliability: -1, performance: -1 })
      .limit(5);
    res.json({ reliableSuppliers: suppliers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 