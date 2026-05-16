import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route so only authenticated users can access it.
 * Optionally restrict to a specific role: <ProtectedRoute role="Admin" />
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
