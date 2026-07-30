/*const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // no longer required — Google accounts won't have one
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  googleId: { type: String }, // Google's unique user id, if they signed up via Google
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;