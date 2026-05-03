// cartApi.js — HTTP calls for the shopping cart
// cartApi.js — các HTTP call cho giỏ hàng
//
// WHY: Cart is stored in the DATABASE (not localStorage) so it persists
//      across devices when the user is logged in.
// TẠI SAO: Giỏ hàng lưu trong DATABASE (không phải localStorage) nên
//           nó tồn tại qua nhiều thiết bị khi người dùng đã đăng nhập.
import axiosClient from './axiosClient';

export const cartApi = {
  // GET /api/cart — returns cart with all items + total
  // Lấy giỏ hàng với tất cả sản phẩm và tổng tiền
  get: () => axiosClient.get('/cart'),

  // POST /api/cart/items — add product to cart
  // body: { productId, variantId, quantity }
  // Thêm sản phẩm vào giỏ hàng
  addItem: (data) => axiosClient.post('/cart/items', data),

  // DELETE /api/cart/items/:itemId — remove one item
  // Xóa một sản phẩm khỏi giỏ hàng
  removeItem: (itemId) => axiosClient.delete(`/cart/items/${itemId}`),
};
