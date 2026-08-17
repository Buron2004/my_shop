const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// applies requireAuth + requireAdmin to EVERY route in this file
router.use(requireAuth, requireAdmin);

// GET /api/admin/summary — the top summary cards
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // last 30 days
    const previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 30 days before that

    async function getStatsForPeriod(start, end) {
      const [revenueResult] = await Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]);
      const orderCount = await Order.countDocuments({ createdAt: { $gte: start, $lt: end } });
      const customerCount = await User.countDocuments({
        role: 'customer', createdAt: { $gte: start, $lt: end },
      });
      return {
        revenue: revenueResult ? revenueResult.total : 0,
        orders: orderCount,
        customers: customerCount,
      };
    }

    const [current, previous] = await Promise.all([
      getStatsForPeriod(periodStart, now),
      getStatsForPeriod(previousPeriodStart, periodStart),
    ]);

    function percentChange(curr, prev) {
      if (prev === 0) return curr === 0 ? 0 : 100;
      return Math.round(((curr - prev) / prev) * 100);
    }

    const [allTimeRevenueResult] = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const [totalOrders, totalCustomers, totalProducts, pendingOrders, completedOrders, cancelledOrders, refundedPayments] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: 'customer' }),
        Product.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: 'delivered' }),
        Order.countDocuments({ status: 'cancelled' }),
        Order.countDocuments({ paymentStatus: 'refunded' }),
      ]);

    res.status(200).json({
      totalRevenue: allTimeRevenueResult ? allTimeRevenueResult.total : 0,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      refundedPayments,
      trends: {
        revenue: percentChange(current.revenue, previous.revenue),
        orders: percentChange(current.orders, previous.orders),
        customers: percentChange(current.customers, previous.customers),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/revenue-trend?range=7d
router.get('/revenue-trend', async (req, res) => {
  try {
    const range = req.query.range || '7d';
    const rangeInDays = { today: 1, '7d': 7, '30d': 30, '6mo': 182, year: 365 };
    const days = rangeInDays[range] || 7;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const results = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(results.map((r) => ({ date: r._id, revenue: r.revenue })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET /api/admin/payment-status-breakdown
router.get('/payment-status-breakdown', async (req, res) => {
  try {
    const results = await Order.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$paymentStatus', 'pending'] },
          count: { $sum: 1 },
        },
      },
    ]);

    const breakdown = { pending: 0, paid: 0, failed: 0, refunded: 0 };
    results.forEach((r) => {
      breakdown[r._id] = (breakdown[r._id] || 0) + r.count;
    });

    res.status(200).json(breakdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Admin Order Management Routes
// GET /api/admin/orders — searchable, filterable, sortable, paginated
router.get('/orders', async (req, res) => {
  try {
    const {
      search = '',
      status,
      paymentStatus,
      startDate,
      endDate,
      sort = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    const matchStage = {};
    if (status) matchStage.status = status;
    if (paymentStatus) matchStage.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const sortStage =
      sort === 'oldest' ? { createdAt: 1 } :
      sort === 'total' ? { total: -1 } :
      { createdAt: -1 }; // 'newest' default

    const pipeline = [
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'customer' } },
      { $unwind: '$customer' },
      { $match: matchStage },
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'customer.name': { $regex: search, $options: 'i' } },
            { 'customer.email': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    pipeline.push({ $sort: sortStage });

    const skip = (Number(page) - 1) * Number(limit);
    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: Number(limit) }],
        totalCount: [{ $count: 'count' }],
      },
    });

    const [result] = await Order.aggregate(pipeline);
    const orders = result.data;
    const total = result.totalCount[0]?.count || 0;

    res.status(200).json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/orders/:id — full detail for the drawer
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/orders/:id/status — change fulfillment status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Analytics Routes
// GET /api/admin/analytics/sales — best sellers, sales by category, avg order value
router.get('/analytics/sales', async (req, res) => {
  try {
    const bestSellers = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.title',
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    const salesByCategory = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$productInfo.category', 'Uncategorized'] },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    const [orderStats] = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);
    const averageOrderValue = orderStats ? orderStats.total / orderStats.count : 0;

    res.status(200).json({ bestSellers, salesByCategory, averageOrderValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/analytics/products — full product performance table
router.get('/analytics/products', async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$items.title',
          category: { $first: { $ifNull: ['$productInfo.category', 'Uncategorized'] } },
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    const maxRevenue = Math.max(...results.map((r) => r.revenue), 0);
    const withPerformance = results.map((r) => ({
      ...r,
      performance:
        r.revenue >= maxRevenue * 0.66 ? 'High' :
        r.revenue >= maxRevenue * 0.33 ? 'Medium' : 'Low',
    }));

    res.status(200).json(withPerformance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/analytics/customers — new vs returning, growth, top spenders
router.get('/analytics/customers', async (req, res) => {
  try {
    const ordersPerCustomer = await Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
    ]);

    const newCustomers = ordersPerCustomer.filter((c) => c.orderCount === 1).length;
    const returningCustomers = ordersPerCustomer.filter((c) => c.orderCount > 1).length;

    const growth = await User.aggregate([
      { $match: { role: 'customer' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const topCustomersRaw = await Order.aggregate([
      { $group: { _id: '$user', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'customer' } },
      { $unwind: '$customer' },
    ]);

    const topCustomers = topCustomersRaw.map((c) => ({
      name: c.customer.name,
      email: c.customer.email,
      totalSpent: c.totalSpent,
      orderCount: c.orderCount,
    }));

    res.status(200).json({
      newCustomers,
      returningCustomers,
      growth: growth.map((g) => ({ date: g._id, count: g.count })),
      topCustomers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/analytics/payments — breakdown + totals per status
router.get('/analytics/payments', async (req, res) => {
  try {
    const results = await Order.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$paymentStatus', 'pending'] },
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);

    const summary = { pending: {}, paid: {}, failed: {}, refunded: {} };
    ['pending', 'paid', 'failed', 'refunded'].forEach((s) => {
      summary[s] = { count: 0, totalAmount: 0 };
    });
    results.forEach((r) => {
      summary[r._id] = { count: r.count, totalAmount: r.totalAmount };
    });

    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;