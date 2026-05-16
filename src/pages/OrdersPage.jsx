import { useState, useEffect } from 'react';
import { FileText, Plus, Search, FileBadge, XCircle } from 'lucide-react';
import { ordersService } from '../services/ordersService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CreateOrderModal from '../components/CreateOrderModal';
import InvoiceModal from '../components/InvoiceModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const limit = 10;

  const { isAdmin, isManager } = useAuth();
  const { toast } = useToast();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [cancelModalState, setCancelModalState] = useState({ isOpen: false, id: null, loading: false });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersService.getAll({ page, limit, search });
      setOrders(response.data);
      setTotal(response.meta.total);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  const handleCancelClick = (id) => {
    setCancelModalState({ isOpen: true, id, loading: false });
  };

  const confirmCancel = async () => {
    setCancelModalState(prev => ({ ...prev, loading: true }));
    try {
      await ordersService.cancel(cancelModalState.id);
      setCancelModalState({ isOpen: false, id: null, loading: false });
      fetchOrders();
      toast.success('Order Cancelled', 'Stock has been returned to inventory.');
    } catch (err) {
      toast.error('Cancel Failed', err.response?.data?.message || 'Failed to cancel order.');
      setCancelModalState(prev => ({ ...prev, loading: false }));
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusBadge = (status) => {
    if (status === 'CONFIRMED') {
      return <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Completed</span>;
    }
    if (status === 'CANCELLED') {
      return <span style={{ background: '#fef2f2', color: '#dc2626', padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Cancelled</span>;
    }
    return <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={24} color="#4f46e5" />
            Orders & Invoices
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Process point-of-sale transactions and view receipts.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ width: 'auto' }}
        >
          <Plus size={18} /> New Order
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by customer name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field"
            style={{ paddingLeft: '2.5rem', background: '#f8fafc' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Items</th>
                <th style={thStyle}>Total Amount</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><div className="spinner" style={{ borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} /></div>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.orderid} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500, color: '#334155' }}>
                        {new Date(o.orderdate).toLocaleString()}
                      </div>
                      {o.invoices && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{o.invoices.invoicenumber}</div>}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{o.customername}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>By: {o.users?.fullname}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#64748b' }}>{o.orderitems?.length || 0} items</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{Number(o.totalamount).toFixed(2)}</span>
                    </td>
                    <td style={tdStyle}>
                      {getStatusBadge(o.status)}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => setSelectedInvoice(o)}
                          style={{ background: '#f1f5f9', color: '#4f46e5', border: 'none', padding: '0.375rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                          title="View Invoice"
                        >
                          <FileBadge size={16} />
                        </button>
                        {(isAdmin || isManager) && o.status !== 'CANCELLED' && (
                          <button 
                            onClick={() => handleCancelClick(o.orderid)}
                            style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '0.375rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                            title="Cancel Order"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Showing page {page} of {totalPages} ({total} orders)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...pageBtnStyle, opacity: page === 1 ? 0.5 : 1 }}>
              Previous
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...pageBtnStyle, opacity: page === totalPages ? 0.5 : 1 }}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals placeholders */}
      {isAddModalOpen && <CreateOrderModal onClose={() => setIsAddModalOpen(false)} onComplete={(newOrder) => { fetchOrders(); setSelectedInvoice(newOrder); }} />}
      {selectedInvoice && <InvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
      
      {cancelModalState.isOpen && (
        <DeleteConfirmModal
          title="Cancel Order"
          message="Are you sure you want to cancel this order? Stock will be returned to inventory. This cannot be undone."
          onConfirm={confirmCancel}
          onCancel={() => setCancelModalState({ isOpen: false, id: null, loading: false })}
          loading={cancelModalState.loading}
        />
      )}
    </div>
  );
}

const thStyle = { padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', color: '#334155' };
const pageBtnStyle = { background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', cursor: 'pointer' };
