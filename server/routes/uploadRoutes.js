const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/', requireAuth, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.status(200).json({ url: req.file.path });
});

module.exports = router;