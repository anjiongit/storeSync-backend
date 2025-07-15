import Alert from '../models/Alert.js';

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('item')
      .sort({ triggeredAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 