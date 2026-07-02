// Navbar.jsx — minimal editorial nav (NEOGEN / Sport-Zine style)
// Logo left | Category links center | Cart + Auth right
// Font: Space Grotesk (font-sketch) for all labels — geometric utility layer
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

function AnimatedNavLink({ to, active, children, onClick }) {
  return (
    <motion.div className="relative inline-block" initial="rest" whileHover="hover">
      <Link
        to={to}
        onClick={onClick}
        className={`font-sketch text-[11px] font-bold tracking-[0.22em] uppercase transition-colors ${
          active ? 'text-brand-ink' : 'text-brand-ink/40 hover:text-brand-ink'
        }`}
      >
        {children}
      </Link>
      <motion.span
        className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-brand-ink origin-left block"
        variants={{
          rest:  { scaleX: 0 },
          hover: { scaleX: 1, transition: { duration: 0.22, ease: 'easeOut' } },
        }}
      />
    </motion.div>
  );
}

export default function Navbar() {
  const { user, logout }        = useAuthStore();
  const itemCount               = useCartStore((s) => s.itemCount());
  const navigate                = useNavigate();
  const { pathname, search }    = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  // Highlights the category link whose query param matches the current URL
  const activeCat = new URLSearchParams(search).get('category');
  const catClass  = (cat) =>
    `font-sketch text-[11px] font-bold tracking-[0.22em] uppercase transition-colors ${
      activeCat === cat
        ? 'text-brand-ink'
        : 'text-brand-ink/40 hover:text-brand-ink'
    }`;
  const linkCls = 'font-sketch text-[11px] font-bold tracking-[0.22em] uppercase transition-colors text-brand-ink/40 hover:text-brand-ink';

  return (
    <nav className="sticky top-0 z-50 bg-brand-cream/96 backdrop-blur-sm border-b border-brand-outline/25">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-[72px]">

          {/* ── Logo ────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            {/* Zigzag / wave mark */}
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" className="text-brand-ink">
              <path
                d="M1 9 L5 2 L11 16 L17 2 L21 9"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-display text-[17px] font-black tracking-[0.18em] text-brand-ink leading-none">
              SPORTGEAR
            </span>
          </Link>

          {/* ── Desktop center: category links ──────────────── */}
          <div className="hidden md:flex items-center gap-12">
            <AnimatedNavLink to="/products?category=clothing"  active={activeCat === 'clothing'}>Clothing</AnimatedNavLink>
            <AnimatedNavLink to="/products?category=footwear"  active={activeCat === 'footwear'}>Footwear</AnimatedNavLink>
            <AnimatedNavLink to="/products?category=equipment" active={activeCat === 'equipment'}>Equipment</AnimatedNavLink>
            {user?.isAdmin && (
              <AnimatedNavLink to="/admin" active={pathname.startsWith('/admin')}>Admin</AnimatedNavLink>
            )}
          </div>

          {/* ── Desktop right: Cart + Auth ───────────────────── */}
          <div className="hidden md:flex items-center gap-7">

            {/* Cart */}
            <Link to="/cart" className={linkCls + ' flex items-center gap-1.5'}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="ml-0.5 text-brand-purple">({itemCount})</span>
              )}
            </Link>

            {/* Auth state */}
            {user ? (
              <div className="flex items-center gap-5">
                {!user.isAdmin && (
                  <Link to="/orders" className={linkCls}>Orders</Link>
                )}
                <Link to="/profile" className={linkCls}>
                  {user.email.split('@')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-sketch text-[11px] font-bold tracking-[0.22em] uppercase text-brand-ink/25 hover:text-brand-danger transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link to="/login"    className={linkCls}>Login</Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-brand-ink text-brand-cream font-sketch text-[11px] font-bold tracking-[0.18em] uppercase rounded-full hover:bg-brand-purple transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────── */}
          <button
            className="md:hidden p-2 text-brand-ink"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-brand-cream border-t border-brand-outline/20 px-6 py-6 flex flex-col gap-5">
          <Link to="/products?category=clothing"  className={catClass('clothing')}  onClick={() => setMenuOpen(false)}>Clothing</Link>
          <Link to="/products?category=footwear"  className={catClass('footwear')}  onClick={() => setMenuOpen(false)}>Footwear</Link>
          <Link to="/products?category=equipment" className={catClass('equipment')} onClick={() => setMenuOpen(false)}>Equipment</Link>
          <Link to="/cart" className={linkCls} onClick={() => setMenuOpen(false)}>
            Cart{itemCount > 0 ? ` (${itemCount})` : ''}
          </Link>
          {user && !user.isAdmin && (
            <Link to="/orders"  className={linkCls} onClick={() => setMenuOpen(false)}>My Orders</Link>
          )}
          {user && (
            <Link to="/profile" className={linkCls} onClick={() => setMenuOpen(false)}>Profile</Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin"   className={linkCls} onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="font-sketch text-[11px] font-bold tracking-[0.22em] uppercase text-left text-brand-danger">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login"    className={linkCls} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className={linkCls} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
