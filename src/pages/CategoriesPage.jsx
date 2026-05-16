import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tags } from 'lucide-react';
import { categoriesService } from '../services/categoriesService';
import CategoryModal from '../components/CategoryModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useToast } from '../context/ToastContext';

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, id: null, loading: false });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (payload, id) => {
    try {
      if (id) {
        await categoriesService.update(id, payload);
        toast.success('Category Updated', `Category updated successfully.`);
      } else {
        await categoriesService.create(payload);
        toast.success('Category Created', 'New category added successfully.');
      }
      fetchCategories();
    } catch (err) {
      toast.error('Save Failed', err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModalState({ isOpen: true, id, loading: false });
  };

  const confirmDelete = async () => {
    setDeleteModalState(prev => ({ ...prev, loading: true }));
    try {
      await categoriesService.delete(deleteModalState.id);
      setDeleteModalState({ isOpen: false, id: null, loading: false });
      fetchCategories();
      toast.success('Category Deleted', 'Category removed successfully.');
    } catch (err) {
      toast.error('Delete Failed', err.response?.data?.message || 'Failed to delete category.');
      setDeleteModalState(prev => ({ ...prev, loading: false }));
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tags size={24} color="#4f46e5" />
            Categories
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage your product classifications.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary" style={{ width: 'auto' }}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Category Name</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><div className="spinner" style={{ borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} /></div>
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No categories found. Click 'Add Category' to create one.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.categoryid} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                    <td style={tdStyle}>
                      <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>#{c.categoryid}</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.categoryname}</div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(c)} style={actionBtnStyle} title="Edit Category">
                          <Edit2 size={16} color="#4f46e5" />
                        </button>
                        <button onClick={() => handleDeleteClick(c.categoryid)} style={actionBtnStyle} title="Delete Category">
                          <Trash2 size={16} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
        />
      )}

      {deleteModalState.isOpen && (
        <DeleteConfirmModal
          title="Delete Category"
          message="Are you sure you want to delete this category? You cannot delete categories that are linked to products."
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
