// Cart.jsx — Clean Zine "YOUR BAG" redesign
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore  from '../store/useCartStore';
import useAuthStore  from '../store/useAuthStore';
import { orderApi } from '../api/orderApi';

import stkBaseball       from '../assets/images/stickers/shuttlecock (2).png';
import stkTennis         from '../assets/images/stickers/tennis.png';
import stkStar2          from '../assets/images/stickers/star (2).png';
import stkSoccerBall        from '../assets/images/stickers/soccer-ball.png';
import stkAmericanFootball  from '../assets/images/stickers/american-football-ball.png';
import stkShoppingBags   from '../assets/images/stickers/shopping-bags.png';
import stkLike           from '../assets/images/stickers/like.png';
import stkBarcode        from '../assets/images/stickers/barcode.png';
import stkBasketball     from '../assets/images/stickers/basketball-ball.png';
import stkDumbbell       from '../assets/images/stickers/dumbbell.png';
import stkSkateboard     from '../assets/images/stickers/skate-board2.png';
import stkSneaker        from '../assets/images/stickers/nike-sneaker1.png';
import stkSneaker2      from '../assets/images/stickers/nike-snearker2.png';
import stkGoogles       from '../assets/images/stickers/googles.png';
import stkPingPong       from '../assets/images/stickers/ping-pong.png';
import stkSki           from '../assets/images/stickers/ski.png';
import stkGymWeights    from '../assets/images/stickers/gym-weights.png';
import stkTennisRacket  from '../assets/images/stickers/tennis-racket.png';

const STEP_CART     = 'cart';
const STEP_CHECKOUT = 'checkout';
const STEP_SUCCESS  = 'success';

const CARD_ROTATIONS = [-2, 1.5, -1, 2.5, -1.5, 1];

// ── Inline SVG decorative components ──────────────────────────────────────────



// ── Clean Neumorphic Item Card ─────────────────────────────────────────────────
function BagItemCard({ item, index, onRemove, single = false }) {
  const rotate     = CARD_ROTATIONS[index % CARD_ROTATIONS.length];
  const price      = item.totalPrice?.toFixed(2);
  const cardWidth  = single ? 340 : 280;
  const cardHeight = single ? 480 : 390;
  const imgHeight  = single ? 280 : 220;

  return (
    <motion.div
      className="relative bg-white flex flex-col"
      style={{
        rotate,
        borderRadius: 28,
        width: cardWidth,
        height: cardHeight,
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: '10px 10px 26px rgba(0,0,0,0.08), -5px -5px 16px rgba(255,255,255,0.95)',
        padding: '1rem',
      }}
      initial={{ opacity: 0, y: 28, rotate: rotate - 8 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ type: 'spring', stiffness: 170, damping: 22, delay: index * 0.12 }}
      whileHover={{ scale: 1.03, rotate: rotate * 0.3, zIndex: 20,
        boxShadow: '14px 14px 32px rgba(0,0,0,0.11), -5px -5px 16px rgba(255,255,255,0.95)' }}
    >
      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-brand-ink/50 hover:text-white hover:bg-brand-danger transition-colors z-10"
        style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
        aria-label="Remove"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Product image — top half */}
      <div className="flex-shrink-0 flex items-center justify-center rounded-2xl mb-3"
        style={{ height: imgHeight, overflow: 'hidden' }}>
        {item.productImageUrl ? (
          <img
            src={item.productImageUrl}
            alt={item.productName}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px'}}
            draggable={false}
          />
        ) : (
          <span className="text-5xl">🏅</span>
        )}
      </div>

      {/* Info — bottom section */}
      <div className="flex-shrink-0 mt-3">
        <p className="font-display font-black text-brand-ink leading-tight line-clamp-1 mb-1"
          style={{ fontSize: 'clamp(15px, 1.8vw, 20px)', letterSpacing: '-0.02em' }}
          title={item.productName}>
          {item.productName}
        </p>

        <div className="font-note italic text-brand-ink/55 text-base leading-snug">
          {item.variantInfo && <span className="mr-2">Size: {item.variantInfo}</span>}
          <span>Qty: {item.quantity}</span>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <p className="font-display font-black text-brand-ink"
            style={{ fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-0.04em' }}>
            ${price}
          </p>
          {/* Lime underline */}
          <div className="h-[2.5px] rounded-full flex-1 ml-3" style={{ backgroundColor: '#d4ff32' }} />
        </div>
      </div>

      {/* Mini barcode decoration bottom-right */}
      <div className="absolute bottom-4 -right-6 opacity-55">
        <img src={stkBarcode} alt="" style={{ width: single ? 220 : 192, height: single ? 100 : 64, objectFit: 'contain' }} draggable={false} />
      </div>
    </motion.div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function Cart() {
  const { cart, loading, fetchCart, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate  = useNavigate();

  const [step,       setStep]       = useState(STEP_CART);
  const [placing,    setPlacing]    = useState(false);
  const [address,    setAddress]    = useState('');
  const [payment,    setPayment]    = useState('Credit Card');
  const [notes,      setNotes]      = useState('');
  const [formErr,    setFormErr]    = useState('');
  const [promoCode,  setPromoCode]  = useState('');

  useEffect(() => { fetchCart(); }, []);

  const items    = cart?.items ?? [];
  const total    = cart?.totalAmount ?? 0;
  const shipping = 0;
  const tax      = 0;
  const grandTotal = total + shipping + tax;

  const goToCheckout = () => {
    if (!user) { navigate('/login'); return; }
    setStep(STEP_CHECKOUT);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) { setFormErr('Please enter a shipping address.'); return; }
    setFormErr('');
    setPlacing(true);
    try {
      await orderApi.create({
        shippingAddress: address.trim(),
        paymentMethod:   payment,
        notes:           notes.trim() || undefined,
      });
      clearCart();
      setStep(STEP_SUCCESS);
    } catch {
      setFormErr('Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0eff0' }}>
        <div className="w-12 h-12 border-4 border-brand-ink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === STEP_SUCCESS) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f0eff0' }}>
        <motion.div className="text-center max-w-lg"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: '#d4ff32', boxShadow: '8px 8px 20px rgba(0,0,0,0.1), -4px -4px 12px rgba(255,255,255,0.95)' }}
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <svg className="w-12 h-12 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h1 className="font-display font-black uppercase text-brand-ink leading-none mb-4"
            style={{ fontSize: 'clamp(52px, 9vw, 110px)', letterSpacing: '-0.04em' }}>
            ORDER<br/>PLACED!
          </h1>
          <p className="font-note italic text-brand-ink/45 text-xl mb-10">Confirmed — we'll ship it ASAP.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/orders"
              className="px-8 py-4 font-sketch font-bold text-xs tracking-widest uppercase rounded-full border-2 border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-brand-lime transition-colors">
              View My Orders
            </Link>
            <Link to="/products"
              className="px-8 py-4 font-sketch font-bold text-xs tracking-widest uppercase rounded-full text-brand-lime"
              style={{ backgroundColor: '#1c1b1b', boxShadow: '5px 5px 12px rgba(0,0,0,0.22), -2px -2px 8px rgba(255,255,255,0.08)' }}>
              Keep Shopping →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f0eff0' }}>
        <div className="text-center">
          <img src={stkShoppingBags} alt="" className="w-48 h-48 object-contain mx-auto mb-6 opacity-30" draggable={false} />
          <h1 className="font-display font-black uppercase leading-none mb-3"
            style={{ fontSize: 'clamp(60px, 12vw, 150px)', letterSpacing: '-0.04em', color: 'rgba(28,27,27,0.12)' }}>
            EMPTY BAG
          </h1>
          <p className="font-note italic text-brand-ink/35 text-2xl mb-10">Nothing in here yet...</p>
          <Link to="/products"
            className="px-10 py-4 font-sketch font-bold text-xs tracking-widest uppercase rounded-full border-2 border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-brand-lime transition-colors">
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  // ── Checkout ───────────────────────────────────────────────────────────────
  if (step === STEP_CHECKOUT) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#f4f3ee' }}>

        {/* Grainy paper texture */}
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{ opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px' }} />

        {/* Scattered bg stickers */}
        <motion.img src={stkBaseball} alt="" draggable={false}
          className="absolute top-16 left-6 w-60 h-60 object-contain pointer-events-none select-none opacity-40 hidden lg:block"
          style={{ rotate: -20 }} animate={{ rotate: [-20, -12, -20], y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

        <motion.img src={stkSoccerBall} alt="" draggable={false}
          className="absolute bottom-24 left-[28%] w-48 h-48 object-contain pointer-events-none select-none opacity-35 hidden lg:block"
          animate={{ rotate: [0, 15, 0], y: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} />

        <motion.img src={stkStar2} alt="" draggable={false}
          className="absolute top-8 right-8 w-48 h-48 object-contain pointer-events-none select-none opacity-50 hidden lg:block"
          animate={{ rotate: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />

        <motion.img src={stkAmericanFootball} alt="" draggable={false}
          className="absolute bottom-12 right-12 w-60 h-60 object-contain pointer-events-none select-none opacity-35 hidden lg:block"
          style={{ rotate: 15 }} animate={{ rotate: [15, 25, 15], y: [0, -7, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <motion.img src={stkBasketball} alt="" draggable={false}
          className="absolute top-1/2 left-4 w-42 h-42 object-contain pointer-events-none select-none opacity-30 hidden lg:block"
          style={{ width: 168, height: 168 }}
          animate={{ rotate: [0, 360], y: [0, -8, 0] }}
          transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }} />

        <motion.img src={stkDumbbell} alt="" draggable={false}
          className="absolute top-36 left-1/4 w-48 h-48 object-contain pointer-events-none select-none opacity-25 hidden lg:block"
          style={{ rotate: -30 }} animate={{ rotate: [-30, -20, -30], scale: [1, 1.08, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />


        <motion.img src={stkSkateboard} alt="" draggable={false}
          className="absolute top-1/3 right-4 w-60 h-60 object-contain pointer-events-none select-none hidden lg:block"
          style={{ rotate: 25, opacity: 0.28 }} animate={{ rotate: [25, 15, 25], y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />

        <motion.img src={stkSneaker} alt="" draggable={false}
          className="absolute bottom-16 left-20 w-72 h-72 object-contain pointer-events-none select-none opacity-30 hidden lg:block"
          style={{ rotate: -15 }} animate={{ rotate: [-15, -8, -15], y: [0, -5, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }} />

        <motion.img src={stkPingPong} alt="" draggable={false}
          className="absolute top-24 right-1/4 w-36 h-36 object-contain pointer-events-none select-none opacity-35 hidden lg:block"
          animate={{ rotate: [0, 20, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />

        <motion.img src={stkSki} alt="" draggable={false}
          className="absolute top-[30%] left-1/2 -translate-x-1/2 w-60 h-60 object-contain pointer-events-none select-none opacity-30 hidden lg:block"
          style={{ rotate: -40 }} animate={{ rotate: [-40, -30, -40], y: [0, -8, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />

        <motion.img src={stkGymWeights} alt="" draggable={false}
          className="absolute bottom-8 right-1/3 w-60 h-60 object-contain pointer-events-none select-none opacity-30 hidden lg:block"
          style={{ rotate: 10 }} animate={{ rotate: [10, 18, 10], scale: [1, 1.07, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }} />

        <motion.img src={stkTennisRacket} alt="" draggable={false}
          className="absolute top-10 left-1/3 w-48 h-48 object-contain pointer-events-none select-none hidden lg:block"
          style={{ rotate: 20, opacity: 0.28 }} animate={{ rotate: [20, 10, 20], y: [0, -6, 0] }}
          transition={{ duration: 3.9, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }} />

        <motion.img src={stkSneaker2} alt="" draggable={false}
          className="absolute bottom-64 right-5 w-72 h-72 object-contain pointer-events-none select-none hidden lg:block"
          style={{ rotate: -20, opacity: 0.32 }} animate={{ rotate: [-20, -10, -20], y: [0, -7, 0] }}
          transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }} />

        <motion.img src={stkGoogles} alt="" draggable={false}
          className="absolute top-1/4 left-8 w-60 h-60 object-contain pointer-events-none select-none hidden lg:block"
          style={{ rotate: 10, opacity: 0.30 }} animate={{ rotate: [10, 18, 10], scale: [1, 1.06, 1] }}
          transition={{ duration: 3.7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14 py-10">

          {/* ── HEADER ── */}
          <motion.div className="flex items-center gap-6 mb-10"
            initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <motion.button onClick={() => setStep(STEP_CART)}
              className="w-11 h-11 rounded-full border-[3px] border-brand-ink flex items-center justify-center text-brand-ink flex-shrink-0"
              whileHover={{ backgroundColor: '#1c1b1b', color: '#d4ff32', scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <h1 className="font-display font-black uppercase text-brand-ink leading-none"
              style={{ fontSize: 'clamp(48px, 9vw, 128px)', letterSpacing: '-0.04em' }}>
              CHECKOUT
            </h1>
          </motion.div>

          {/* ── TWO COLUMNS ── */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 items-start">

            {/* ── LEFT: Form ── */}
            <motion.div className="flex-1 lg:pr-14"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-9">

                {/* SHIPPING */}
                <div>
                  <h2 className="font-display font-black uppercase text-brand-ink leading-none mb-5"
                    style={{ fontSize: 'clamp(16px, 2vw, 24px)', letterSpacing: '-0.02em' }}>
                    SHIPPING
                  </h2>

                  {formErr && (
                    <p className="font-note italic text-brand-danger font-bold mb-4 text-base border-l-4 border-brand-danger pl-3">
                      {formErr}
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="font-note italic font-bold text-brand-ink/65 text-lg">
                      Delivery Address *
                    </label>
                    <textarea
                      value={address} onChange={(e) => setAddress(e.target.value)}
                      required rows={3} placeholder="123 Street, City, Country..."
                      className="font-sans text-sm bg-white/70 px-5 py-4 resize-none focus:outline-none transition-all placeholder:text-brand-ink/30"
                      style={{
                        border: '3px solid #1c1b1b',
                        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.12)',
                      }}
                      onFocus={e => e.target.style.boxShadow = '4px 4px 0 #d4ff32'}
                      onBlur={e => e.target.style.boxShadow = '4px 4px 0 rgba(0,0,0,0.12)'}
                    />
                  </div>
                </div>

                {/* PAYMENT */}
                <div>
                  <h2 className="font-display font-black uppercase text-brand-ink leading-none mb-5"
                    style={{ fontSize: 'clamp(16px, 2vw, 24px)', letterSpacing: '-0.02em' }}>
                    PAYMENT
                  </h2>

                  <div className="flex flex-col gap-2 mb-5">
                    <label className="font-note italic font-bold text-brand-ink/65 text-lg">Method</label>
                    <select value={payment} onChange={(e) => setPayment(e.target.value)}
                      className="font-sans text-sm bg-white/70 px-5 py-4 focus:outline-none cursor-pointer"
                      style={{
                        border: '3px solid #1c1b1b',
                        borderRadius: '15px 255px 15px 225px/225px 15px 255px 15px',
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.12)',
                      }}>
                      <option>Credit Card</option>
                      <option>Cash on Delivery</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>

                  {/* Payment sticker badges */}
                  <div className="flex gap-3 flex-wrap">
                    {['VISA', 'MASTERCARD', 'COD'].map((m) => (
                      <span key={m}
                        className="px-3 py-1.5 font-sketch font-black text-[11px] tracking-widest uppercase text-brand-ink border-2 border-brand-ink"
                        style={{
                          borderRadius: '255px 12px 230px 10px/10px 230px 12px 255px',
                          backgroundColor: payment === (m === 'COD' ? 'Cash on Delivery' : m === 'VISA' ? 'Credit Card' : 'Bank Transfer') ? '#d4ff32' : 'white',
                        }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* NOTES */}
                <div className="flex flex-col gap-2">
                  <label className="font-note italic font-bold text-brand-ink/65 text-lg">Notes (optional)</label>
                  <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions..."
                    className="font-sans text-sm bg-white/70 px-5 py-4 focus:outline-none transition-all placeholder:text-brand-ink/30"
                    style={{
                      border: '3px solid #1c1b1b',
                      borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                      boxShadow: '4px 4px 0 rgba(0,0,0,0.12)',
                    }}
                    onFocus={e => e.target.style.boxShadow = '4px 4px 0 #d4ff32'}
                    onBlur={e => e.target.style.boxShadow = '4px 4px 0 rgba(0,0,0,0.12)'} />
                </div>

                {/* SECURE THE GEAR button */}
                <motion.button type="submit" disabled={placing}
                  className="py-6 font-display font-black uppercase text-brand-ink rounded-full disabled:opacity-50"
                  style={{
                    fontSize: 'clamp(22px, 3vw, 38px)',
                    letterSpacing: '-0.01em',
                    backgroundColor: '#d4ff32',
                    boxShadow: '8px 8px 20px rgba(0,0,0,0.14), -4px -4px 12px rgba(255,255,255,0.95), inset 2px 2px 6px rgba(255,255,255,0.75), inset -2px -2px 6px rgba(0,0,0,0.08)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '10px 10px 24px rgba(0,0,0,0.18), -4px -4px 12px rgba(255,255,255,0.95), inset 2px 2px 6px rgba(255,255,255,0.75), inset -2px -2px 6px rgba(0,0,0,0.08)' }}
                  whileTap={{ scale: 0.97, boxShadow: 'inset 5px 5px 14px rgba(0,0,0,0.18), inset -3px -3px 10px rgba(255,255,255,0.7)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
                  {placing ? 'Securing...' : 'SECURE THE GEAR →'}
                </motion.button>
              </form>
            </motion.div>

            {/* ── Marker divider ── */}
            <div className="hidden lg:block flex-shrink-0 w-px mx-4 self-stretch"
              style={{
                backgroundImage: 'repeating-linear-gradient(to bottom, #1c1b1b 0px, #1c1b1b 10px, transparent 10px, transparent 18px)',
                opacity: 0.22,
              }} />

            {/* ── RIGHT: Order Summary ── */}
            <motion.div className="w-full lg:w-[460px] flex-shrink-0 lg:pl-14 relative"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>

              {/* Like sticker */}
              <motion.img src={stkLike} alt="" draggable={false}
                className="absolute -top-14 right-2 w-32 h-32 object-contain pointer-events-none select-none z-20"
                animate={{ rotate: [0, 8, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} />

              {/* Glassmorphism card */}
              <motion.div className="relative rounded-[32px] overflow-hidden"
                style={{
                  background: 'rgba(186,231,255,0.78)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  boxShadow: [
                    '0 12px 60px rgba(56,188,255,0.38)',
                    '0 4px 24px rgba(0,0,0,0.18)',
                    '0 0 0 1.5px rgba(255,255,255,0.55)',
                    '0 0 10px rgba(255,255,255,0.45)',
                    '0 0 22px rgba(186,231,255,0.55)',
                    'inset 0 1px 0 rgba(255,255,255,0.75)',
                    'inset 0 -1px 0 rgba(186,231,255,0.25)',
                  ].join(', '),
                }}
                whileHover={{ scale: 1.012, y: -10, transition: { type: 'spring', stiffness: 280, damping: 20 } }}>

                {/* Shimmer overlay */}
                <motion.div className="absolute inset-0 pointer-events-none z-10" style={{ borderRadius: 32 }}
                  animate={{ x: ['-130%', '230%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(108deg, transparent 35%, rgba(255,255,255,0.26) 50%, transparent 65%)',
                  }} />
                </motion.div>

                {/* Title inside card */}
                <div className="px-7 pt-7 pb-5">
                  <h2 className="font-display font-black uppercase text-brand-ink leading-none"
                    style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-0.02em' }}>
                    ORDER SUMMARY
                  </h2>
                </div>

                {/* Items list */}
                <div className="px-7 flex flex-col gap-4 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.productImageUrl && (
                        <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-white/80 flex items-center justify-center">
                          <img src={item.productImageUrl} alt={item.productName}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sketch font-bold text-sm text-brand-ink leading-tight truncate"
                          title={item.productName}>
                          {item.productName} ({item.quantity})
                        </p>
                        <p className="font-sans text-xs text-brand-ink/50 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-sketch font-bold text-brand-ink text-sm flex-shrink-0">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="mx-7 border-t border-brand-ink/20 mb-4" />

                {/* Subtotal / Shipping / Tax */}
                <div className="px-7 flex flex-col gap-2 mb-5">
                  {[
                    { label: 'Subtotal', value: total },
                    { label: 'Shipping', value: shipping },
                    { label: 'Tax',      value: tax },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="font-sans text-sm text-brand-ink/60">{label}</span>
                      <span className="font-sans text-sm text-brand-ink">${value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* TOTAL row */}
                <div className="px-7 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-sketch font-bold text-brand-ink/50 text-base">→</span>
                    <div className="relative inline-block px-5 py-1.5">
                      <span className="font-display font-black text-brand-ink uppercase relative z-10"
                        style={{ fontSize: 20, letterSpacing: '0.02em' }}>
                        TOTAL
                      </span>
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 88 32"
                        preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                        <ellipse cx="44" cy="16" rx="41" ry="14" fill="none" stroke="#1c1b1b"
                          strokeWidth="2.2" strokeDasharray="7 3" strokeLinecap="round"
                          style={{ transform: 'rotate(-1.5deg)', transformOrigin: 'center' }} />
                      </svg>
                    </div>
                  </div>
                  <span className="font-display font-black text-brand-ink"
                    style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.03em' }}>
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Promo code */}
                <div className="px-7 pb-7 flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code"
                    className="flex-1 font-sans text-sm px-4 py-3 focus:outline-none placeholder:text-brand-ink/35"
                    style={{
                      background: 'rgba(255,255,255,0.60)',
                      borderRadius: 16,
                      border: '1.5px solid rgba(28,27,27,0.10)',
                    }}
                  />
                  <button
                    type="button"
                    className="px-5 py-3 font-sketch font-bold text-xs tracking-widest uppercase text-brand-cream flex-shrink-0"
                    style={{ background: '#1c1b1b', borderRadius: 16 }}>
                    APPLY
                  </button>
                </div>
              </motion.div>

              {/* Tennis sticker */}
              <motion.img src={stkTennis} alt="" draggable={false}
                className="absolute -bottom-16 -left-12 w-40 h-40 object-contain pointer-events-none select-none"
                animate={{ rotate: [0, -12, 0], y: [0, -5, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ── CART VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#f0eff0' }}>

      {/* ── HEADLINE ── */}
      <motion.div className="relative z-10 px-8 lg:px-16 pt-8 pb-4 flex items-end gap-6 flex-wrap"
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>

        <h1 className="font-display font-black uppercase text-brand-ink leading-none"
          style={{ fontSize: 'clamp(60px, 13vw, 180px)', letterSpacing: '-0.04em' }}>
          YOUR BAG
        </h1>

        {/* Shopping bag sticker next to headline */}
        <motion.div className="mb-2 hidden sm:block"
          animate={{ rotate: [0, 6, 0], y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <img src={stkShoppingBags} alt="" className="w-32 h-32 object-contain" draggable={false} />
        </motion.div>


      </motion.div>

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-10 px-8 lg:px-16 pb-16 items-start">

        {/* ── LEFT: Cards + athlete ── */}
        <div className="flex-1 relative">

          {/* Item cards */}
          <div className="relative z-10 flex flex-wrap gap-6 justify-center">
            {items.map((item, i) => (
              <BagItemCard key={item.id} item={item} index={i} onRemove={removeItem} single={items.length === 1} />
            ))}
          </div>

          {/* Scattered decorations */}
          <motion.img src={stkBaseball} alt=""
            className="absolute top-4 -left-2 w-16 h-16 object-contain pointer-events-none select-none hidden lg:block z-20"
            style={{ rotate: -15 }}
            animate={{ rotate: [-15, -7, -15], y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            draggable={false} />

          <motion.img src={stkTennis} alt=""
            className="absolute top-0 right-8 w-32 h-32 object-contain pointer-events-none select-none z-20"
            animate={{ scale: [1, 1.28, 1], rotate: [0, 14, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            draggable={false} />

          {/* American football sticker */}
          <motion.img src={stkAmericanFootball} alt=""
            className="absolute -bottom-32 left-4 w-24 h-24 object-contain pointer-events-none select-none hidden lg:block z-20"
            animate={{ rotate: [0, 12, 0], y: [0, -6, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            draggable={false} />

        </div>

        {/* ── RIGHT: Lime summary blob ── */}
        <div className="w-full lg:w-[480px] flex-shrink-0 relative pt-2">

          {/* Like sticker top-right of card */}
          <motion.img src={stkLike} alt=""
            className="absolute -top-2 -right-2 w-36 h-36 object-contain pointer-events-none select-none z-20 hidden sm:block"
            animate={{ rotate: [0, 5, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            draggable={false} />

          {/* Lime blob card — irregular border-radius for organic feel */}
          <motion.div
            className="relative p-8 overflow-hidden"
            style={{
              backgroundColor: '#d4ff32',
              borderRadius: '38px 44px 40px 48px / 48px 38px 44px 40px',
              boxShadow: '14px 14px 32px rgba(0,0,0,0.12), -7px -7px 22px rgba(255,255,255,0.82)',
            }}
            initial={{ opacity: 0, x: 44 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}>

            {/* Top row: NEOGEN label + barcode */}
            <div className="flex items-center justify-between mb-5">
              <span className="font-display font-black text-brand-ink text-2xl tracking-wide">New era</span>
             
            </div>

            {/* SUMMARY */}
            <h2 className="font-display font-black uppercase text-brand-ink leading-none mb-2"
              style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-0.03em' }}>
              SUMMARY
            </h2>

            <p className="font-sketch text-brand-ink/50 text-sm font-bold tracking-widest uppercase mb-5">
              {items.length} item{items.length !== 1 ? 's' : ''} in bag
            </p>

            {/* Items list */}
            <div className="flex flex-col gap-2 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center font-sketch text-base font-bold text-brand-ink/60">
                  <span className="truncate flex-1 pr-2">{item.productName} ×{item.quantity}</span>
                  <span className="flex-shrink-0">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t-2 border-brand-ink/20 pt-4 mb-7">
              <p className="font-note italic font-bold text-brand-ink/70 text-xl mb-0.5">total amount</p>
              <p className="font-display font-black text-brand-ink leading-none text-center"
                style={{ fontSize: 'clamp(26px, 4vw, 46px)', letterSpacing: '-0.04em' }}>
                ${total.toFixed(2)}
              </p>
            </div>

            {/* GO TO CHECKOUT */}
            <motion.button onClick={goToCheckout}
              className="w-full py-4 font-display font-black italic uppercase text-brand-lime rounded-full"
              style={{ fontSize: 'clamp(20px, 2.6vw, 32px)', letterSpacing: '0.02em', backgroundColor: '#111',
                boxShadow: '0 0 0 14px rgba(255,255,255,0.85), 0 8px 32px rgba(0,0,0,0.6), inset 0 2px 16px rgba(0,0,0,0.7)' }}
              whileHover={{ scale: 1.03, backgroundColor: '#000' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
              GO TO CHECKOUT
            </motion.button>

            {!user && (
              <p className="mt-4 text-center font-sketch text-[10px] text-brand-ink/50">
                <Link to="/login" className="font-bold underline underline-offset-2 hover:text-brand-ink transition-colors">Sign in</Link>
                {' '}to place an order
              </p>
            )}


          </motion.div>

          {/* Stickers outside the card */}
          <motion.img src={stkSoccerBall} alt=""
            className="absolute -bottom-4 right-10 w-16 h-16 object-contain pointer-events-none select-none z-20"
            animate={{ rotate: [0, 12, 0], y: [0, -5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
            draggable={false} />

          
        </div>
      </div>

      {/* Continue Shopping — bottom center */}
      <div className="relative z-10 pb-8 -mt-20 flex items-center justify-center gap-2">
        <Link to="/products"
          className="font-note italic font-bold text-4xl text-brand-ink/50 hover:text-brand-ink transition-colors">
          ← Continue Shopping
        </Link>
        <motion.img src={stkStar2} alt=""
          className="w-40 h-40 object-contain pointer-events-none select-none flex-shrink-0 -mt-16"
          animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false} />
      </div>

    </div>
  );
}
