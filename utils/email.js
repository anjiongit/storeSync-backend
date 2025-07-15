import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendLowStockAlert = async (to, item, quantity, threshold) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Low Stock Alert: ${item.name}`,
    text: `The stock for item '${item.name}' (SKU: ${item.sku}) has fallen below the threshold (${threshold}). Current quantity: ${quantity}.`,
  };
  await transporter.sendMail(mailOptions);
}; 