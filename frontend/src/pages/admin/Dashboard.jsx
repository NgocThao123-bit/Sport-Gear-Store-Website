// admin/Dashboard.jsx — admin overview page
// admin/Dashboard.jsx — trang tổng quan dành cho admin
//
// PROTECTED ROUTE NOTE / GHI CHÚ ROUTE BẢO VỆ:
// This page should only be accessible to admins.
// Later we'll add a ProtectedRoute wrapper to enforce this.
// Trang này chỉ nên truy cập được bởi admin.
// Sau này chúng ta sẽ thêm wrapper ProtectedRoute để bảo vệ.
import { Link } from 'react-router-dom';

const ADMIN_CARDS = [
  { label: 'Manage Products', to: '/admin/products', icon: '📦', bg: 'bg-brand-lime' },
  { label: 'Manage Orders',   to: '/admin/orders',   icon: '📋', bg: 'bg-brand-purple text-white' },
];

export default function AdminDashboard() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-6xl text-brand-ink mb-2">
          ADMIN <span className="text-brand-purple">PANEL</span>
        </h1>
        <p className="font-sketch text-brand-purple text-xl mb-10">Manage your store ✦</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ADMIN_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`${card.bg} rounded-3xl border-2 border-brand-ink p-10 flex flex-col gap-4 hover:scale-[1.02] transition-transform`}
            >
              <span className="text-5xl">{card.icon}</span>
              <span className="font-display text-3xl tracking-widest">{card.label.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
