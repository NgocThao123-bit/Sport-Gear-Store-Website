// ProtectedRoute.jsx — route guard for authenticated + admin-only pages
// ProtectedRoute.jsx — bảo vệ route cho các trang cần đăng nhập hoặc quyền admin
//
// HOW IT WORKS:
// Wraps any <Route> element. If the user fails the auth check, Navigate replaces
// the current history entry (replace) so the browser back button goes to the
// previous page, not back to the protected route.
// CÁCH HOẠT ĐỘNG:
// Bao bọc bất kỳ element Route nào. Nếu kiểm tra auth thất bại, Navigate thay thế
// lịch sử hiện tại (replace) để nút Back trình duyệt về trang trước, không quay lại route bảo vệ.
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  return children;
}
