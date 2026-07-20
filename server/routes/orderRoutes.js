const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const requireAuth = require('../middleware/auth');

// POST — create a new order (must be logged in)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const newOrder = await Order.create({
      user: req.userId, // attached by requireAuth — this is WHO is placing the order
      items,
      total,
      shippingAddress,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — this user's own order history
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — mock "pay" for an existing order
router.post('/:id/pay', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // only the order's owner can pay for it
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not your order' });
    }

    // --- MOCK PAYMENT LOGIC ---
    // simulate a real payment gateway call with a short delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // simulate success (90% of the time) — swap this for a real gateway call later
    const paymentSucceeded = Math.random() < 0.9;

    if (!paymentSucceeded) {
      return res.status(402).json({ error: 'Payment failed. Please try again.' });
    }

    order.status = 'paid';
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;