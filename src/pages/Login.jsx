import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, googleLogin } from '../api/myBackendApi';
import { useAuth } from '../context/AuthContext';
import FormError from '../components/FormError';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data);
      navigate('/');
    } catch (err) {
      if (err.message.includes('verify your email')) {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError('');
    try {
      const data = await googleLogin(credentialResponse.credential);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-teal-500 to-green-600 text-white p-10">
          <p className="text-xs uppercase tracking-widest mb-3 text-white/80">Welcome back</p>
          <h2 className="text-3xl font-bold mb-4 leading-tight">My Shop</h2>
          <p className="text-sm text-white/85 max-w-xs">
            Log in to track orders, save favorites, and pick up right where you left off.
          </p>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Log In</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your details to continue</p>

          <div className="mb-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed')}
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border border-gray-300 rounded p-2.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border border-gray-300 rounded p-2.5 w-full pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-green-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <FormError message={error} />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2.5 rounded text-sm font-semibold tracking-wide transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'LOG IN'}
            </button>
          </form>

          <p className="text-sm mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-700 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;