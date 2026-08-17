import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { registerUser, googleLogin } from '../api/myBackendApi';
import { useAuth } from '../context/AuthContext';
import FormError from '../components/FormError';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordsMatch = confirmPassword === '' || password === confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ name, email, password });
      toast.success('Account created! Check your email for a verification code.');
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(err.message);
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
        {/* Brand panel */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-teal-500 to-green-600 text-white p-10">
          <p className="text-xs uppercase tracking-widest mb-3 text-white/80">Join us</p>
          <h2 className="text-3xl font-bold mb-4 leading-tight">Create an Account</h2>
          <p className="text-sm text-white/85 max-w-xs">
            Sign up to start shopping, save your favorites, and check out faster next time.
          </p>
        </div>

        {/* Form panel */}
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Register</h2>
          <p className="text-sm text-gray-500 mb-6">Let's get you set up</p>

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="border border-gray-300 rounded p-2.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
            />
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

            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={`border rounded p-2.5 w-full pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-green-600 ${
                    !passwordsMatch ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
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
              {loading ? 'Creating account...' : 'REGISTER'}
            </button>
          </form>

          <p className="text-sm mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;