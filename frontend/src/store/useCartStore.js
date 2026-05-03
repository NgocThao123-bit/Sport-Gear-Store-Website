// useCartStore.js — global cart state
// useCartStore.js — trạng thái giỏ hàng toàn cục
//
// WHY NOT use React Context for cart?
// Zustand is simpler — no Provider wrapper needed, no re-render issues.
// TẠI SAO không dùng React Context cho giỏ hàng?
// Zustand đơn giản hơn — không cần Provider wrapper, ít re-render hơn.
import { create } from 'zustand';
import { cartApi } from '../api/cartApi';

const useCartStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────
  cart:    null,    // full cart object from API: { items[], totalAmount }
  loading: false,
  error:   null,

  // ── Actions ────────────────────────────────────────────────

  // fetchCart: load cart from server
  // Tải giỏ hàng từ server
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await cartApi.get();
      set({ cart: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // addItem: add product to cart then refresh
  // Thêm sản phẩm vào giỏ hàng rồi tải lại
  addItem: async (productId, variantId, quantity = 1) => {
    await cartApi.addItem({ productId, variantId, quantity });
    await get().fetchCart(); // refresh cart after adding
  },

  // removeItem: remove one item then refresh
  // Xóa một sản phẩm rồi tải lại giỏ hàng
  removeItem: async (itemId) => {
    await cartApi.removeItem(itemId);
    await get().fetchCart();
  },

  // itemCount: total number of items in cart (for badge in navbar)
  // Tổng số sản phẩm trong giỏ (dùng cho badge trên navbar)
  itemCount: () => {
    const cart = get().cart;
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // clearCart: reset local state (called after successful checkout)
  // Xóa state giỏ hàng cục bộ (gọi sau khi thanh toán thành công)
  clearCart: () => set({ cart: null }),
}));

export default useCartStore;
