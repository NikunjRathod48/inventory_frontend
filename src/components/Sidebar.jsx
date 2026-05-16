import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ArrowRightLeft, FileText, Bot, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/categories', icon: Tags, label: 'Categories', allowedRoles: ['Admin', 'Manager'] },
    { to: '/stock', icon: ArrowRightLeft, label: 'Stock Management', allowedRoles: ['Admin', 'Manager'] },
    { to: '/orders', icon: FileText, label: 'Orders & Invoices' },
    { to: '/staff', icon: Users, label: 'Staff Management', allowedRoles: ['Admin'] },
    { to: '/assistant', icon: Bot, label: 'AI Assistant' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo Area */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        borderBottom: '1px solid #e2e8f0',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1, #4338ca)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
        }}>
          <Package size={18} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
          StockSense
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ padding: '0 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Main Menu
        </p>

        {links.map((link) => {
          if (link.allowedRoles && !link.allowedRoles.includes(user?.role)) return null;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: isActive ? '#4f46e5' : '#475569',
                background: isActive ? '#eef2ff' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9375rem',
                transition: 'all 0.15s ease',
              })}
            >
              <link.icon size={18} style={{ opacity: 0.9 }} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
