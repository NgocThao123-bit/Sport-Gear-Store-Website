// paymentApi.js — HTTP calls for mock payment processing
// paymentApi.js — các HTTP call cho xử lý thanh toán giả lập
import axiosClient from './axiosClient';

export const paymentApi = {
  // POST /api/payments/process — simulate processing a payment for an order
  // Giả lập xử lý thanh toán cho một đơn hàng
  process: (orderId, paymentMethod) =>
    axiosClient.post('/payments/process', { orderId, paymentMethod }),
};
