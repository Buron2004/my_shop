const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtpEmail } = require('../config/mailer');
const router = express.Router();
const crypto = require('crypto');
const { sendResetEmail } = require('../config/mailer');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// FORGOT PASSWORD — generates a reset token and emails a link
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    // Deliberately vague response either way — don't reveal whether an email exists
    if (!user) {
      return res.status(200).json({ message: 'If that account exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await sendResetEmail(email, resetLink);

    res.status(200).json({ message: 'If that account exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESET PASSWORD — verifies the token and sets a new password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findOne({ email });
    if (!user || user.resetToken !== token) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }
    if (user.resetTokenExpires < new Date()) {
      return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

// REGISTER — creates an unverified account and emails an OTP
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires,
    });

    await sendOtpEmail(email, otp);

    res.status(201).json({
      message: 'Account created. Check your email for a verification code.',
      email: newUser.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VERIFY OTP — confirms the code, marks the account verified, and logs them in
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: 'Account already verified' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Incorrect code' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'Code has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESEND OTP — for expired codes or lost emails
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: 'Account already verified' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'A new code has been sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN — now blocks unverified accounts
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in', email: user.email });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GOOGLE LOGIN/REGISTER — verifies Google's token, then logs in or creates an account
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'No credential provided' });
    }

    // Verify the token is genuinely from Google, and extract the person's info
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Existing account — link the Google id if it wasn't already
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true; // Google already verified this email
        await user.save();
      }
    } else {
      // Brand new account, created directly from Google's verified info
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true, // no OTP needed — Google already proved this email
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;