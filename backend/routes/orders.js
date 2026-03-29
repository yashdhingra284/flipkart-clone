const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { shipping_address } = req.body;

    await client.query('BEGIN');

    // Get cart items
    const cartItems = await client.query(
      `SELECT ci.quantity, p.id as product_id, p.price, p.stock, p.name
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.user.id]
    );

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock and calculate total
    let totalAmount = 0;
    for (const item of cartItems.rows) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
      totalAmount += item.price * item.quantity;
    }

    // Create order
    const order = await client.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, totalAmount, JSON.stringify(shipping_address)]
    );

    // Create order items and update stock
    for (const item of cartItems.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.rows[0].id, item.product_id, item.quantity, item.price]
      );

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');

    // Send email
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: user.rows[0].email,
  subject: '🛍️ Order Confirmed - Flipkart Clone',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      
      <div style="background-color: #2874f0; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Flipkart Clone</h1>
      </div>

      <div style="padding: 30px; background-color: #f9f9f9;">
        
        <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin-bottom: 20px;">
          <h2 style="color: #2e7d32; margin: 0;">✅ Order Placed Successfully!</h2>
        </div>

        <p style="color: #333; font-size: 16px;">
          Hello <strong>${user.rows[0].name}</strong>,
        </p>
        <p style="color: #333;">
          Thank you for shopping with us! Your order has been placed successfully and is being processed.
        </p>

        <div style="background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #2874f0; margin-top: 0;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Order ID</td>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">
                #${order.rows[0].id.slice(0, 8).toUpperCase()}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Order Date</td>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">
                ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Total Amount</td>
              <td style="padding: 8px 0; font-weight: bold; color: #2874f0; font-size: 20px;">
                ₹${Number(totalAmount).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Status</td>
              <td style="padding: 8px 0;">
                <span style="background-color: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                  ✅ Placed
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #2874f0; margin-top: 0;">Items Ordered</h3>
          ${cartItems.rows.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
              <div>
                <p style="margin: 0; color: #333; font-weight: bold;">${item.name}</p>
                <p style="margin: 4px 0 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
              </div>
              <p style="margin: 0; font-weight: bold; color: #333;">
                ₹${(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          `).join('')}
          <div style="display: flex; justify-content: space-between; padding: 15px 0 0;">
            <span style="font-weight: bold; font-size: 18px;">Total</span>
            <span style="font-weight: bold; font-size: 18px; color: #2874f0;">
              ₹${Number(totalAmount).toLocaleString()}
            </span>
          </div>
        </div>

        <div style="background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #2874f0; margin-top: 0;">📦 Delivery Address</h3>
          <p style="color: #333; margin: 0; line-height: 1.8;">
            <strong>${order.rows[0].shipping_address.name}</strong><br/>
            📞 ${order.rows[0].shipping_address.phone}<br/>
            ${order.rows[0].shipping_address.address}<br/>
            ${order.rows[0].shipping_address.city}, ${order.rows[0].shipping_address.state}<br/>
            📮 ${order.rows[0].shipping_address.pincode}
          </p>
        </div>

        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          If you have any questions about your order, please contact us.
        </p>

      </div>

      <div style="background-color: #2874f0; padding: 15px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 12px;">
          © 2024 Flipkart Clone. All rights reserved.
        </p>
      </div>

    </div>
  `
};

transporter.sendMail(mailOptions, (err) => {
  if (err) console.log('Email error:', err);
  else console.log('✅ Order confirmation email sent to', user.rows[0].email);
});

    transporter.sendMail(mailOptions, (err) => {
      if (err) console.log('Email error:', err);
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order: order.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.status(200).json({ orders: orders.rows });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderItems = await pool.query(
      `SELECT oi.*, p.name, p.images
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.status(200).json({
      order: order.rows[0],
      items: orderItems.rows
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;