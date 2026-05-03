// Register.jsx — sign-up form
// Register.jsx — form đăng ký
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Register() {
  const { register } = useAuthStore();
  const navigate     = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(firstName, lastName, email, password);
      navigate('/'); // auto-login redirects to home / tự đăng nhập rồi chuyển về trang chủ
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-display text-4xl tracking-widest text-brand-ink">
            SPORT<span className="text-brand-purple">GEAR</span>
          </span>
          <p className="font-sketch text-brand-purple text-xl mt-1">Join the team ✦</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border-2 border-brand-ink p-8 flex flex-col gap-5"
        >
          <h1 className="font-display text-3xl text-brand-ink">CREATE ACCOUNT</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="John"
                className="border-2 border-brand-ink/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Doe"
                className="border-2 border-brand-ink/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple transition-colors"
              />
            </div>
          </div>

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

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 6 characters"
              minLength={6}
              className="border-2 border-brand-ink/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-4 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

          <p className="text-center text-sm text-brand-ink/50">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-purple hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
