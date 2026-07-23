const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// GET all posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — create a new post (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, image } = req.body;
    if (!title || !excerpt || !content) {
      return res.status(400).json({ error: 'title, excerpt, and content are required' });
    }
    const newPost = await Post.create({ title, excerpt, content, image, author: req.userId });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — update an existing post (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, image } = req.body;
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { title, excerpt, content, image },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — remove a post (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;