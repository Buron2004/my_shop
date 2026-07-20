const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — create a new product (requires auth + admin)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, price, image } = req.body;
    if (!title || typeof price !== 'number') {
      return res.status(400).json({ error: 'title is required and price must be a number' });
    }
    const newProduct = await Product.create({ title, price, image });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — update an existing product
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — remove a product
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;