import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/myBackendApi';
import FormError from '../components/FormError';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = confirmPassword === '' || newPassword === confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword({ email, token, newPassword });
      setMessage(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!email || !token) {
    return (
      <div className="p-6 max-w-sm mx-auto text-center">
        <p className="text-red-600">Invalid or missing reset link.</p>
        <Link to="/forgot-password" className="text-green-700 underline text-sm mt-2 inline-block">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">Enter a new password for {email}</p>

        {message ? (
          <p className="text-green-700 text-sm">{message} Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="border border-gray-300 rounded p-2.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
            />
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`border rounded p-2.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-green-600 ${
                  !passwordsMatch ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {!passwordsMatch && (
                <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
            <FormError message={error} />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2.5 rounded text-sm font-semibold tracking-wide transition disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'RESET PASSWORD'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;