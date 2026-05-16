import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import StockPage from './pages/StockPage';
import StaffPage from './pages/StaffPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes inside AppLayout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><CategoriesPage /></ProtectedRoute>} />
            <Route path="/stock" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><StockPage /></ProtectedRoute>} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/staff" element={<ProtectedRoute allowedRoles={['Admin']}><StaffPage /></ProtectedRoute>} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
