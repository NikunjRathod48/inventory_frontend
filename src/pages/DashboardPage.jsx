import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Placeholder dashboard — will be fully built in Phase 6
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }}>
      {/* Success banner */}
      <div style={{
        padding: '1.25rem 2rem',
        background: '#ecfdf5', // emerald-50
        border: '1px solid #a7f3d0', // emerald-200
        borderRadius: '1rem',
        textAlign: 'center',
        maxWidth: '480px', width: '100%',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>
          Successfully Logged In!
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9375rem' }}>
          Welcome, <strong style={{ color: '#0f172a' }}>{user?.fullname}</strong>
        </p>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Role: <span style={{ color: '#4f46e5', fontWeight: 600 }}>{user?.role}</span>
        </p>
      </div>

      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
        Full dashboard UI is being built in the next phase.
      </p>

      <button onClick={handleLogout} style={{
        padding: '0.75rem 2rem',
        background: '#fef2f2', // red-50
        border: '1px solid #fecaca', // red-200
        color: '#dc2626', borderRadius: '0.625rem',
        cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem',
      }}>
        Logout
      </button>
    </div>
  );
}
