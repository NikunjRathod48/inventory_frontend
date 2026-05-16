import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return createPortal(
    <div 
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '1rem'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in-up" 
        style={{
          background: '#ffffff',
          width: '100%', maxWidth: '400px',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#fef2f2', color: '#dc2626',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <AlertTriangle size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
            {title || 'Confirm Deletion'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {message || 'Are you sure you want to perform this action? This cannot be undone.'}
          </p>
        </div>

        <div style={{
          padding: '1rem 1.5rem',
          background: '#f8fafc', borderTop: '1px solid #e2e8f0',
          display: 'flex', gap: '0.75rem', justifyContent: 'flex-end'
        }}>
          <button onClick={onCancel} disabled={loading} style={{
            padding: '0.625rem 1.25rem', background: '#ffffff', border: '1px solid #cbd5e1',
            borderRadius: '0.5rem', fontWeight: 500, color: '#475569', cursor: 'pointer',
            flex: 1
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            padding: '0.625rem 1.25rem', background: '#dc2626', border: 'none',
            borderRadius: '0.5rem', fontWeight: 500, color: '#ffffff', cursor: 'pointer',
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}>
            {loading ? <div className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}} /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
