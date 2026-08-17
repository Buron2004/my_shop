import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, UserPlus, Repeat } from 'lucide-react';
import {
  getSalesAnalytics,
  getProductPerformance,
  getCustomerAnalytics,
  getPaymentAnalytics,
} from '../../api/myBackendApi';
import StatusBadge from '../../components/StatusBadge';
import { SkeletonCard, SkeletonLine } from '../../components/Skeleton';
import ErrorState from '../../components/ErrorState';

function AdminAnalytics() {
  const [sales, setSales] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState(null);
  const [payments, setPayments] = useState(null);
  const [sortKey, setSortKey] = useState('revenue');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAll() {
      try {
        const [salesData, productsData, customersData, paymentsData] = await Promise.all([
          getSalesAnalytics(),
          getProductPerformance(),
          getCustomerAnalytics(),
          getPaymentAnalytics(),
        ]);
        setSales(salesData);
        setProducts(productsData);
        setCustomers(customersData);
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

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

  const sortedProducts = [...products].sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Business performance at a glance</p>
      </div>

      {/* Sales Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
            <TrendingUp size={14} /> Average Order Value
          </div>
          <p className="text-2xl font-bold text-gray-900">${sales.averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sales by Category</h3>
          <div className="space-y-2">
            {sales.salesByCategory.map((c) => (
              <div key={c._id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{c._id}</span>
                <span className="font-semibold text-gray-900">${c.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Best-Selling Products</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={sales.bestSellers}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
            <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Product Performance</h3>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600"
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="unitsSold">Sort by Units Sold</option>
            <option value="orders">Sort by Orders</option>
          </select>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden divide-y divide-gray-100">
          {sortedProducts.map((p) => (
            <div key={p._id} className="p-4">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-gray-900 text-sm">{p._id}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ml-2 ${
                  p.performance === 'High' ? 'bg-green-100 text-green-700' :
                  p.performance === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {p.performance}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{p.category}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{p.unitsSold} units · {p.orders} orders</span>
                <span className="font-semibold text-gray-900">${p.revenue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 w-[28%] border-r border-gray-200 bg-gray-50">Product</th>
                <th className="px-5 py-3 w-[16%] border-r border-gray-200 bg-gray-50">Category</th>
                <th className="px-5 py-3 w-[14%] border-r border-gray-200 bg-gray-50">Units Sold</th>
                <th className="px-5 py-3 w-[16%] border-r border-gray-200 bg-gray-50">Revenue</th>
                <th className="px-5 py-3 w-[12%] border-r border-gray-200 bg-gray-50">Orders</th>
                <th className="px-5 py-3 w-[14%] bg-gray-50">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedProducts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3 font-medium text-gray-900">{p._id}</td>
                  <td className="px-5 py-3 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3 text-gray-700">{p.unitsSold}</td>
                  <td className="px-5 py-3 text-gray-900 font-semibold">${p.revenue.toFixed(2)}</td>
                  <td className="px-5 py-3 text-gray-700">{p.orders}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.performance === 'High' ? 'bg-green-100 text-green-700' :
                      p.performance === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      {p.performance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
            <UserPlus size={14} /> New Customers
          </div>
          <p className="text-2xl font-bold text-gray-900">{customers.newCustomers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
            <Repeat size={14} /> Returning Customers
          </div>
          <p className="text-2xl font-bold text-gray-900">{customers.returningCustomers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
            <Users size={14} /> Total Tracked
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {customers.newCustomers + customers.returningCustomers}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Top Customers</h3>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden divide-y divide-gray-100">
          {customers.topCustomers.map((c, i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <div>
                <div className="text-gray-900 font-medium text-sm">{c.name}</div>
                <div className="text-gray-400 text-xs">{c.email}</div>
                <div className="text-gray-400 text-xs mt-0.5">{c.orderCount} orders</div>
              </div>
              <span className="font-semibold text-gray-900 text-sm">${c.totalSpent.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 w-1/3 border-r border-gray-200 bg-gray-50">Customer</th>
                <th className="px-5 py-3 w-1/3 border-r border-gray-200 bg-gray-50">Orders</th>
                <th className="px-5 py-3 w-1/3 bg-gray-50">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.topCustomers.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3 border-r border-gray-100">
                    <div className="text-gray-900 font-medium">{c.name}</div>
                    <div className="text-gray-400 text-xs">{c.email}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700 border-r border-gray-100">{c.orderCount}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">${c.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Analytics */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Payment Summary</h3>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden divide-y divide-gray-100">
          {Object.entries(payments).map(([status, data]) => (
            <div key={status} className="p-4 flex justify-between items-center">
              <StatusBadge status={status} />
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">${data.totalAmount.toFixed(2)}</div>
                <div className="text-xs text-gray-400">{data.count} orders</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 w-1/3 border-r border-gray-200 bg-gray-50">Status</th>
                <th className="px-5 py-3 w-1/3 border-r border-gray-200 bg-gray-50">Count</th>
                <th className="px-5 py-3 w-1/3 bg-gray-50">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(payments).map(([status, data]) => (
                <tr key={status} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3 border-r border-gray-100">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-5 py-3 text-gray-700 border-r border-gray-100">{data.count}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">${data.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;