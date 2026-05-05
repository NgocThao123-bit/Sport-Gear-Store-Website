// Navbar.jsx — sticky top navigation bar
// Navbar.jsx — thanh điều hướng cố định trên cùng
//
// WHAT IT DOES / CHỨC NĂNG:
// - Shows logo + nav links + cart badge + auth buttons
// - Hiển thị logo + link điều hướng + badge giỏ hàng + nút đăng nhập
//
// HOW IT READS GLOBAL STATE / CÁCH ĐỌC STATE TOÀN CỤC:
// We call useAuthStore() and useCartStore() — Zustand hooks.
// They return the current state + actions without any Provider wrapper.
// Chúng ta gọi useAuthStore() và useCartStore() — Zustand hooks.
// Chúng trả về state hiện tại + actions mà không cần Provider wrapper.
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

export default function Navbar() {
  const { user, logout }    = useAuthStore();
  const itemCount           = useCartStore((s) => s.itemCount());
  const navigate            = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // logout then redirect to home
  // Đăng xuất rồi chuyển về trang chủ
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // NavLink className helper — active link gets lime underline
  // Hàm helper cho NavLink — link đang active sẽ có gạch chân màu lime
  const linkClass = ({ isActive }) =>
    `text-sm font-bold tracking-widest uppercase transition-colors ${
      isActive ? 'text-brand-lime' : 'text-brand-ink hover:text-brand-purple'
    }`;

  return (
    // sticky — stays at top while scrolling
    // backdrop-blur — frosted glass effect when content scrolls behind it
    // sticky — giữ nguyên vị trí khi cuộn
    // backdrop-blur — hiệu ứng kính mờ khi nội dung cuộn phía sau
    <nav className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b-2 border-brand-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ───────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2">
            {/* Colored dot accent / Dấu chấm màu accent */}
            <span className="w-3 h-3 rounded-full bg-brand-lime inline-block" />
            <span className="font-display text-2xl tracking-widest text-brand-ink">
              SPORT<span className="text-brand-purple">GEAR</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ──────────────────────────────── */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/"         className={linkClass} end>Home</NavLink>
            <NavLink to="/products" className={linkClass}>Shop</NavLink>
            {/* My Orders — only for logged-in customers (not admin) */}
            {user && !user.isAdmin && (
              <NavLink to="/orders" className={linkClass}>My Orders</NavLink>
            )}
            {/* Show admin link only when logged-in user is Admin */}
            {user?.isAdmin && (
              <NavLink to="/admin" className={linkClass}>Admin</NavLink>
            )}
          </div>

          {/* ── Right Side: Cart + Auth ────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">

            {/* Cart icon with item count badge */}
            {/* Icon giỏ hàng với badge số lượng sản phẩm */}
            <Link to="/cart" className="relative p-2 text-brand-ink hover:text-brand-purple transition-colors">
              {/* Simple bag SVG icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* Badge — only shown when cart has items */}
              {/* Badge — chỉ hiển thị khi giỏ hàng có sản phẩm */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-purple text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth: show username + logout OR sign-in button */}
            {/* Auth: hiển thị tên người dùng + đăng xuất HOẶC nút đăng nhập */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="text-xs font-bold text-brand-ink/60 tracking-wide hover:text-brand-purple transition-colors"
                >
                  {user.email.split('@')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-bold tracking-widest uppercase bg-brand-ink text-brand-cream rounded-full hover:bg-brand-purple transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-brand-ink hover:text-brand-purple transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold tracking-widest uppercase bg-brand-lime text-brand-ink rounded-full hover:bg-brand-purple hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger ───────────────────────────────── */}
          {/* Only visible on small screens (md:hidden) */}
          {/* Chỉ hiển thị trên màn hình nhỏ */}
          <button
            className="md:hidden p-2 text-brand-ink"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-brand-cream border-t-2 border-brand-ink px-4 pb-4 flex flex-col gap-4">
          <NavLink to="/"         className={linkClass} end   onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" className={linkClass}       onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/cart"     className={linkClass}       onClick={() => setMenuOpen(false)}>
            Cart {itemCount > 0 && <span className="ml-1 text-brand-purple">({itemCount})</span>}
          </NavLink>
          {user && !user.isAdmin && (
            <NavLink to="/orders" className={linkClass}       onClick={() => setMenuOpen(false)}>My Orders</NavLink>
          )}
          {user?.isAdmin && (
            <NavLink to="/admin" className={linkClass}        onClick={() => setMenuOpen(false)}>Admin</NavLink>
          )}
          {user && (
            <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left text-sm font-bold tracking-widest uppercase text-red-500">
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login"    className={linkClass}   onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={linkClass}   onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
