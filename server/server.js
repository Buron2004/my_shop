const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();


app.use(cors({
  origin: [
    'http://localhost:5173',              // keep local dev working
    'https://my-shop-buron-ltd.vercel.app',   // your real deployed frontend
  ],
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/api/echo', (req, res) => {
  res.json({ youSent: req.body });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});