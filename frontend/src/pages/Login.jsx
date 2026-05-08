// Login.jsx — Zine "Back In The Game" Sign In
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import athleteBasketball from '../assets/images/athletes/basketball-player.png';
import frame1            from '../assets/images/frame2.png';
import stkShining        from '../assets/images/stickers/shining.png';
import stkStar           from '../assets/images/stickers/star.png';

const BLUE = '#a8dcff';

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

export default function Login() {
  const { login }  = useAuthStore();
  const navigate   = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* ── MAIN CONTENT ── */}
      <form onSubmit={handleSubmit} className="relative z-30 flex flex-col items-center px-4 pt-20 pb-0 min-h-screen">

        {/* ── FORM BOX — frame1.png ── */}
        <motion.div
          className="relative w-full max-w-4xl"
          style={{ transformOrigin: 'left center' }}
          initial={{ opacity: 0, y: 40, rotate: -5 }}
          animate={{ opacity: 1, y: 40, rotate: -5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Frame image */}
          <img src={frame1} alt="" className="w-full h-auto select-none pointer-events-none" draggable={false} />

          {/* Sticker star — góc phải trên */}
          <img
            src={stkStar}
            alt=""
            className="absolute top-4 -right-[6.5rem] w-32 h-32 object-contain pointer-events-none select-none"
            style={{ transform: 'rotate(15deg)', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.15))' }}
            draggable={false}
          />

          {/* Inputs overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-[10%] py-[8%]">
            {error && (
              <p className="font-sketch text-red-500 mb-3 text-sm">{error}</p>
            )}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <ZineInput
                label="Who are you?"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
              <ZineInput
                label="The secret code"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

        </motion.div>

        {/* ── BACK IN THE GAME ── */}
        <motion.div
          className="w-full mt-4 relative z-10 overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {/* Athlete — góc trái chữ BACK IN THE GAME */}
          <div className="absolute -top-80 left-16 w-[32rem] z-0 pointer-events-none select-none">
            <img
              src={athleteBasketball}
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
              WebkitTextStroke: `7px ${BLUE}`,
              paintOrder: 'stroke fill',
              transform: 'rotate(-5deg) scaleY(1.4)',
              transformOrigin: 'left center',
            }}
          >
            BACK IN THE GAME
          </h2>

          {/* SIGN IN button */}
          <div className="relative z-20 flex justify-end pr-[21rem] -mt-36 pb-6">
            <div>
              <motion.button
                type="submit"
                disabled={loading}
                className="block px-24 py-0 text-brand-ink font-display font-black italic uppercase rounded-full border-4 border-brand-ink disabled:opacity-50"
                style={{
                  backgroundColor: BLUE,
                  boxShadow: `8px 8px 0 #1c1b1b`,
                  fontSize: 'clamp(22px, 3vw, 48px)',
                }}
                initial={{ rotate: -5 }}
                animate={{ rotate: -5 }}
                whileHover={{ scale: 1.04, rotate: -5, boxShadow: '10px 10px 0 #1c1b1b' }}
                whileTap={{ scale: 0.97, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </motion.button>
            </div>
          </div>

          <p className="font-note italic text-brand-ink/70 text-2xl text-center mt-4 pb-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-ink underline underline-offset-4 hover:text-brand-purple transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>

      </form>
    </div>
  );
}
