import { useEffect } from 'react';
import { X, Printer } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    const printContent = document.getElementById('printable-invoice');
    const originalContent = document.body.innerHTML;

    // Replace body content with invoice for printing
    document.body.innerHTML = printContent.innerHTML;
    
    // Add minimal styling to the body just for the print dialog
    document.body.style.padding = '20mm';
    document.body.style.fontFamily = 'Inter, sans-serif';
    
    window.print();
    
    // Restore original app
    document.body.innerHTML = originalContent;
    window.location.reload(); // Quickest way to restore react event listeners after body replacement
  };

  if (!order) return null;

  return (
    <div 
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '1rem'
      }}
    >
      <div 
        className="animate-fade-in-up" 
        style={{
          background: '#ffffff',
          width: '100%', maxWidth: '700px', maxHeight: '90vh',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Modal Toolbar */}
        <div style={{
          padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#f8fafc', borderRadius: '1rem 1rem 0 0'
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Invoice Viewer</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 0.75rem', background: '#ffffff', border: '1px solid #cbd5e1',
              borderRadius: '0.375rem', fontWeight: 500, color: '#475569', cursor: 'pointer'
            }}>
              <Printer size={16} /> Print
            </button>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
              padding: '0.375rem', borderRadius: '0.375rem', display: 'flex'
            }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div id="printable-invoice" style={{ maxWidth: '600px', margin: '0 auto', color: '#000', background: '#fff' }}>
            <style>
              {`
                @media print {
                  @page { margin: 0; }
                  body { margin: 1.6cm; }
                  .no-print { display: none !important; }
                }
              `}
            </style>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Neo-Inventory</h1>
                <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0', color: '#475569' }}>123 Tech Avenue, Silicon Valley</p>
                <p style={{ fontSize: '0.875rem', margin: 0, color: '#475569' }}>support@neoinventory.com</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 300, margin: 0, color: '#94a3b8' }}>INVOICE</h2>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.5rem' }}>{order.invoices?.invoicenumber || 'N/A'}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{new Date(order.orderdate).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Billed To</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{order.customername}</div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>Cashier: {order.users?.fullname}</div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '0.75rem 0', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Item</th>
                  <th style={{ padding: '0.75rem 0', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>Qty</th>
                  <th style={{ padding: '0.75rem 0', textAlign: 'right', fontSize: '0.875rem', color: '#64748b' }}>Price</th>
                  <th style={{ padding: '0.75rem 0', textAlign: 'right', fontSize: '0.875rem', color: '#64748b' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderitems?.map((item) => (
                  <tr key={item.orderitemid} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: 500 }}>{item.products?.productname || 'Unknown Product'}</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'center', fontSize: '0.875rem' }}>{item.quantity}</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'right', fontSize: '0.875rem' }}>₹{Number(item.unitprice).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600 }}>₹{Number(item.totalprice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '250px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Subtotal</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>₹{Number(order.totalamount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '2px solid #000' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>₹{Number(order.totalamount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              {order.status === 'CANCELLED' && <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>VOID - ORDER CANCELLED</div>}
              Thank you for your business!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
