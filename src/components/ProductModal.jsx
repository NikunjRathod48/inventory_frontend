import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import { categoriesService } from '../services/categoriesService';

export default function ProductModal({ product, onClose, onSave }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    productname: product?.productname || '',
    categoryid: product?.categoryid || '',
    description: product?.description || '',
    price: product?.price || '',
    costprice: product?.costprice || '',
    barcode: product?.barcode || '',
  });

  useEffect(() => {
    // Fetch categories for the dropdown
    categoriesService.getAll()
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories', err));
      
    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.productname || !form.categoryid || !form.price) {
      setError('Name, Category, and Price are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productname: form.productname,
        categoryid: Number(form.categoryid),
        description: form.description || undefined,
        price: Number(form.price),
        costprice: form.costprice ? Number(form.costprice) : undefined,
        barcode: form.barcode || undefined,
      };

      await onSave(payload, product?.productid);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save product.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
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
          width: '100%', maxWidth: '560px',
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
            padding: '0.25rem', borderRadius: '0.375rem', display: 'flex'
          }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {error && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form id="product-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input required name="productname" value={form.productname} onChange={handleChange} className="input-field" placeholder="E.g. Wireless Mouse" />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select required name="categoryid" value={form.categoryid} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.categoryid} value={cat.categoryid}>{cat.categoryname}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows="2" placeholder="Product details..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Selling Price ($) *</label>
                <input required type="number" step="0.01" name="price" min={0} value={form.price} onChange={handleChange} className="input-field" placeholder="0.00" />
              </div>
              <div>
                <label style={labelStyle}>Cost Price ($)</label>
                <input type="number" step="0.01" name="costprice" min={0} value={form.costprice} onChange={handleChange} className="input-field" placeholder="0.00" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Barcode</label>
              <input name="barcode" value={form.barcode} onChange={handleChange} className="input-field" placeholder="Scan or enter barcode" />
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
          <button type="submit" form="product-form" disabled={loading} style={{
            padding: '0.625rem 1.25rem', background: '#4f46e5', border: 'none',
            borderRadius: '0.5rem', fontWeight: 500, color: '#ffffff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
          }}>
            {loading ? <div className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}} /> : <Save size={18} />}
            {product ? 'Update Product' : 'Create Product'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem'
};
