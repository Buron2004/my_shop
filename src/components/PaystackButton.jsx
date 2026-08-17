import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../context/AuthContext';

function PaystackButton({ amount, orderId, onSuccess, onClose, disabled }) {
  const { user } = useAuth();

  const config = {
    reference: `order_${orderId}_${Date.now()}`,
    email: user?.email,
    amount: Math.round(amount * 100), // Paystack expects kobo, not naira
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => initializePayment({ onSuccess, onClose })}
      className="bg-green-600 hover:bg-green-700 text-white w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
    >
      Pay with Paystack
    </button>
  );
}

export default PaystackButton;