import { useState } from 'react';
import { toast } from 'react-toastify';
import StatusBadge from './StatusBadge';
import OrderTimeline from './OrderTimeline';
import { updateOrderStatus } from '../api/myBackendApi';
import CopyButton from './CopyButton';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

function OrderDetailDrawer({ order, onClose, onStatusChanged }) {
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(order._id, newStatus);
      onStatusChanged(updated);
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h2>
            <CopyButton text={order._id} label="order ID" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>

        <div className="mb-6">
          <OrderTimeline status={order.status} />
        </div>

        <div className="mb-6">
          <label className="block text-xs text-gray-500 uppercase mb-1">Update Status</label>
          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updating}
            className="border rounded px-3 py-2 text-sm w-full"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 pb-6 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer</h3>
          <p className="text-sm text-gray-600">{order.user?.name}</p>
          <p className="text-sm text-gray-500">{order.user?.email}</p>
          {order.user?.phone && <p className="text-sm text-gray-500">{order.user.phone}</p>}
        </div>

        <div className="mb-6 pb-6 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h3>
          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
        </div>

        <div className="mb-6 pb-6 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.title} × {item.quantity}</span>
                <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-sm mb-6">
          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span>${(order.shippingCost || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Discount</span>
            <span>-${(order.discount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Payment:</span>
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>
    </div>
  );
}

export default OrderDetailDrawer;