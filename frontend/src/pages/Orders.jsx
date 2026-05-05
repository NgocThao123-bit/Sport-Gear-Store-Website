// Orders.jsx — customer's own order history + detail drawer
// Route: /orders  (requires login via ProtectedRoute)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';

// ── Status badge ──────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-sky-100 text-sky-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-600',
};

const fmt = (date) =>
  new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

// ── Order Detail Drawer ────────────────────────────────────────────────────
function OrderDrawer({ orderId, onClose }) {
  const [detail,  setDetail]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDetail(null);
    setLoading(true);
    orderApi.getById(orderId)
      .then((res) => setDetail(res.data))
      .catch(() => onClose())
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-brand-ink/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg h-full bg-brand-cream border-l-2 border-brand-ink flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-brand-ink flex-shrink-0">
          <div>
            <h2 className="font-display text-2xl text-brand-ink tracking-widest">ORDER DETAIL</h2>
            {detail && (
              <p className="font-mono text-xs text-brand-purple font-bold mt-0.5">{detail.orderNumber}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-brand-ink hover:bg-brand-ink hover:text-brand-lime transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {detail && (
            <>
              {/* Status + dates + payment */}
              <div className="bg-white rounded-2xl border-2 border-brand-ink p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Status</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[detail.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {detail.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Ordered at</span>
                  <span className="text-sm font-bold text-brand-ink">{fmt(detail.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Payment</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${detail.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {detail.paymentStatus} · {detail.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-white rounded-2xl border-2 border-brand-ink p-5 flex flex-col gap-2">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50 mb-1">Shipping Address</p>
                <p className="text-sm text-brand-ink leading-relaxed">{detail.shippingAddress}</p>
                {detail.notes && (
                  <>
                    <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50 mt-2">Notes</p>
                    <p className="text-sm text-brand-ink/60 italic">{detail.notes}</p>
                  </>
                )}
              </div>

              {/* Items */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">
                  Items ({detail.items?.length})
                </p>
                {detail.items?.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border-2 border-brand-ink p-4 flex gap-4 items-start">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-brand-ink/10"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-brand-ink/10 flex items-center justify-center text-brand-ink/30 text-xs font-bold flex-shrink-0">
                        N/A
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-ink text-sm leading-tight line-clamp-2">{item.productName}</p>
                      {item.variantInfo && (
                        <p className="text-xs text-brand-ink/50 mt-0.5">{item.variantInfo}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-brand-ink/60">
                          {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </span>
                        <span className="font-display text-brand-purple font-bold">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="bg-brand-ink rounded-2xl p-5 flex flex-col gap-2 text-brand-cream">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">Subtotal</span>
                  <span className="font-bold">${detail.subTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">Shipping</span>
                  <span className="font-bold">
                    {detail.shippingFee === 0
                      ? <span className="text-brand-lime">FREE</span>
                      : `$${detail.shippingFee?.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-brand-cream/20 pt-2 mt-1 flex justify-between">
                  <span className="font-display tracking-widest text-sm">TOTAL</span>
                  <span className="font-display text-brand-lime text-lg">${detail.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Order summary card ─────────────────────────────────────────────────────
function OrderCard({ order, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-3xl border-2 border-brand-ink hover:border-brand-purple hover:-translate-y-0.5 transition-all text-left flex gap-5 p-5 group"
    >
      {/* First item image */}
      <div className="flex-shrink-0 relative">
        {order.firstItemImageUrl ? (
          <img
            src={order.firstItemImageUrl}
            alt={order.firstItemName}
            className="w-24 h-24 object-cover rounded-2xl border border-brand-ink/10"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-brand-ink/10 flex items-center justify-center text-3xl">
            🏅
          </div>
        )}
        {order.itemCount > 1 && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            +{order.itemCount - 1}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-brand-purple font-bold">{order.orderNumber}</p>
            <p className="text-xs text-brand-ink/40 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </p>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {order.status}
          </span>
        </div>

        {order.firstItemName && (
          <p className="text-sm font-bold text-brand-ink line-clamp-1">{order.firstItemName}
            {order.itemCount > 1 && <span className="font-normal text-brand-ink/40"> +{order.itemCount - 1} more</span>}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-brand-ink/50 font-bold">
            {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-display text-brand-purple text-lg">${order.totalAmount?.toFixed(2)}</span>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-purple/0 group-hover:text-brand-purple transition-colors">
              View →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

export default function MyOrders() {
  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalCount,  setTotalCount]  = useState(0);
  const [drawerOrderId, setDrawerOrderId] = useState(null);

  const load = (pageNumber = page) => {
    setLoading(true);
    orderApi.getMyOrders({ pageNumber, pageSize: PAGE_SIZE })
      .then((res) => {
        const data = res.data;
        setOrders(data.items ?? data);
        setTotalPages(data.totalPages ?? 1);
        setTotalCount(data.totalCount ?? 0);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-6xl text-brand-ink">
            MY <span className="text-brand-purple">ORDERS</span>
          </h1>
          {!loading && (
            <p className="text-brand-ink/50 text-sm mt-2">
              {totalCount === 0
                ? 'No orders yet'
                : `${totalCount} order${totalCount !== 1 ? 's' : ''} total`}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <span className="text-8xl">🛍️</span>
            <div>
              <p className="font-display text-3xl text-brand-ink mb-2">NO ORDERS YET</p>
              <p className="text-brand-ink/50 text-sm">Looks like you haven't placed any orders.</p>
            </div>
            <Link
              to="/products"
              className="px-8 py-3 bg-brand-lime text-brand-ink font-display tracking-widest text-sm rounded-full border-2 border-brand-ink hover:bg-brand-purple hover:text-white transition-colors"
            >
              START SHOPPING
            </Link>
          </div>
        )}

        {/* Order cards */}
        {!loading && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setDrawerOrderId(order.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
              className="px-4 py-2 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors">
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…');
                acc.push(n); return acc;
              }, [])
              .map((n, idx) => n === '…'
                ? <span key={`e${idx}`} className="px-2 text-brand-ink/40">…</span>
                : <button key={n} onClick={() => setPage(n)}
                    className={`px-4 py-2 text-xs font-bold border-2 rounded-xl transition-colors
                      ${n === page ? 'bg-brand-ink text-brand-lime border-brand-ink' : 'border-brand-ink hover:bg-brand-ink hover:text-brand-lime'}`}>
                    {n}
                  </button>
              )}
            <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
              className="px-4 py-2 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors">
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {drawerOrderId && (
        <OrderDrawer
          orderId={drawerOrderId}
          onClose={() => setDrawerOrderId(null)}
        />
      )}
    </div>
  );
}
