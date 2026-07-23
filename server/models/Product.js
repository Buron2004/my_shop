const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, default: 'uncategorized' },
  description: { type: String, default: '' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;