import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true },
  threshold: { type: Number, required: true },
  triggeredAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  message: { type: String },
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert; 