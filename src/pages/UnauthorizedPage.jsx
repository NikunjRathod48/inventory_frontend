import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem' }}>🔒</div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>Access Denied</h1>
      <p style={{ color: '#475569', maxWidth: '380px' }}>
        You don't have permission to access this page.
        {user && <> You are logged in as <strong style={{ color: '#4f46e5' }}>{user.role}</strong>.</>}
      </p>
      <Link to="/dashboard" style={{
        padding: '0.75rem 1.75rem',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff', borderRadius: '0.625rem',
        textDecoration: 'none', fontWeight: 600,
        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
      }}>
        Go to Dashboard
      </Link>
    </div>
  );
}
