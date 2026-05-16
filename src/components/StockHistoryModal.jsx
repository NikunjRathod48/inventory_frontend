import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock } from 'lucide-react';
import { stockService } from '../services/stockService';

export default function StockHistoryModal({ product, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // For simplicity, we just fetch the latest 50 logs. Pagination can be added if needed.
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await stockService.getHistory(product.productid, { page, limit: 50 });
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch stock history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [product.productid, page, onClose]);

  const getChangeBadge = (type, qty) => {
    const isAddition = ['PURCHASE', 'RETURN', 'CANCEL_ORDER'].includes(type);
    return (
      <span style={{ 
        color: isAddition ? '#059669' : '#dc2626', 
        background: isAddition ? '#d1fae5' : '#fee2e2',
        padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem'
      }}>
        {isAddition ? '+' : '-'}{qty}
      </span>
    );
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
          width: '100%', maxWidth: '700px',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="#64748b" />
              Stock History
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.125rem' }}>
              {product.productname}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
            padding: '0.25rem', borderRadius: '0.375rem', display: 'flex'
          }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th style={thStyle}>Date & Time</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Change</th>
                <th style={thStyle}>Final Qty</th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><div className="spinner" style={{ borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} /></div>
                    Loading history...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No stock history found for this product.
                  </td>
                </tr>
              ) : (
                history.map((log) => (
                  <tr key={log.transactionid} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>
                      {new Date(log.createdat).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {log.transactiontype}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {getChangeBadge(log.transactiontype, log.quantity)}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>
                      {log.newquantity}
                    </td>
                    <td style={tdStyle}>
                      {log.users?.fullname || 'System'}
                    </td>
                    <td style={{ ...tdStyle, color: '#64748b', fontSize: '0.8rem', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>,
    document.body
  );
}

const thStyle = { padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', color: '#334155' };
