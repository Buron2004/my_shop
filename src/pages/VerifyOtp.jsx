import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../api/myBackendApi';
import { useAuth } from '../context/AuthContext';
import FormError from '../components/FormError';

const RESEND_COOLDOWN = 2 * 60; // 2 minutes before "Resend" becomes clickable

function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const canResend = resendCooldown <= 0;
  const resendMinutes = Math.floor(resendCooldown / 60);
  const resendSeconds = resendCooldown % 60;
  const formattedCooldown = `${resendMinutes}:${resendSeconds.toString().padStart(2, '0')}`;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await verifyOtp({ email, otp });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError('');
    setResendMessage('');
    setResending(true);
    try {
      const data = await resendOtp({ email });
      setResendMessage(data.message);
      setResendCooldown(RESEND_COOLDOWN); // restart the 2-minute cooldown
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  }

  if (!email) {
    return (
      <div className="p-6 max-w-sm mx-auto text-center">
        <p className="text-red-600">No email provided. Please register or log in again.</p>
        <Link to="/register" className="text-green-700 underline text-sm mt-2 inline-block">
          Back to Register
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
      <p className="text-sm text-gray-600 mb-6">
        We sent a 6-digit code to <span className="font-medium">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="border p-2 w-full text-center text-2xl tracking-widest"
        />
        <FormError message={error} />
        {resendMessage && <p className="text-green-700 text-sm">{resendMessage}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <button
        onClick={handleResend}
        disabled={resending || !canResend}
        className="text-sm text-green-700 hover:underline mt-4 disabled:opacity-50 disabled:no-underline disabled:text-gray-400"
      >
        {resending
          ? 'Sending...'
          : canResend
          ? 'Resend code'
          : `Resend available in ${formattedCooldown}`}
      </button>
    </div>
  );
}

export default VerifyOtp;