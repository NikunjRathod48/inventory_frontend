import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

export default function UpdateThresholdModal({ product, currentThreshold, onClose, onSave }) {
  const [threshold, setThreshold] = useState(currentThreshold || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(product.productid, threshold);
      onClose();
    } catch (err) {
      setLoading(false);
    }
  };

  return createPortal(
    <div 
      onClick={onClose}
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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} color="#d97706" />
            Update Threshold
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Set the low stock warning threshold for <strong>{product.productname}</strong>. The system will alert you when stock falls below this level.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
              Warning Threshold
            </label>
            <input
              type="number"
              min="0"
              required
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value, 10) || 0)}
              className="input-field"
              style={{ background: '#f8fafc' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} disabled={loading} style={{
              flex: 1, padding: '0.625rem', background: '#ffffff', border: '1px solid #cbd5e1',
              borderRadius: '0.5rem', fontWeight: 500, color: '#475569', cursor: 'pointer'
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '0.625rem', background: '#4f46e5', border: 'none',
              borderRadius: '0.5rem', fontWeight: 500, color: '#ffffff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {loading ? <div className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}} /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
