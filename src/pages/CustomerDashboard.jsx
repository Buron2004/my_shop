import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { getMyOrders, getMyOrderById } from '../api/myBackendApi';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';
import SummaryCard from '../components/SummaryCard';
import StatusBadge from '../components/StatusBadge';
import OrderTimeline from '../components/OrderTimeline';
import CopyButton from '../components/CopyButton';
import { SkeletonCard, SkeletonLine } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

const STATUS_FILTERS = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

function CustomerDashboard() {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    async function loadOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Please log in to view your orders.</p>
      </div>
    );
  }

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

  const counts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  let filteredOrders = orders;
  if (statusFilter) {
    filteredOrders = filteredOrders.filter((o) => o.status === statusFilter);
  }
  if (search) {
    filteredOrders = filteredOrders.filter((o) =>
      o._id.toLowerCase().includes(search.toLowerCase())
    );
  }

  async function openOrder(id) {
    try {
      const order = await getMyOrderById(id);
      setSelectedOrder(order);
    } catch (err) {
      toast.error(err.message);
    }
  }

  function handleReorder(order) {
    order.items.forEach((item) => {
      addToCart({
        _id: item.product,
        title: item.title,
        price: item.price,
        image: item.image || '',
      });
    });
    toast.success('Items added to your cart');
    navigate('/cart');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your purchases</p>
        </div>
        <Link to="/" className="text-sm text-green-700 hover:underline font-medium">
          ← Back to Store
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 [&>*]:min-w-0">
        <SummaryCard label="Total Orders" value={counts.total} icon={Package} color="indigo" />
        <SummaryCard label="Pending" value={counts.pending} icon={Clock} color="amber" />
        <SummaryCard label="Shipped" value={counts.shipped} icon={Truck} color="blue" />
        <SummaryCard label="Delivered" value={counts.delivered} icon={CheckCircle} color="green" />
        <SummaryCard label="Cancelled" value={counts.cancelled} icon={XCircle} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID..."
          className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-600"
        >
          <option value="">All statuses</option>
          {STATUS_FILTERS.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

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
          <table className="w-full text-sm table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 w-1/5 border-r border-gray-200 bg-gray-50">Order</th>
                <th className="px-5 py-3 w-1/4 border-r border-gray-200 bg-gray-50">Product(s)</th>
                <th className="px-5 py-3 w-[12%] border-r border-gray-200 bg-gray-50">Total</th>
                <th className="px-5 py-3 w-[15%] border-r border-gray-200 bg-gray-50">Status</th>
                <th className="px-5 py-3 w-[15%] border-r border-gray-200 bg-gray-50">Date</th>
                <th className="px-5 py-3 w-[13%] bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-gray-400 text-sm">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500 border-r border-gray-100">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 text-gray-700 border-r border-gray-100 truncate">
                      {order.items.map((i) => i.title).join(', ')}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900 border-r border-gray-100">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 border-r border-gray-100">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 text-gray-500 border-r border-gray-100">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openOrder(order._id)}
                          className="text-green-700 hover:underline text-sm font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleReorder(order)}
                          className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                        >
                          Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h2>
                <CopyButton text={selectedOrder._id} label="order ID" />
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 text-xl">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <OrderTimeline status={selectedOrder.status} />
            </div>

            <div className="mb-6 pb-6 border-b">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
            </div>

            <div className="mb-6 pb-6 border-b">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.title} × {item.quantity}</span>
                    <span className="text-gray-900 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between font-bold text-gray-900 text-base mb-6">
              <span>Total</span>
              <span>${selectedOrder.total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => handleReorder(selectedOrder)}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Reorder These Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;