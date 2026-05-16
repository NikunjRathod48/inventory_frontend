import { useState, useEffect } from 'react';
import { Layers, ArrowRightLeft, Clock, Search, AlertCircle, TrendingDown } from 'lucide-react';
import { stockService } from '../services/stockService';
import AdjustStockModal from '../components/AdjustStockModal';
import StockHistoryModal from '../components/StockHistoryModal';
import { useToast } from '../context/ToastContext';

export default function StockPage() {
  const { toast } = useToast();
  const [stocks, setStocks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal states
  const [adjustModalProduct, setAdjustModalProduct] = useState(null);
  const [historyModalProduct, setHistoryModalProduct] = useState(null);

  // Overview stats
  const [alerts, setAlerts] = useState({ lowStockCount: 0, outOfStockCount: 0 });

  const fetchStock = async () => {
    setLoading(true);
    try {
      const response = await stockService.getAll({ page, limit, search, lowStockOnly });
      setStocks(response.data);
      setTotal(response.meta.total);
    } catch (err) {
      console.error('Failed to fetch stock', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const data = await stockService.getAlerts();
      setAlerts(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchStock();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, lowStockOnly]);

  const handleUpdateThreshold = async (productId, currentThreshold) => {
    const newThreshold = window.prompt('Enter new low stock warning threshold:', currentThreshold);
    if (newThreshold === null) return;
    const parsed = parseInt(newThreshold, 10);
    if (isNaN(parsed) || parsed < 0) {
      toast.warning('Invalid Input', 'Please enter a valid positive number.');
      return;
    }
    try {
      await stockService.updateThreshold(productId, parsed);
      fetchStock();
      toast.success('Threshold Updated', `Low stock threshold set to ${parsed}.`);
    } catch (err) {
      toast.error('Update Failed', 'Failed to update threshold.');
    }
  };

  const handleAdjustSave = async (payload) => {
    try {
      await stockService.adjust(payload);
      fetchStock();
      fetchAlerts();
      toast.success('Stock Adjusted', 'Stock level updated successfully.');
    } catch (err) {
      toast.error('Adjustment Failed', err.response?.data?.message || 'Failed to adjust stock.');
      throw err; // re-throw so modal can handle its own state
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={24} color="#4f46e5" />
            Stock Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Control inventory levels, track movements, and set alerts.</p>
        </div>
      </div>

      {/* Alert Banners */}
      {(alerts.lowStockCount > 0 || alerts.outOfStockCount > 0) && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          {alerts.outOfStockCount > 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', color: '#dc2626' }}>
              <AlertCircle size={24} />
              <div>
                <div style={{ fontWeight: 600 }}>Out of Stock Alert</div>
                <div style={{ fontSize: '0.875rem' }}>{alerts.outOfStockCount} items have completely run out of stock!</div>
              </div>
            </div>
          )}
          {alerts.lowStockCount > 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.75rem', color: '#d97706' }}>
              <TrendingDown size={24} />
              <div>
                <div style={{ fontWeight: 600 }}>Low Stock Warning</div>
                <div style={{ fontSize: '0.875rem' }}>{alerts.lowStockCount} items are running low and need reordering.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field"
            style={{ paddingLeft: '2.5rem', background: '#f8fafc' }}
          />
        </div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: '#475569' }}>
          <input 
            type="checkbox" 
            checked={lowStockOnly} 
            onChange={(e) => { setLowStockOnly(e.target.checked); setPage(1); }}
            style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
          />
          Show Low Stock Only
        </label>
      </div>

      {/* Table */}
      <div style={{ flex: 1, background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Current Stock</th>
                <th style={thStyle}>Warning Threshold</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><div className="spinner" style={{ borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} /></div>
                    Loading stock data...
                  </td>
                </tr>
              ) : stocks.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No stock records found.
                  </td>
                </tr>
              ) : (
                stocks.map((s) => {
                  const p = s.products;
                  const threshold = s.lowstockthreshold || 5;
                  const isOutOfStock = s.quantity === 0;
                  const isLowStock = !isOutOfStock && s.quantity <= threshold;

                  return (
                    <tr key={s.stockid} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.productname}</div>
                        {p.barcode && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.barcode}</div>}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                          {p.categories?.categoryname || 'Unknown'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 700, color: isOutOfStock ? '#dc2626' : (isLowStock ? '#d97706' : '#0f172a') }}>
                          {s.quantity}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#64748b' }}>{threshold}</span>
                          <button onClick={() => handleUpdateThreshold(s.productid, threshold)} style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                            Edit
                          </button>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {isOutOfStock ? (
                          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Out of Stock</span>
                        ) : isLowStock ? (
                          <span style={{ background: '#fffbeb', color: '#d97706', padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Low Stock</span>
                        ) : (
                          <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Healthy</span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => setAdjustModalProduct({ ...p, stock: [s] })} className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', width: 'auto' }}>
                            <ArrowRightLeft size={14} /> Adjust
                          </button>
                          <button onClick={() => setHistoryModalProduct(p)} style={actionBtnStyle} title="View History">
                            <Clock size={16} color="#64748b" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Showing page {page} of {totalPages} ({total} items)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ ...pageBtnStyle, opacity: page === 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ ...pageBtnStyle, opacity: page === totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {adjustModalProduct && (
        <AdjustStockModal
          product={adjustModalProduct}
          onClose={() => setAdjustModalProduct(null)}
          onSave={handleAdjustSave}
        />
      )}

      {historyModalProduct && (
        <StockHistoryModal
          product={historyModalProduct}
          onClose={() => setHistoryModalProduct(null)}
        />
      )}
    </div>
  );
}

const thStyle = { padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', color: '#334155' };
const actionBtnStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.4rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex' };
const pageBtnStyle = { background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', cursor: 'pointer' };
