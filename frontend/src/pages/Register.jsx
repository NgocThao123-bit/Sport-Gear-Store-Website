// Register.jsx — Zine Movement Sign Up
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import athletePoleVaulter from '../assets/images/athletes/pole-vaulter.png';
import frame1           from '../assets/images/frame1.png';
import stkEmoji         from '../assets/images/stickers/emoji.png';
import stkShining       from '../assets/images/stickers/shining.png';

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`;

function ZineInput({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-note italic font-bold text-2xl text-brand-ink leading-tight">{label}</label>
      <input
        {...props}
        className="border-b-[2.5px] border-brand-ink px-1 py-2 text-xl font-note focus:outline-none transition-colors"
        style={{ backgroundColor: 'transparent' }}
      />
    </div>
  );
}

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
      await register(firstName, lastName || firstName, email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
    >

      {/* ── MAIN CONTENT ── */}
      <form onSubmit={handleSubmit} className="relative z-30 flex flex-col items-center px-4 pt-20 pb-0 min-h-screen">

        {/* ── FORM BOX — frame1.png background ── */}
        <motion.div
          className="relative w-full max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Frame image as background */}
          <img src={frame1} alt="" className="w-full h-auto select-none pointer-events-none" draggable={false} />

          {/* Sticker emoji — góc phải trên */}
          <img
            src={stkEmoji}
            alt=""
            className="absolute top-[19rem] -right-[9rem] w-32 h-32 object-contain pointer-events-none select-none"
            style={{ transform: 'rotate(15deg)', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.15))' }}
            draggable={false}
          />

          {/* Inputs overlay — positioned inside the frame */}
          <div className="absolute inset-0 flex flex-col justify-center px-[10%] py-[8%]">
            {error && (
              <p className="font-sketch text-red-500 mb-3 text-sm">{error}</p>
            )}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <ZineInput
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="John"
              />
              <ZineInput
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
              <ZineInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
              <ZineInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
              />
            </div>
          </div>
        </motion.div>

        {/* ── JOIN THE MOVEMENT ── */}
        <motion.div
          className="w-full mt-4 relative z-10 overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {/* Athlete — góc trái chữ JOIN */}
          <div className="absolute -top-80 left-16 w-[32rem] z-0 pointer-events-none select-none">
            <img
              src={athletePoleVaulter}
              alt=""
              className="w-full h-auto object-contain"
              style={{ mixBlendMode: 'multiply' }}
              draggable={false}
            />
          </div>

          <h2
            className="relative z-10 font-display font-black italic uppercase text-center leading-none"
            style={{
              fontSize: 'clamp(60px, 8.5vw, 132px)',
              letterSpacing: '-0.02em',
              color: '#1c1b1b',
              WebkitTextStroke: '7px #d4ff32',
              paintOrder: 'stroke fill',
              transform: 'rotate(-5deg) scaleY(1.4)',
              transformOrigin: 'left center',
            }}
          >
            JOIN THE MOVEMENT
          </h2>

          {/* SIGN UP button — bottom right, overlapping text */}
          <div className="relative z-20 flex justify-end pr-[21rem] -mt-36 pb-6">
            <div>
              <motion.button
                type="submit"
                disabled={loading}
                className="block px-24 py-0 bg-brand-lime text-brand-ink font-display font-black italic uppercase rounded-full border-4 border-brand-ink disabled:opacity-50"
                style={{ boxShadow: '8px 8px 0 #1c1b1b', fontSize: 'clamp(22px, 3vw, 48px)' }}
                initial={{ rotate: -5 }}
                animate={{ rotate: -5 }}
                whileHover={{ scale: 1.04, rotate: -5, boxShadow: '10px 10px 0 #1c1b1b' }}
                whileTap={{ scale: 0.97, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              >
                {loading ? 'JOINING...' : 'SIGN UP'}
              </motion.button>
            </div>
          </div>
          <p className="font-note italic text-brand-ink/70 text-2xl text-center mt-4 pb-6">
            Already a member?{' '}
            <Link to="/login" className="text-brand-ink underline underline-offset-4 hover:text-brand-purple transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>

      </form>
    </div>
  );
}
