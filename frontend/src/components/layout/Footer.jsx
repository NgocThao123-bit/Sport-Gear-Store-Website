// Footer.jsx — site footer with brand info + links
// Footer.jsx — phần chân trang với thông tin thương hiệu + links
//
// DESIGN / THIẾT KẾ:
// Dark ink background (#222815) with lime accent — contrasts the cream body
// Nền đen đậm (#222815) với điểm nhấn màu lime — tương phản với nền cream
import { Link } from 'react-router-dom';

// Quick link section data — makes the JSX shorter
// Dữ liệu link nhanh — làm cho JSX gọn hơn
const SHOP_LINKS = [
  { label: 'All Products', to: '/products' },
  { label: 'Football',     to: '/products?category=football' },
  { label: 'Basketball',   to: '/products?category=basketball' },
  { label: 'Volleyball',   to: '/products?category=volleyball' },
  { label: 'Tennis',       to: '/products?category=tennis' },
];

const ACCOUNT_LINKS = [
  { label: 'My Cart',    to: '/cart' },
  { label: 'My Orders',  to: '/orders' },
  { label: 'Login',      to: '/login' },
  { label: 'Register',   to: '/register' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      {/* ── Top section ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          {/* Cột thương hiệu */}
          <div className="md:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-brand-lime inline-block" />
              <span className="font-display text-2xl tracking-widest">
                SPORT<span className="text-brand-purple">GEAR</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Premium sports equipment for athletes who refuse to settle.
              {/* Thiết bị thể thao cao cấp cho những vận động viên không chịu thua kém. */}
            </p>
            {/* Decorative tagline using sketch font */}
            {/* Tagline trang trí dùng font sketch */}
            <p className="font-sketch text-brand-lime text-xl mt-3">
              Play harder. Look better. ✦
            </p>
          </div>

          {/* Shop links column */}
          {/* Cột link cửa hàng */}
          <div>
            <h4 className="font-display text-lg tracking-widest text-brand-lime mb-4">SHOP</h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links column */}
          {/* Cột link tài khoản */}
          <div>
            <h4 className="font-display text-lg tracking-widest text-brand-lime mb-4">ACCOUNT</h4>
            <ul className="space-y-2">
              {ACCOUNT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar — copyright ───────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} SportGear. All rights reserved.
          </p>
          {/* Accent dots decoration / Trang trí chấm màu */}
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-lime" />
            <span className="w-2 h-2 rounded-full bg-brand-purple" />
            <span className="w-2 h-2 rounded-full bg-brand-blue" />
          </div>
        </div>
      </div>
    </footer>
  );
}
