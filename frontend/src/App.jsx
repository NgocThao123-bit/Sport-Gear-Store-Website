// App.jsx — defines all client-side routes
// App.jsx — định nghĩa tất cả routes phía client
import { Routes, Route } from 'react-router-dom';
import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home           from './pages/Home';
import Products       from './pages/Products';
import ProductDetail  from './pages/ProductDetail';
import Cart           from './pages/Cart';
import Login          from './pages/Login';
import Register       from './pages/Register';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts  from './pages/admin/Products';
import AdminOrders    from './pages/admin/Orders';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* ── Shop routes ── */}
        <Route path="/"               element={<Home />} />
        <Route path="/products"       element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart"           element={<Cart />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />

        {/* ── Admin routes (admin-only guard) ── */}
        <Route path="/admin"          element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/orders"   element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  );
}
