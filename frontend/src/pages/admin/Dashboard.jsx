// admin/Dashboard.jsx — admin overview page with live stats
// admin/Dashboard.jsx — trang tổng quan admin với thống kê thực
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { orderApi }   from '../../api/orderApi';
import useAuthStore   from '../../store/useAuthStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      productApi.getAll({ pageSize: 100 }).catch(() => null),
      orderApi.adminGetAll({ pageSize: 100 }).catch(() => null),
    ]).then(([prodRes, orderRes]) => {
      const products = prodRes?.data?.totalCount ?? prodRes?.data?.items?.length ?? 0;
      const orders   = orderRes?.data?.items ?? [];
      const revenue  = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
      const pending  = orders.filter((o) => o.status === 'Pending').length;
      setStats({ products, orders: orders.length, revenue, pending });
    });
  }, []);

  const STAT_CARDS = [
    { label: 'Total Products', value: stats.products,            bg: 'bg-brand-lime',        text: 'text-brand-ink' },
    { label: 'Total Orders',   value: stats.orders,              bg: 'bg-brand-ink',         text: 'text-brand-lime' },
    { label: 'Revenue',        value: `$${stats.revenue.toFixed(2)}`, bg: 'bg-brand-purple', text: 'text-white' },
    { label: 'Pending',        value: stats.pending,             bg: 'bg-yellow-100',        text: 'text-yellow-700' },
  ];

  const NAV_CARDS = [
    { label: 'Manage Products', to: '/admin/products', icon: '📦', bg: 'bg-brand-lime',            text: 'text-brand-ink' },
    { label: 'Manage Orders',   to: '/admin/orders',   icon: '📋', bg: 'bg-brand-purple text-white', text: 'text-white' },
  ];

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Heading */}
        <h1 className="font-display text-6xl text-brand-ink mb-1">
          ADMIN <span className="text-brand-purple">PANEL</span>
        </h1>
        <p className="font-sketch text-brand-purple text-xl mb-10">
          Welcome back, {user?.email?.split('@')[0]} ✦
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className={`${s.bg} ${s.text} rounded-2xl border-2 border-brand-ink p-5`}>
              <p className="font-display text-3xl tracking-wide">{s.value}</p>
              <p className="text-xs font-bold tracking-widest uppercase opacity-70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {NAV_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`${card.bg} rounded-3xl border-2 border-brand-ink p-10 flex flex-col gap-4 hover:scale-[1.02] transition-transform`}
            >
              <span className="text-5xl">{card.icon}</span>
              <span className={`font-display text-3xl tracking-widest ${card.text}`}>
                {card.label.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
