import Supplier from '../models/Supplier.js';

export const createSupplier = async (req, res) => {
  try {
    // Only admin should be allowed (enforce in route)
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const { name, email, phone, minReliability, maxReliability, minPerformance, maxPerformance } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter['contactInfo.email'] = { $regex: email, $options: 'i' };
    if (phone) filter['contactInfo.phone'] = { $regex: phone, $options: 'i' };
    if (minReliability) filter.reliability = { ...filter.reliability, $gte: Number(minReliability) };
    if (maxReliability) filter.reliability = { ...filter.reliability, $lte: Number(maxReliability) };
    if (minPerformance) filter.performance = { ...filter.performance, $gte: Number(minPerformance) };
    if (maxPerformance) filter.performance = { ...filter.performance, $lte: Number(maxPerformance) };
    const suppliers = await Supplier.find(filter);
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    // Only admin should be allowed (enforce in route)
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    // Only admin should be allowed (enforce in route)
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 