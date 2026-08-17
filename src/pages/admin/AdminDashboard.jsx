import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import SummaryCard from '../../components/SummaryCard';
import { getAdminSummary, getRevenueTrend, getPaymentBreakdown } from '../../api/myBackendApi';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { SkeletonCard, SkeletonLine } from '../../components/Skeleton';
import ErrorState from '../../components/ErrorState';

const RANGES = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '6mo', label: 'Last 6 months' },
  { value: 'year', label: 'This year' },
];

const PAYMENT_COLORS = { paid: '#16a34a', pending: '#f59e0b', failed: '#dc2626', refunded: '#6366f1' };

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState(null);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSummary() {
      try {
        const [summaryData, breakdownData] = await Promise.all([
          getAdminSummary(),
          getPaymentBreakdown(),
        ]);
        setSummary(summaryData);
        setPaymentBreakdown(breakdownData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  useEffect(() => {
    async function loadTrend() {
      try {
        const data = await getRevenueTrend(range);
        setRevenueTrend(data);
      } catch (err) {
        console.error('Failed to load revenue trend:', err.message);
      }
    }
    loadTrend();
  }, [range]);

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <SkeletonLine className="h-7 w-40 mb-2" />
          <SkeletonLine className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonLine className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const pieData = paymentBreakdown
    ? Object.entries(paymentBreakdown).map(([status, count]) => ({ name: status, value: count }))
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <h2 className="text-lg font-medium text-gray-700 ">Store Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your store's performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 [&>*]:min-w-0">
        <SummaryCard label="Total Revenue" value={`$${summary.totalRevenue.toFixed(2)}`} icon={DollarSign} color="green" trend={summary.trends.revenue} />
        <SummaryCard label="Total Orders" value={summary.totalOrders} icon={ShoppingCart} color="indigo" trend={summary.trends.orders} />
        <SummaryCard label="Total Customers" value={summary.totalCustomers} icon={Users} color="blue" trend={summary.trends.customers} />
        <SummaryCard label="Total Products" value={summary.totalProducts} icon={Package} color="purple" />
        <SummaryCard label="Pending Orders" value={summary.pendingOrders} icon={Clock} color="amber" />
        <SummaryCard label="Delivered Orders" value={summary.completedOrders} icon={CheckCircle} color="green" />
        <SummaryCard label="Cancelled Orders" value={summary.cancelledOrders} icon={XCircle} color="red" />
        <SummaryCard label="Refunded Payments" value={summary.refundedPayments} icon={RotateCcw} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Revenue Trend</h2>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            >
              {RANGES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {revenueTrend.length === 0 ? (
            <p className="text-gray-400 text-sm py-16 text-center">No revenue data for this period</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3, fill: '#16a34a' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-5">Payment Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={0}
                outerRadius={85}
                paddingAngle={0}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={PAYMENT_COLORS[entry.name] || '#9ca3af'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: PAYMENT_COLORS[entry.name] || '#9ca3af' }}
                />
                <span className="text-xs text-gray-600 capitalize">{entry.name}</span>
                <span className="text-xs font-semibold text-gray-900 ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;