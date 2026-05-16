import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar fixed to the left */}
      <Sidebar />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />
        
        <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          {/* Outlet renders the matched child route component */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
