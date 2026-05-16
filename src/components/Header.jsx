import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header style={{
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: '#e0e7ff', color: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.fullname || 'User'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: '0.875rem', fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
