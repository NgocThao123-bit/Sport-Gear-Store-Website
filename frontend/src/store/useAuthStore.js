// useAuthStore.js — global auth state managed by Zustand
// useAuthStore.js — trạng thái xác thực toàn cục được quản lý bởi Zustand
//
// WHAT IS ZUSTAND?
// Zustand là thư viện quản lý state nhẹ nhàng (giống Redux nhưng đơn giản hơn nhiều).
// create() nhận một hàm, hàm đó trả về object chứa state + actions.
//
// HOW TO USE IN A COMPONENT:
//   const { user, login, logout } = useAuthStore();
import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { jwtDecode } from 'jwt-decode'; // reads claims from JWT token

// Helper: decode JWT and extract user info
// Hàm phụ: giải mã JWT và trích xuất thông tin người dùng
function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);
    return {
      id:      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email:   decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      isAdmin: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin',
    };
  } catch {
    return null;
  }
}

// Read token from localStorage on app startup
// Đọc token từ localStorage khi app khởi động (persist login across refresh)
const savedToken = localStorage.getItem('token');
const savedUser  = savedToken ? decodeToken(savedToken) : null;

const useAuthStore = create((set) => ({
  // ── State ──────────────────────────────────────────────────
  token: savedToken,   // JWT string
  user:  savedUser,    // { id, email, isAdmin } decoded from token

  // ── Actions ────────────────────────────────────────────────

  // login: calls POST /api/auth/login, saves token to localStorage
  // Đăng nhập: gọi API, lưu token vào localStorage
  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    set({ token, user: decodeToken(token) });
  },

  // register: calls POST /api/auth/register, then auto-login
  // Đăng ký: gọi API đăng ký, sau đó tự động đăng nhập
  register: async (firstName, lastName, email, password) => {
    const res = await authApi.register({ firstName, lastName, email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    set({ token, user: decodeToken(token) });
  },

  // logout: clear token everywhere
  // Đăng xuất: xóa token khỏi mọi nơi
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
