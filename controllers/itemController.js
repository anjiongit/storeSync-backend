import Item from '../models/Item.js';

export const createItem = async (req, res) => {
  try {
    // Only admin should be allowed (enforce in route)
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const { name, category, sku, supplier, location, minQuantity, maxQuantity, stock } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (sku) filter.sku = { $regex: sku, $options: 'i' };
    if (supplier) filter.supplier = supplier;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minQuantity) filter.quantity = { ...filter.quantity, $gte: Number(minQuantity) };
    if (maxQuantity) filter.quantity = { ...filter.quantity, $lte: Number(maxQuantity) };
    if (stock === 'low') filter.$expr = { $lt: ["$quantity", "$lowStockThreshold"] };
    const items = await Item.find(filter).populate('supplier');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('supplier');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    // Only admin should be allowed (enforce in route)
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    // Only admin should be allowed (enforce in route)
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 