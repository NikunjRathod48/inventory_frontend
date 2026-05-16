import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, Search, Plus, Minus, Trash2 } from 'lucide-react';
import { productsService } from '../services/productsService';
import { ordersService } from '../services/ordersService';

export default function CreateOrderModal({ onClose, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await productsService.getAll({ limit: 50, search });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setProductsLoading(false);
      }
    };
    const delay = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const addToCart = (product) => {
    const existing = cart.find(c => c.productid === product.productid);
    if (existing) {
      setCart(cart.map(c => c.productid === product.productid ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(c => {
      if (c.productid === id) {
        const newQ = c.quantity + delta;
        return newQ > 0 ? { ...c, quantity: newQ } : c;
      }
      return c;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.productid !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return setError('Cart is empty');
    setLoading(true);
    setError('');
    try {
      const payload = {
        customername: customerName,
        items: cart.map(c => ({
          productid: c.productid,
          quantity: c.quantity,
          unitprice: Number(c.price)
        }))
      };
      const newOrder = await ordersService.create(payload);
      onComplete(newOrder); // Pass the new order so we can show invoice
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create order';
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
          width: '100%', maxWidth: '900px', height: '80vh',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={20} color="#4f46e5" />
              Point of Sale
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
            padding: '0.25rem', borderRadius: '0.375rem', display: 'flex'
          }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Left side: Products List */}
          <div style={{ flex: '1 1 60%', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text" placeholder="Search products by name or barcode..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="input-field" style={{ paddingLeft: '2.5rem', background: '#ffffff' }}
                />
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', alignContent: 'start' }}>
              {productsLoading ? (
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '3rem', color: '#64748b' }}>
                  <div className="spinner" style={{ borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} />
                </div>
              ) : products.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.875rem' }}>
                  No products found.
                </div>
              ) : (
                products.map(p => (
                  <div 
                    key={p.productid} 
                  onClick={() => addToCart(p)}
                  style={{ 
                    border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', cursor: 'pointer',
                    transition: 'border-color 0.2s, box-shadow 0.2s', background: '#fff'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(99, 102, 241, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{p.productname}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>{p.categories?.categoryname || 'No category'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#4f46e5' }}>₹{p.price}</span>
                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', color: '#475569' }}>
                      <Plus size={12} /> Add
                    </span>
                  </div>
                </div>
              )))}
            </div>
          </div>

          {/* Right side: Cart */}
          <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem' }}>Customer Name</label>
              <input 
                type="text" className="input-field" 
                value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
              />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '3rem', fontSize: '0.875rem' }}>
                  <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  Cart is empty
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {cart.map(item => (
                    <div key={item.productid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{item.productname}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{item.price} each</div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
                          <button onClick={() => updateQuantity(item.productid, -1)} style={{ padding: '0.25rem', border: 'none', background: 'none', cursor: 'pointer', color: '#475569' }}><Minus size={14}/></button>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, width: '24px', textAlign: 'center', color: item.quantity > (item.stock?.quantity || 0) ? '#dc2626' : '#0f172a' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productid, 1)} style={{ padding: '0.25rem', border: 'none', background: 'none', cursor: 'pointer', color: '#475569' }}><Plus size={14}/></button>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', width: '60px', textAlign: 'right' }}>
                          ₹{(Number(item.price) * item.quantity).toFixed(2)}
                        </div>
                        <button onClick={() => removeFromCart(item.productid)} style={{ padding: '0.25rem', border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            <div style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
              {error && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.75rem', textAlign: 'center' }}>{error}</div>}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>₹{totalAmount.toFixed(2)}</span>
              </div>
              
              {cart.some(item => item.quantity > (item.stock?.quantity || 0)) && (
                <div style={{ color: '#dc2626', fontSize: '0.8125rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 600, background: '#fef2f2', padding: '0.5rem', borderRadius: '0.375rem' }}>
                  Insufficient stock for one or more items.
                </div>
              )}
              
              <button 
                onClick={handleSubmit} 
                disabled={loading || cart.length === 0 || cart.some(item => item.quantity > (item.stock?.quantity || 0))} 
                className="btn-primary" 
                style={{ padding: '1rem', opacity: (loading || cart.length === 0 || cart.some(item => item.quantity > (item.stock?.quantity || 0))) ? 0.6 : 1 }}
              >
                {loading ? 'Processing...' : 'Complete Checkout'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
