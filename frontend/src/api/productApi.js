// productApi.js — all HTTP calls related to Products and Categories
// productApi.js — tất cả các HTTP call liên quan đến Sản phẩm và Danh mục
//
// WHY separate files per feature?
// Dễ tìm: mỗi file chỉ chứa 1 nhóm API, không lẫn lộn giữa auth/product/cart
import axiosClient from './axiosClient';

export const productApi = {
  // GET /api/products?pageNumber=1&pageSize=12&categoryId=...&searchTerm=...
  // Lấy danh sách sản phẩm có phân trang và lọc
  getAll: (params) => axiosClient.get('/products', { params }),

  // GET /api/products/:slug — product detail page
  // Lấy chi tiết sản phẩm theo slug (URL-friendly name)
  getBySlug: (slug) => axiosClient.get(`/products/${slug}`),

  // POST /api/products — Admin only
  // Tạo sản phẩm mới (chỉ Admin)
  create: (data) => axiosClient.post('/products', data),

  // PUT /api/products/:id — Admin only
  // Cập nhật sản phẩm (chỉ Admin)
  update: (id, data) => axiosClient.put(`/products/${id}`, data),

  // DELETE /api/products/:id — Admin only (soft delete)
  // Xóa mềm sản phẩm — IsActive=false, không xóa thật
  remove: (id) => axiosClient.delete(`/products/${id}`),
};

export const categoryApi = {
  // GET /api/categories — public, no auth needed
  // Lấy tất cả danh mục — công khai, không cần đăng nhập
  getAll: () => axiosClient.get('/categories'),
};
