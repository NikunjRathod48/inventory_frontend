import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header style={{
      height: '64px', background: '#ffffff', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      padding: '0 2rem', position: 'sticky', top: 0, zIndex: 10
    }}>
      <button 
        className="mobile-menu-btn" 
        onClick={onMenuClick}
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} />
          </div>
          <div className="header-user-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{user?.fullname || 'User'}</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.role}</span>
          </div>
        </Link>
        <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </header>
  );
}
