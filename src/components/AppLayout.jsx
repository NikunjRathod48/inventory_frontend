import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', height: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
