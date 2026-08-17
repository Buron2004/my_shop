import { useState, useEffect } from 'react';
import { getAdminOrders, getAdminOrderById } from '../../api/myBackendApi';
import StatusBadge from '../../components/StatusBadge';
import OrderDetailDrawer from '../../components/OrderDetailDrawer';
import { SkeletonTableRows } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { Package } from 'lucide-react';

const STATUS_FILTERS = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const PAYMENT_FILTERS = ['', 'pending', 'paid', 'failed', 'refunded'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const params = { search, status, paymentStatus, sort, page, limit: 10, startDate, endDate };
        Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
        const data = await getAdminOrders(params);
        setOrders(data.orders);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [search, status, paymentStatus, sort, page, startDate, endDate]);

  async function openOrder(id) {
    try {
      const order = await getAdminOrderById(id);
      setSelectedOrder(order);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleStatusChanged(updatedOrder) {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? { ...o, status: updatedOrder.status } : o))
    );
    setSelectedOrder((prev) => (prev ? { ...prev, status: updatedOrder.status } : prev));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by customer name or email..."
          className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm flex-1 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        >
          <option value="">All statuses</option>
          {STATUS_FILTERS.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        >
          <option value="">All payments</option>
          {PAYMENT_FILTERS.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="total">Highest total</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        <span className="text-gray-400 text-sm self-center">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        {(startDate || endDate) && (
          <button
            onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }}
            className="text-sm text-gray-400 hover:text-gray-700"
          >
            Clear dates
          </button>
        )}

      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))
        ) : orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders found" message="Try adjusting your search or filters" />
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()}</span>
                <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                  {order.customer?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700">{order.customer?.name}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={order.paymentStatus} />
                <StatusBadge status={order.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button
                  onClick={() => openOrder(order._id)}
                  className="text-green-700 hover:underline text-sm font-medium"
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Order</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Total</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Payment</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Date</th>
                <th className="px-5 py-3.5 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <SkeletonTableRows rows={5} cols={7} />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={Package}
                      title="No orders found"
                      message="Try adjusting your search or filters"
                    />
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-medium text-gray-500">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                          {order.customer?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium">{order.customer?.name}</div>
                          <div className="text-gray-400 text-xs">{order.customer?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-900 font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={order.paymentStatus} /></td>
                    <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openOrder(order._id)}
                        className="text-green-700 hover:text-green-800 hover:underline text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 px-1 text-sm">
          <span className="text-gray-500">
            Showing page <span className="font-medium text-gray-700">{page}</span> of{' '}
            <span className="font-medium text-gray-700">{totalPages}</span>
            <span className="text-gray-400"> · {total} orders total</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border border-gray-200 rounded-lg px-3.5 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border border-gray-200 rounded-lg px-3.5 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChanged={handleStatusChanged}
        />
      )}
    </div>
  );
}

export default AdminOrders;