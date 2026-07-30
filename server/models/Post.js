const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;