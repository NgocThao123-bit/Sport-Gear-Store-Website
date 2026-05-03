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

  const load = () => {
    setLoading(true);
    orderApi.adminGetAll({ pageSize: 50 })
      .then((res) => setOrders(res.data.items ?? res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await orderApi.updateStatus(orderId, newStatus);
    load();
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-5xl text-brand-ink mb-8">
          ORDERS <span className="text-brand-purple">ADMIN</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-brand-ink overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-ink text-brand-lime">
                <tr>
                  <th className="text-left px-6 py-4 font-display tracking-widest">ORDER ID</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">CUSTOMER</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">TOTAL</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={order.id} className={i % 2 === 0 ? 'bg-brand-cream/30' : ''}>
                    <td className="px-6 py-4 font-mono text-xs text-brand-ink/60">
                      #{order.id?.toString().slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-ink">{order.customerEmail}</td>
                    <td className="px-6 py-4 text-brand-purple font-display">
                      ${order.totalAmount?.toFixed(2)}
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
            {orders.length === 0 && (
              <p className="text-center py-10 text-brand-ink/40 font-display text-xl">NO ORDERS YET</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
