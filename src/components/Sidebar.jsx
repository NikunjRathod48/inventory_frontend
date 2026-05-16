import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ArrowRightLeft, FileText, Bot, Users, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products', allowedRoles: ['Admin'] },
    { to: '/categories', icon: Tags, label: 'Categories', allowedRoles: ['Admin'] },
    { to: '/stock', icon: ArrowRightLeft, label: 'Stock Management', allowedRoles: ['Admin', 'Staff'] },
    { to: '/orders', icon: FileText, label: 'Orders & Invoices' },
    { to: '/staff',     icon: Users,           label: 'Staff Management', allowedRoles: ['Admin'] },
    { to: '/reports',   icon: FileSpreadsheet, label: 'Reports',          allowedRoles: ['Admin'] },
    { to: '/assistant', icon: Bot,             label: 'AI Assistant',     allowedRoles: ['Admin'] },
  ];

  return (
    <>
      <div 
        className={`mobile-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Package size={18} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>StockSense</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          <p style={{ padding: '0 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
            Main Menu
          </p>

          {links.map((link) => {
            if (link.allowedRoles && !link.allowedRoles.includes(user?.role)) return null;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem',
                  borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                  color: isActive ? '#4f46e5' : '#475569',
                  background: isActive ? '#eef2ff' : 'transparent',
                  transition: 'all 0.2s'
                })}
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
