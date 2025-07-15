import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  type: { type: String, enum: ['inbound', 'outbound'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  note: { type: String },
});

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
export default StockMovement; 