// Cart.jsx — shopping cart page
// Cart.jsx — trang giỏ hàng
//
// HOW CART WORKS / CÁCH GIỎ HÀNG HOẠT ĐỘNG:
// Cart state lives in Zustand (useCartStore).
// On mount, we fetchCart() from the API.
// On remove, we call removeItem() which also refreshes the cart.
// State giỏ hàng sống trong Zustand (useCartStore).
// Khi mount, chúng ta gọi fetchCart() từ API.
// Khi xóa, chúng ta gọi removeItem() — cũng tự động tải lại giỏ hàng.
import { useEffect } from 'react';
import { Link }      from 'react-router-dom';
import useCartStore  from '../store/useCartStore';
import useAuthStore  from '../store/useAuthStore';
import { orderApi }  from '../api/orderApi';

export default function Cart() {
  const { cart, loading, fetchCart, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();

  // Load cart when page mounts
  // Tải giỏ hàng khi trang khởi động
  useEffect(() => { fetchCart(); }, []);

  const handleCheckout = async () => {
    if (!user) { alert('Please login to checkout.'); return; }
    try {
      await orderApi.create({ shippingAddress: 'Default Address' });
      clearCart();
      alert('Order placed successfully! 🎉');
    } catch {
      alert('Checkout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.totalAmount ?? 0;

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-6xl text-brand-ink mb-10">
          YOUR <span className="text-brand-purple">CART</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-4xl text-brand-ink/30">CART IS EMPTY</p>
            <Link to="/products" className="inline-block mt-6 px-8 py-4 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Cart items list */}
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border-2 border-brand-ink p-4 flex items-center gap-4">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-contain" />
                )}
                <div className="flex-1">
                  <p className="font-bold text-brand-ink">{item.productName}</p>
                  <p className="text-brand-ink/50 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="font-display text-xl text-brand-purple">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Order summary */}
            <div className="bg-brand-ink text-white rounded-2xl p-6 mt-4 flex items-center justify-between">
              <div>
                <p className="text-white/50 text-sm">Total</p>
                <p className="font-display text-4xl text-brand-lime">${total.toFixed(2)}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="px-8 py-4 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors"
              >
                Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
