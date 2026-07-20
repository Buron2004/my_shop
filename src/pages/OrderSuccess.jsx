import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Order placed! 🎉</h2>
      <p className="text-gray-600 mb-4">Thanks for your order — we'll get it ready.</p>
      <Link to="/" className="text-blue-600 underline">Back to shopping</Link>
    </div>
  );
}

export default OrderSuccess;