import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Box } from 'lucide-react';
import { productsService } from '../services/productsService';
import ProductModal from '../components/ProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, id: null, loading: false });

  const fetchProducts = async () => {
    try {
      // Added status: 'all' to fetch both active and inactive products
      const response = await productsService.getAll({ page, limit, search, status: 'all' });
      setProducts(response.data);
      setTotal(response.meta.total);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Show loader immediately when search or page changes
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms debounce
    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  const handleSaveProduct = async (payload, id) => {
    if (id) {
      await productsService.update(id, payload);
    } else {
      await productsService.create(payload);
    }
    fetchProducts();
  };

  const handleDeleteClick = (id) => {
    setDeleteModalState({ isOpen: true, id, loading: false });
  };

  const confirmDelete = async () => {
    setDeleteModalState(prev => ({ ...prev, loading: true }));
    try {
      await productsService.delete(deleteModalState.id);
      setDeleteModalState({ isOpen: false, id: null, loading: false });
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
      setDeleteModalState(prev => ({ ...prev, loading: false }));
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box size={24} color="#4f46e5" />
            Products
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage your inventory items and pricing.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary" style={{ width: 'auto' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search products by name or barcode..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field"
            style={{ paddingLeft: '2.5rem', background: '#f8fafc' }}
          />
        </div>
        {/* Add Category Filter Dropdown here in the future if needed */}
      </div>

      {/* Table */}
      <div style={{ flex: 1, background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={thStyle}>Product Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Current Stock</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><div className="spinner" style={{ borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} /></div>
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const stockQty = p.stock?.quantity || 0;
                  const lowStock = stockQty <= (p.stock?.lowstockthreshold || 5);

                  return (
                    <tr key={p.productid} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.productname}</div>
                        {p.barcode && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.barcode}</div>}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.625rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {p.categories?.categoryname || 'Unknown'}
                        </span>
                      </td>
                      <td style={tdStyle}>₹{Number(p.price).toFixed(2)}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: lowStock ? '#dc2626' : '#059669' }}>{stockQty}</span>
                          {lowStock && <span style={{ fontSize: '0.7rem', background: '#fef2f2', color: '#dc2626', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Low</span>}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: p.isactive ? '#059669' : '#dc2626', fontSize: '0.875rem' }}>
                          {p.isactive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => openEditModal(p)} style={actionBtnStyle}>
                            <Edit2 size={16} color="#4f46e5" />
                          </button>
                          <button onClick={() => handleDeleteClick(p.productid)} style={actionBtnStyle}>
                            <Trash2 size={16} color="#dc2626" />
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
            Showing page {page} of {totalPages} ({total} total products)
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

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

      {deleteModalState.isOpen && (
        <DeleteConfirmModal
          title="Delete Product"
          message="Are you sure you want to delete this product? This action will set it to inactive."
          loading={deleteModalState.loading}
          onCancel={() => setDeleteModalState({ isOpen: false, id: null, loading: false })}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

const thStyle = { padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', color: '#334155' };
const actionBtnStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.4rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex' };
const pageBtnStyle = { background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', cursor: 'pointer' };
