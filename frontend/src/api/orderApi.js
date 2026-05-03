// orderApi.js — HTTP calls for Orders (checkout + history)
// orderApi.js — các HTTP call cho Đơn hàng (thanh toán + lịch sử)
import axiosClient from './axiosClient';

export const orderApi = {
  // POST /api/orders — checkout: converts cart into an order
  // Thanh toán: chuyển giỏ hàng thành đơn hàng
  create: (data) => axiosClient.post('/orders', data),

  // GET /api/orders — customer's own order history
  // Lịch sử đơn hàng của khách hàng
  getMyOrders: (params) => axiosClient.get('/orders', { params }),

  // GET /api/orders/:id — single order detail
  // Chi tiết một đơn hàng
  getById: (id) => axiosClient.get(`/orders/${id}`),

  // PUT /api/orders/:id/status — Admin only, update order status
  // Cập nhật trạng thái đơn hàng (chỉ Admin)
  updateStatus: (id, newStatus) =>
    axiosClient.put(`/orders/${id}/status`, { newStatus }),

  // GET /api/orders/admin/all — Admin only, paginated list of all orders
  // Danh sách tất cả đơn hàng có phân trang (chỉ Admin)
  adminGetAll: (params) => axiosClient.get('/orders/admin/all', { params }),
};
