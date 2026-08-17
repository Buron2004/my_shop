const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

router.use(requireAuth); // every route here requires being logged in as yourself

// GET /api/users/me — full profile
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp -resetToken');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/me — update personal info
router.put('/me', async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, profilePicture },
      { new: true, runValidators: true }
    ).select('-password -otp -resetToken');
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/change-password
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user.password) {
      return res.status(400).json({ error: 'This account uses Google Sign-In and has no password to change' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/notifications
router.put('/notifications', async (req, res) => {
  try {
    const { emailNotifications, orderUpdates, promotions } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { notifications: { emailNotifications, orderUpdates, promotions } },
      { new: true }
    ).select('-password -otp -resetToken');
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Addresses ---

// POST /api/users/addresses — add a new address
router.post('/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const newAddress = req.body;

    // if this is marked default, unset any existing default first
    if (newAddress.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }
    // if it's the very first address, make it default automatically
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/addresses/:addressId — edit an address
router.put('/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ error: 'Address not found' });

    Object.assign(address, req.body);

    if (req.body.isDefault) {
      user.addresses.forEach((a) => {
        if (a._id.toString() !== req.params.addressId) a.isDefault = false;
      });
    }

    await user.save();
    res.status(200).json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/addresses/:addressId
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.addresses.pull(req.params.addressId);
    await user.save();
    res.status(200).json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/addresses/:addressId/default
router.put('/addresses/:addressId/default', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.addresses.forEach((a) => {
      a.isDefault = a._id.toString() === req.params.addressId;
    });
    await user.save();
    res.status(200).json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;