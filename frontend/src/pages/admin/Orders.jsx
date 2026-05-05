// admin/Orders.jsx — admin order management
// admin/Orders.jsx — quản lý đơn hàng dành cho admin
import { useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi';

// Status badge color mapping / Màu badge trạng thái
const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-brand-blue/20 text-brand-blue',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-600',
};

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  const load = () => {
    setLoading(true);
    orderApi.adminGetAll({ pageSize: 100 })
      .then((res) => setOrders(res.data.items ?? res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      // Optimistically update local state — avoids full reload
      // Cập nhật local state ngay — tránh reload toàn bộ
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      alert('Failed to update status.');
      load();
    }
  };

  const visible = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-5xl text-brand-ink">
              ORDERS <span className="text-brand-purple">ADMIN</span>
            </h1>
            <p className="text-brand-ink/50 text-sm mt-1">{orders.length} orders total</p>
          </div>

          {/* Status filter / Lọc theo trạng thái */}
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border-2 border-brand-ink transition-colors
                ${filter === '' ? 'bg-brand-ink text-brand-lime' : 'bg-transparent text-brand-ink hover:bg-brand-ink hover:text-brand-lime'}`}
            >
              All
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border-2 border-brand-ink transition-colors
                  ${filter === s ? 'bg-brand-ink text-brand-lime' : 'bg-transparent text-brand-ink hover:bg-brand-ink hover:text-brand-lime'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-brand-ink overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-ink text-brand-lime">
                <tr>
                  <th className="text-left px-6 py-4 font-display tracking-widest">ORDER #</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">CUSTOMER</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">TOTAL</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">DATE</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order, i) => (
                  <tr key={order.id} className={i % 2 === 0 ? 'bg-brand-cream/30' : ''}>
                    <td className="px-6 py-4 font-mono text-xs text-brand-purple font-bold">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-ink">{order.customerEmail}</td>
                    <td className="px-6 py-4 text-brand-purple font-display">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-brand-ink/50 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visible.length === 0 && (
              <p className="text-center py-10 text-brand-ink/40 font-display text-xl">
                {filter ? `NO ${filter.toUpperCase()} ORDERS` : 'NO ORDERS YET'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
