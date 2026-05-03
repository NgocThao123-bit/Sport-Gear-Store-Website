// Login.jsx — sign-in form
// Login.jsx — form đăng nhập
//
// FORM HANDLING / XỬ LÝ FORM:
// We use React controlled inputs (useState for each field).
// On submit, call useAuthStore's login() action — it handles the API call.
// Chúng ta dùng React controlled inputs (useState cho mỗi trường).
// Khi submit, gọi hành động login() từ useAuthStore — nó xử lý API call.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Login() {
  const { login } = useAuthStore();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent browser page reload / ngăn trình duyệt tải lại
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); // redirect to home after login / chuyển về trang chủ sau khi đăng nhập
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / brand mark */}
        <div className="text-center mb-8">
          <span className="font-display text-4xl tracking-widest text-brand-ink">
            SPORT<span className="text-brand-purple">GEAR</span>
          </span>
          <p className="font-sketch text-brand-purple text-xl mt-1">Welcome back ✦</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border-2 border-brand-ink p-8 flex flex-col gap-5"
        >
          <h1 className="font-display text-3xl text-brand-ink">SIGN IN</h1>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="border-2 border-brand-ink/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple transition-colors"
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border-2 border-brand-ink/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple transition-colors"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="py-4 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <p className="text-center text-sm text-brand-ink/50">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-purple hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
