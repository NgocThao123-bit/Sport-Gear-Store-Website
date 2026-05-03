// axiosClient.js — single Axios instance shared by all API modules
// axiosClient.js — một instance Axios duy nhất dùng cho tất cả API modules
//
// WHY: Centralises base URL + auth token injection.
//      Every request automatically includes the JWT from localStorage.
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',   // .NET API address
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token if present
// Interceptor request — đính kèm JWT token nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — on 401 clear token and redirect to login
// Interceptor response — khi 401 xóa token và chuyển về trang login
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
