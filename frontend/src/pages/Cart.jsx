// Cart.jsx — shopping cart page with inline checkout flow
// Steps: cart view → checkout form → success screen
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore  from '../store/useCartStore';
import useAuthStore  from '../store/useAuthStore';
import { orderApi } from '../api/orderApi';

// ── Step constants ─────────────────────────────────────────────────────────
const STEP_CART     = 'cart';
const STEP_CHECKOUT = 'checkout';
const STEP_SUCCESS  = 'success';

export default function Cart() {
  const { cart, loading, fetchCart, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate  = useNavigate();

  const [step,    setStep]    = useState(STEP_CART);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Checkout form fields
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('Credit Card');
  const [notes,   setNotes]   = useState('');
  const [formErr, setFormErr] = useState('');

  useEffect(() => { fetchCart(); }, []);

  const items = cart?.items ?? [];
  const total = cart?.totalAmount ?? 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

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
      const res = await orderApi.create({
        shippingAddress: address.trim(),
        paymentMethod:   payment,
        notes:           notes.trim() || undefined,
      });
      setOrderId(res.data?.id ?? null);
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
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (step === STEP_SUCCESS) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-brand-lime flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-5xl text-brand-ink mb-3">ORDER PLACED!</h1>
          <p className="text-brand-ink/50 text-sm mb-8">
            Your order has been confirmed. We'll get it shipped as soon as possible.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/orders"
              className="px-8 py-4 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full border-2 border-brand-ink hover:bg-brand-purple hover:text-white transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              className="px-8 py-4 bg-brand-ink text-brand-lime font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple transition-colors"
            >
              Keep Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display text-6xl text-brand-ink/20 mb-4">CART IS EMPTY</p>
          <p className="text-brand-ink/40 text-sm mb-8">Add some products and come back!</p>
          <Link
            to="/products"
            className="px-8 py-4 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors"
          >
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  // ── Checkout form ──────────────────────────────────────────────────────────
  if (step === STEP_CHECKOUT) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => setStep(STEP_CART)}
              className="p-2 rounded-full border-2 border-brand-ink hover:bg-brand-ink hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-display text-5xl text-brand-ink">
              CHECK<span className="text-brand-purple">OUT</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Form */}
            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-5">
              <h2 className="font-display text-2xl text-brand-ink">SHIPPING</h2>

              {formErr && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {formErr}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">
                  Shipping Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  placeholder="123 Street, City, Country"
                  className="border-2 border-brand-ink/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">
                  Payment Method
                </label>
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  className="border-2 border-brand-ink/20 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-brand-purple transition-colors bg-white"
                >
                  <option>Credit Card</option>
                  <option>Cash on Delivery</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  className="border-2 border-brand-ink/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={placing}
                className="py-4 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-50"
              >
                {placing ? 'Placing Order...' : `Place Order · $${total.toFixed(2)} →`}
              </button>
            </form>

            {/* Order summary */}
            <div>
              <h2 className="font-display text-2xl text-brand-ink mb-5">SUMMARY</h2>
              <div className="bg-white rounded-2xl border-2 border-brand-ink overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 border-b border-brand-ink/10 last:border-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-cream flex-shrink-0">
                      {item.productImageUrl ? (
                        <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🏅</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-ink text-sm truncate">{item.productName}</p>
                      {item.variantInfo && (
                        <p className="text-brand-ink/40 text-xs">{item.variantInfo}</p>
                      )}
                      <p className="text-brand-ink/40 text-xs">×{item.quantity}</p>
                    </div>
                    <span className="font-display text-lg text-brand-ink flex-shrink-0">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="p-4 bg-brand-ink/5 flex justify-between items-center">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Total</span>
                  <span className="font-display text-2xl text-brand-purple">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── Cart view (default) ────────────────────────────────────────────────────
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <h1 className="font-display text-6xl text-brand-ink mb-10">
          YOUR <span className="text-brand-purple">CART</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Items list */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-brand-ink p-4 flex items-center gap-4"
              >
                {/* Product image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-cream flex-shrink-0">
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🏅</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-ink text-sm truncate">{item.productName}</p>
                  {item.variantInfo && (
                    <p className="text-brand-ink/40 text-xs mt-0.5">{item.variantInfo}</p>
                  )}
                  <p className="text-brand-ink/40 text-xs mt-1">Qty: {item.quantity}</p>
                </div>

                {/* Price */}
                <span className="font-display text-xl text-brand-purple flex-shrink-0">
                  ${item.totalPrice.toFixed(2)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-brand-ink/30 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Remove"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            <Link
              to="/products"
              className="text-xs font-bold tracking-widest uppercase text-brand-ink/40 hover:text-brand-purple transition-colors text-center mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border-2 border-brand-ink p-6 flex flex-col gap-4">
              <h2 className="font-display text-2xl text-brand-ink">SUMMARY</h2>

              <div className="flex justify-between text-sm text-brand-ink/60 font-bold">
                <span>Items ({items.length})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-brand-ink/60 font-bold">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>

              <div className="border-t-2 border-brand-ink/10 pt-4 flex justify-between items-baseline">
                <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Total</span>
                <span className="font-display text-3xl text-brand-purple">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={goToCheckout}
                className="py-4 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors"
              >
                Checkout →
              </button>

              {!user && (
                <p className="text-center text-xs text-brand-ink/40">
                  <Link to="/login" className="font-bold text-brand-purple hover:underline">Sign in</Link>
                  {' '}to place an order
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
