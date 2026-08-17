import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, verifyPayment } from "../api/myBackendApi";
import PaystackButton from "../components/PaystackButton";
import Button from './Button';

function CheckoutForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");

    if (!isLoggedIn) {
      setError("Please log in to place an order.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
      const order = await createOrder({ items: orderItems, total, shippingAddress: address });
      setPlacedOrder(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePaymentSuccess(response) {
    try {
      await verifyPayment(placedOrder._id, response.reference);
      clearCart();
      toast.success('Payment successful!');
      navigate('/order-success');
    } catch (err) {
      toast.error(err.message);
    }
  }

  function handlePaymentClose() {
    toast.info('Payment window closed');
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      <p className="mb-2">You have {cartCount} items in your cart 🛒</p>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 mb-4">Your cart is empty</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {cartItems.map((item) => (
            <li key={item._id} className="flex justify-between items-center border-b pb-2">
              <span>{item.title}</span>
              <span className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="border px-2 disabled:opacity-30"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="border px-2"
                >
                  +
                </button>
                ${(item.price * item.quantity).toFixed(2)}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <p className="font-semibold mb-4">Total: ${total.toFixed(2)}</p>
      )}

      {!placedOrder ? (
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="border p-2 w-full"
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your Address"
            className="border p-2 w-full"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Placing order..." : "Continue to Payment"}
          </Button>
        </form>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3">
            Order created. Complete payment to confirm your order.
          </p>
          <PaystackButton
            amount={placedOrder.total}
            orderId={placedOrder._id}
            onSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
          />
        </div>
      )}
    </div>
  );
}

export default CheckoutForm;