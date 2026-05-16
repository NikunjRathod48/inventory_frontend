import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
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
import AIAssistantPage from './pages/AIAssistantPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes inside AppLayout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'Staff']}><DashboardPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute allowedRoles={['Admin']}><ProductsPage /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute allowedRoles={['Admin']}><CategoriesPage /></ProtectedRoute>} />
            <Route path="/stock" element={<ProtectedRoute allowedRoles={['Admin', 'Staff']}><StockPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={['Admin', 'Staff']}><OrdersPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['Admin', 'Staff']}><ProfilePage /></ProtectedRoute>} />
            <Route path="/staff"     element={<ProtectedRoute allowedRoles={['Admin']}><StaffPage /></ProtectedRoute>} />
            <Route path="/reports"   element={<ProtectedRoute allowedRoles={['Admin']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute allowedRoles={['Admin']}><AIAssistantPage /></ProtectedRoute>} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </AuthProvider>
        <ToastContainer />
      </ToastProvider>
    </BrowserRouter>
  );
}
