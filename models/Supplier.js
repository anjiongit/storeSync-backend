import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactInfo: {
    email: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  reliability: { type: Number, default: 0 },
  performance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier; 