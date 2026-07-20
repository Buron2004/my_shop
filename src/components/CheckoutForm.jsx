
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, payForOrder } from "../api/myBackendApi";
import BackButton from "../components/BackButton";

function CheckoutForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | placing | paying
  const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleSubmit(e) {
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

    try {
      setStatus("placing");
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
      const order = await createOrder({ items: orderItems, total, shippingAddress: address });

      setStatus("paying");
      await payForOrder(order._id);

      clearCart();
      navigate("/order-success");
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus("idle");
    }
  }

  const buttonLabel =
    status === "placing" ? "Placing order..." :
    status === "paying" ? "Processing payment..." :
    "Place Order & Pay";

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

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          disabled={status !== "idle"}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;