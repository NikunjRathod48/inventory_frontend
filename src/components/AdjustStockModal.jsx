import { useState, useEffect } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';

export default function AdjustStockModal({ product, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    transactiontype: 'PURCHASE',
    quantity: '',
    notes: '',
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const qty = parseInt(form.quantity, 10);
    if (!qty || qty < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        productid: product.productid,
        transactiontype: form.transactiontype,
        quantity: qty,
        notes: form.notes || undefined,
      });
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to adjust stock.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      setLoading(false);
    }
  };

  const isAddition = ['PURCHASE', 'RETURN', 'CANCEL_ORDER'].includes(form.transactiontype);

  return (
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
          width: '100%', maxWidth: '480px',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
              Adjust Stock
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.125rem' }}>
              {product.productname} (Current: {product.stock?.[0]?.quantity || 0})
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
        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form id="adjust-stock-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={labelStyle}>Reason / Transaction Type</label>
              <select name="transactiontype" value={form.transactiontype} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                <optgroup label="Add Stock (+)">
                  <option value="PURCHASE">Purchase (New Stock)</option>
                  <option value="RETURN">Customer Return</option>
                  <option value="CANCEL_ORDER">Cancelled Order</option>
                </optgroup>
                <optgroup label="Remove Stock (-)">
                  <option value="SALE">Direct Sale</option>
                  <option value="ADJUSTMENT">Manual Adjustment (Loss/Damage)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Quantity</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                  fontWeight: 600, color: isAddition ? '#059669' : '#dc2626',
                  fontSize: '1.125rem'
                }}>
                  {isAddition ? '+' : '-'}
                </div>
                <input 
                  required 
                  type="number"
                  min="1"
                  name="quantity" 
                  value={form.quantity} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="Enter quantity"
                  style={{ paddingLeft: '2.5rem', fontSize: '1.125rem', fontWeight: 600 }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Notes (Optional)</label>
              <textarea 
                name="notes" 
                value={form.notes} 
                onChange={handleChange} 
                className="input-field" 
                rows="2" 
                placeholder="Reason for adjustment..." 
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          background: '#f8fafc', borderRadius: '0 0 1rem 1rem'
        }}>
          <button type="button" onClick={onClose} disabled={loading} style={{
            padding: '0.625rem 1.25rem', background: '#ffffff', border: '1px solid #cbd5e1',
            borderRadius: '0.5rem', fontWeight: 500, color: '#475569', cursor: 'pointer'
          }}>
            Cancel
          </button>
          <button type="submit" form="adjust-stock-form" disabled={loading} style={{
            padding: '0.625rem 1.25rem', background: '#4f46e5', border: 'none',
            borderRadius: '0.5rem', fontWeight: 500, color: '#ffffff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
          }}>
            {loading ? <div className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}} /> : <ArrowRightLeft size={18} />}
            Confirm Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem'
};
