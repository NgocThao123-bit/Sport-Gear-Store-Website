// Orders.jsx — MY HISTORY — Zine / Scrapbook editorial redesign
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderApi } from '../api/orderApi';

import stkBasketball   from '../assets/images/stickers/basketball-ball.png';
import stkTennisRacket from '../assets/images/stickers/tennis-racket.png';
import stkBaseball     from '../assets/images/stickers/baseball.png';
import stkStar         from '../assets/images/stickers/star (2).png';
import stkDoodleStar   from '../assets/images/stickers/doodle-star-purple.png';
import stkScribble     from '../assets/images/stickers/scribble (1).png';

// ── Constants ─────────────────────────────────────────────────────────────
const CARD_W    = 300;
const CARD_GAP  = 44;
const STEP      = CARD_W + CARD_GAP;
const PAD_X     = 96;
const PT        = 80;   // container padding-top (px)

const ROTATIONS = [-2, 1.5, -1.5, 2, -1, 2.5, -2.5, 1];
const OFFSETS   = [60, 0, 100, 20, 80, 10, 90, 40];

const STATUS_INFO = {
  Pending:    { label: 'ON THE WAY', bg: '#D8B4FE', color: '#4c1d95' },
  Processing: { label: 'ON THE WAY', bg: '#D8B4FE', color: '#4c1d95' },
  Shipped:    { label: 'ON THE WAY', bg: '#D8B4FE', color: '#4c1d95' },
  Delivered:  { label: 'DELIVERED',  bg: '#bbf7d0', color: '#166534' },
  Cancelled:  { label: 'CANCELLED',  bg: '#fecaca', color: '#991b1b' },
};

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ── SVG wavy dashed connecting line ───────────────────────────────────────
function ConnectingLine({ count }) {
  if (count < 2) return null;

  const svgH  = 560;
  const totalW = PAD_X + count * STEP + PAD_X;

  const pts = Array.from({ length: count }, (_, i) => ({
    x: PAD_X + i * STEP + CARD_W / 2,
    y: PT + OFFSETS[i % OFFSETS.length] + 195,
  }));

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const midX = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${midX},${pts[i - 1].y} ${midX},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none z-0"
      width={totalW} height={svgH}
      viewBox={`0 0 ${totalW} ${svgH}`}
    >
      <path d={d} fill="none" stroke="#1c1b1b" strokeDasharray="14 8"
        strokeWidth="2.5" strokeLinecap="round" opacity={0.2} />
    </svg>
  );
}

// ── Brand sticker label ────────────────────────────────────────────────────
function SportLabel({ text = 'SPORT', rotate = -3, style = {} }) {
  return (
    <div
      className="absolute pointer-events-none select-none font-display font-black uppercase text-brand-ink z-10"
      style={{
        background: '#D8B4FE',
        padding: '5px 14px',
        borderRadius: '4px 18px 4px 18px',
        fontSize: 14,
        letterSpacing: '0.1em',
        transform: `rotate(${rotate}deg)`,
        boxShadow: '3px 3px 0 rgba(0,0,0,0.14)',
        ...style,
      }}
    >
      {text}
    </div>
  );
}

// ── Order Card ─────────────────────────────────────────────────────────────
function OrderCard({ order, index, onClick }) {
  const rot  = ROTATIONS[index % ROTATIONS.length];
  const mt   = OFFSETS[index % OFFSETS.length];
  const si   = STATUS_INFO[order.status] ?? STATUS_INFO.Pending;
  const num  = order.orderNumber?.replace('ORD-', '') ?? order.id?.slice(0, 8).toUpperCase();

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ marginTop: mt }}
      initial={{ opacity: 0, y: 48, rotate: rot - 7 }}
      animate={{ opacity: 1, y: 0, rotate: rot }}
      transition={{ type: 'spring', stiffness: 155, damping: 22, delay: index * 0.1 }}
      whileHover={{
        rotate: 0, scale: 1.06, zIndex: 30,
        transition: { type: 'spring', stiffness: 320, damping: 22 },
      }}
    >
      {/* Floating product image above card */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -50, width: 100, height: 100 }}>
        {order.firstItemImageUrl ? (
          <img
            src={order.firstItemImageUrl}
            alt={order.firstItemName}
            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">🏅</div>
        )}
      </div>

      {/* Card body */}
      <button
        onClick={onClick}
        className="text-left bg-white flex flex-col relative z-10"
        style={{
          width: CARD_W,
          borderRadius: 22,
          paddingTop: 66,
          padding: '66px 22px 24px',
          boxShadow: '7px 7px 24px rgba(0,0,0,0.09), -4px -4px 12px rgba(255,255,255,0.9)',
          border: '1.5px solid rgba(0,0,0,0.05)',
        }}
      >
        {/* Order number */}
        <p className="font-display font-black text-brand-ink uppercase leading-none mb-2"
          style={{ fontSize: 20, letterSpacing: '-0.01em' }}>
          ORDER #{num}
        </p>

        {/* Status tag */}
        <span
          className="inline-block px-3 py-1 font-sketch font-black text-[10px] tracking-widest uppercase mb-3"
          style={{ background: si.bg, color: si.color, borderRadius: 100 }}
        >
          {si.label}
        </span>

        {/* Product name */}
        <p className="font-sans text-xs text-brand-ink/60 uppercase tracking-wide leading-snug line-clamp-2 mb-1">
          {order.firstItemName ?? '—'}
          {order.itemCount > 1 && ` +${order.itemCount - 1}`}
        </p>

        {/* Date */}
        <p className="font-note italic text-brand-ink/35 text-xs mb-3">{fmt(order.createdAt)}</p>

        {/* Price */}
        <p className="font-display font-black mb-4" style={{ fontSize: 22, color: '#7c3aed' }}>
          ${order.totalAmount?.toFixed(2)}
        </p>

        {/* DETAILS button — neumorphism pastel purple */}
        <motion.div
          className="w-full py-2.5 text-center font-sketch font-black text-xs tracking-widest uppercase select-none"
          style={{
            background: '#D8B4FE',
            color: '#4c1d95',
            borderRadius: 100,
            boxShadow: '4px 4px 10px rgba(0,0,0,0.12), -3px -3px 8px rgba(255,255,255,0.92)',
          }}
          whileHover={{ boxShadow: '6px 6px 14px rgba(0,0,0,0.16), -3px -3px 8px rgba(255,255,255,0.92)' }}
          whileTap={{ boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.14), inset -2px -2px 6px rgba(255,255,255,0.7)' }}
        >
          DETAILS
        </motion.div>
      </button>
    </motion.div>
  );
}

// ── Order Detail Drawer ────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-sky-100 text-sky-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-600',
};

function OrderDrawer({ orderId, onClose }) {
  const [detail,  setDetail]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDetail(null); setLoading(true);
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
      <motion.div
        className="w-full max-w-lg h-full bg-brand-cream flex flex-col overflow-hidden"
        style={{ borderLeft: '3px solid #1c1b1b' }}
        initial={{ x: '100%' }} animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-brand-ink flex-shrink-0">
          <div>
            <h2 className="font-display text-2xl text-brand-ink tracking-widest">ORDER DETAIL</h2>
            {detail && <p className="font-mono text-xs font-bold mt-0.5" style={{ color: '#7c3aed' }}>{detail.orderNumber}</p>}
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-brand-ink hover:bg-brand-ink hover:text-brand-lime transition-colors text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D8B4FE', borderTopColor: 'transparent' }} />
            </div>
          )}
          {detail && (
            <>
              <div className="bg-white rounded-2xl border-2 border-brand-ink p-5 flex flex-col gap-3">
                {[
                  ['Status',    <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[detail.status] ?? 'bg-gray-100 text-gray-600'}`}>{detail.status}</span>],
                  ['Ordered',   <span className="text-sm font-bold text-brand-ink">{fmt(detail.createdAt)}</span>],
                  ['Payment',   <span className={`text-xs font-bold px-2 py-1 rounded-full ${detail.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{detail.paymentStatus} · {detail.paymentMethod}</span>],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">{label}</span>
                    {val}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border-2 border-brand-ink p-5 flex flex-col gap-2">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50 mb-1">Shipping Address</p>
                <p className="text-sm text-brand-ink leading-relaxed">{detail.shippingAddress}</p>
                {detail.notes && <>
                  <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50 mt-2">Notes</p>
                  <p className="text-sm text-brand-ink/60 italic">{detail.notes}</p>
                </>}
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Items ({detail.items?.length})</p>
                {detail.items?.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border-2 border-brand-ink p-4 flex gap-4 items-start">
                    {item.productImageUrl
                      ? <img src={item.productImageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-brand-ink/10" />
                      : <div className="w-16 h-16 rounded-xl bg-brand-ink/10 flex items-center justify-center text-brand-ink/30 text-xs font-bold flex-shrink-0">N/A</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-ink text-sm leading-tight line-clamp-2">{item.productName}</p>
                      {item.variantInfo && <p className="text-xs text-brand-ink/50 mt-0.5">{item.variantInfo}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-brand-ink/60">{item.quantity} × ${item.unitPrice.toFixed(2)}</span>
                        <span className="font-display font-bold" style={{ color: '#7c3aed' }}>${item.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-ink rounded-2xl p-5 flex flex-col gap-2 text-brand-cream">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">Subtotal</span>
                  <span className="font-bold">${detail.subTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">Shipping</span>
                  <span className="font-bold">{detail.shippingFee === 0 ? <span className="text-brand-lime">FREE</span> : `$${detail.shippingFee?.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-brand-cream/20 pt-2 mt-1 flex justify-between">
                  <span className="font-display tracking-widest text-sm">TOTAL</span>
                  <span className="font-display text-brand-lime text-lg">${detail.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

export default function MyOrders() {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [totalCount,    setTotalCount]    = useState(0);
  const [drawerOrderId, setDrawerOrderId] = useState(null);

  const load = (p = page) => {
    setLoading(true);
    orderApi.getMyOrders({ pageNumber: p, pageSize: PAGE_SIZE })
      .then((res) => {
        const d = res.data;
        setOrders(d.items ?? d);
        setTotalPages(d.totalPages ?? 1);
        setTotalCount(d.totalCount ?? 0);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const totalW = PAD_X + orders.length * STEP + PAD_X;

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#f0eff0' }}>

      {/* Grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }} />

      {/* ── Background decorative stickers ── */}
      <motion.img src={stkBasketball} alt="" draggable={false}
        className="absolute top-24 left-8 w-28 h-28 object-contain pointer-events-none select-none opacity-40"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} />

      <motion.img src={stkTennisRacket} alt="" draggable={false}
        className="absolute top-16 right-14 w-24 h-24 object-contain pointer-events-none select-none opacity-45"
        style={{ rotate: 20 }}
        animate={{ rotate: [20, 10, 20], y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} />

      <motion.img src={stkBaseball} alt="" draggable={false}
        className="absolute top-12 right-52 w-20 h-20 object-contain pointer-events-none select-none opacity-50"
        animate={{ rotate: [0, 15, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />

      <motion.img src={stkDoodleStar} alt="" draggable={false}
        className="absolute top-8 left-1/4 w-14 h-14 object-contain pointer-events-none select-none opacity-50"
        animate={{ rotate: [0, 25, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />

      <motion.img src={stkStar} alt="" draggable={false}
        className="absolute top-6 right-1/3 w-10 h-10 object-contain pointer-events-none select-none opacity-40"
        animate={{ rotate: [0, 30, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />


      <motion.img src={stkScribble} alt="" draggable={false}
        className="absolute bottom-24 left-10 w-32 h-32 object-contain pointer-events-none select-none opacity-20"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />

      {/* ── HEADER ── */}
      <div className="relative z-10 text-center pt-20 pb-4 px-6">

        {/* "SPORTGEAR" brand label stickers */}
        <SportLabel text="SPORTGEAR" rotate={-4} style={{ top: 72, left: '14%' }} />
        <SportLabel text="SPORT"     rotate={3}  style={{ top: 80, right: '13%', background: '#d4ff32' }} />

        {/* Handwritten annotation */}
        <p className="font-note italic text-brand-ink/30 text-base absolute"
          style={{ top: 120, left: '9%', transform: 'rotate(-5deg)' }}>
          all the gear you copped →
        </p>

        <motion.h1
          className="font-display font-black uppercase text-brand-ink leading-none"
          style={{ fontSize: 'clamp(48px, 8vw, 110px)', letterSpacing: '-0.04em' }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          MY HISTORY
        </motion.h1>

        {/* Thick marker underline */}
        <motion.div
          className="mx-auto mt-3 rounded-full"
          style={{ height: 7, background: '#1c1b1b', width: 'clamp(260px, 52%, 760px)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {!loading && (
          <p className="font-note italic text-brand-ink/40 text-xl mt-4">
            {totalCount === 0 ? 'no orders yet...' : `${totalCount} order${totalCount !== 1 ? 's' : ''} placed`}
          </p>
        )}
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex justify-center py-32 relative z-10">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#D8B4FE', borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && orders.length === 0 && (
        <div className="relative z-10 flex flex-col items-center gap-6 py-28 text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <img src={stkBasketball} alt="" className="w-32 h-32 object-contain opacity-40" draggable={false} />
          </motion.div>
          <p className="font-display font-black uppercase text-brand-ink"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-0.03em', color: 'rgba(28,27,27,0.15)' }}>
            NO HISTORY YET
          </p>
          <p className="font-note italic text-brand-ink/35 text-xl">Time to write your first chapter.</p>
          <Link to="/products"
            className="px-10 py-4 font-sketch font-bold text-xs tracking-widest uppercase rounded-full text-brand-ink border-2 border-brand-ink hover:bg-brand-ink hover:text-brand-lime transition-colors">
            START SHOPPING →
          </Link>
        </div>
      )}

      {/* ── SCRAPBOOK TIMELINE ── */}
      {!loading && orders.length > 0 && (
        <div className="relative z-10 overflow-x-auto pb-28" style={{ minHeight: 560 }}>

          {/* Wavy dashed connecting line */}
          <ConnectingLine count={orders.length} />

          {/* Cards row */}
          <div className="flex items-start justify-center relative z-10"
            style={{ paddingTop: PT, paddingLeft: PAD_X, paddingRight: PAD_X, gap: CARD_GAP, minWidth: totalW }}>
            {orders.map((order, i) => (
              <OrderCard
                key={order.id}
                order={order}
                index={i}
                onClick={() => setDrawerOrderId(order.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-3 pb-16">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
            className="px-5 py-2.5 font-sketch font-bold text-xs tracking-widest uppercase border-2 border-brand-ink rounded-full disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors">
            ← PREV
          </button>
          <span className="font-note italic text-brand-ink/50 text-base">
            {page} / {totalPages}
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
            className="px-5 py-2.5 font-sketch font-bold text-xs tracking-widest uppercase border-2 border-brand-ink rounded-full disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors">
            NEXT →
          </button>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {drawerOrderId && (
        <OrderDrawer
          orderId={drawerOrderId}
          onClose={() => setDrawerOrderId(null)}
        />
      )}
    </div>
  );
}
