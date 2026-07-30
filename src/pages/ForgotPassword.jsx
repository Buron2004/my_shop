import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/myBackendApi';
import FormError from '../components/FormError';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await requestPasswordReset({ email });
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 rounded p-2.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
          />
          <FormError message={error} />
          {message && <p className="text-green-700 text-sm">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2.5 rounded text-sm font-semibold tracking-wide transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'SEND RESET LINK'}
          </button>
        </form>

        <p className="text-sm mt-6 text-center">
          <Link to="/login" className="text-green-700 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;