import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handlePrint = () => {
    const printContent = document.getElementById('printable-invoice');
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    document.body.style.fontFamily = 'Inter, system-ui, sans-serif';
    document.body.style.background = '#fff';

    window.print();

    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (!order) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          overflow: 'hidden',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Toolbar */}
        <div
          className="no-print"
          style={{
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F9FAFB',
          }}
        >
          <h2
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0,
            }}
          >
            Invoice Preview
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.85rem',
                border: '1px solid #D1D5DB',
                background: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                color: '#111827',
              }}
            >
              <Printer size={16} />
              Print
            </button>

            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '6px',
                color: '#6B7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div
          style={{
            overflowY: 'auto',
            padding: '1.25rem',
            background: '#F3F4F6',
            flex: 1,
          }}
        >
          <div
            id="printable-invoice"
            style={{
              background: '#ffffff',
              maxWidth: '720px',
              margin: '0 auto',
              padding: '2rem',
              color: '#111827',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            <style>
              {`
                @media print {
                  @page {
                    margin: 18mm;
                  }

                  body {
                    margin: 0;
                    background: #fff;
                  }

                  .no-print {
                    display: none !important;
                  }
                }
              `}
            </style>

            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: '1rem',
                borderBottom: '1px solid #E5E7EB',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#111827',
                  }}
                >
                  Neo-Inventory
                </h1>

                <div
                  style={{
                    marginTop: '0.4rem',
                    color: '#6B7280',
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                  }}
                >
                  <div>123 Tech Avenue, Silicon Valley</div>
                  <div>support@neoinventory.com</div>
                  <div>+91 9876543210</div>
                </div>
              </div>

              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#111827',
                  }}
                >
                  TAX INVOICE
                </h2>

                <div
                  style={{
                    marginTop: '0.75rem',
                    display: 'grid',
                    gap: '0.35rem',
                    fontSize: '0.84rem',
                    color: '#374151',
                  }}
                >
                  <div>
                    <strong>Invoice:</strong>{' '}
                    {order.invoices?.invoicenumber || 'N/A'}
                  </div>

                  <div>
                    <strong>Date:</strong>{' '}
                    {new Date(order.orderdate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Section */}
            <div
              style={{
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#6B7280',
                  marginBottom: '0.45rem',
                }}
              >
                Bill To
              </div>

              <div
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {order.customername}
              </div>

              <div
                style={{
                  marginTop: '0.3rem',
                  fontSize: '0.84rem',
                  color: '#6B7280',
                }}
              >
                Cashier: {order.users?.fullname}
              </div>
            </div>

            {/* Table */}
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '1.5rem',
              }}
            >
              <thead
                style={{
                  background: '#F9FAFB',
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: '0.7rem',
                      textAlign: 'left',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#6B7280',
                    }}
                  >
                    Item
                  </th>

                  <th
                    style={{
                      padding: '0.7rem',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#6B7280',
                    }}
                  >
                    Qty
                  </th>

                  <th
                    style={{
                      padding: '0.7rem',
                      textAlign: 'right',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#6B7280',
                    }}
                  >
                    Price
                  </th>

                  <th
                    style={{
                      padding: '0.7rem',
                      textAlign: 'right',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#6B7280',
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {order.orderitems?.map((item) => (
                  <tr
                    key={item.orderitemid}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <td
                      style={{
                        padding: '0.8rem 0.7rem',
                        fontSize: '0.84rem',
                        color: '#111827',
                        fontWeight: 500,
                      }}
                    >
                      {item.products?.productname || 'Unknown Product'}
                    </td>

                    <td
                      style={{
                        padding: '0.8rem 0.7rem',
                        textAlign: 'center',
                        fontSize: '0.84rem',
                        color: '#374151',
                      }}
                    >
                      {item.quantity}
                    </td>

                    <td
                      style={{
                        padding: '0.8rem 0.7rem',
                        textAlign: 'right',
                        fontSize: '0.84rem',
                        color: '#374151',
                      }}
                    >
                      ₹{Number(item.unitprice).toFixed(2)}
                    </td>

                    <td
                      style={{
                        padding: '0.8rem 0.7rem',
                        textAlign: 'right',
                        fontSize: '0.84rem',
                        color: '#111827',
                        fontWeight: 600,
                      }}
                    >
                      ₹{Number(item.totalprice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div
              style={{
                width: '240px',
                marginLeft: 'auto',
                marginTop: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0',
                  fontSize: '0.84rem',
                  color: '#374151',
                }}
              >
                <span>Subtotal</span>

                <span style={{ fontWeight: 600 }}>
                  ₹{Number(order.totalamount).toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderTop: '1px solid #E5E7EB',
                  marginTop: '0.35rem',
                }}
              >
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  Total
                </span>

                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  ₹{Number(order.totalamount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #F3F4F6',
                textAlign: 'center',
                fontSize: '0.74rem',
                color: '#6B7280',
              }}
            >
              {order.status === 'CANCELLED' ? (
                <>
                  <div
                    style={{
                      marginBottom: '0.5rem',
                      color: '#DC2626',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ORDER CANCELLED
                  </div>

                  <div
                    style={{
                      color: '#9CA3AF',
                    }}
                  >
                    This invoice has been cancelled and is no longer valid.
                  </div>
                </>
              ) : (
                <div>Thank you for your business.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}