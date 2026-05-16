import { useState, useEffect } from 'react';
import { Users, Plus, Mail, Shield, CheckCircle, Search } from 'lucide-react';
import { usersService } from '../services/usersService';
import AddStaffModal from '../components/AddStaffModal';

export default function StaffPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);
  const limit = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await usersService.getAll({ page, limit, search });
      setUsers(response.data);
      setTotal(response.meta.total);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  const handleSaveStaff = async (payload) => {
    await usersService.register(payload);
    fetchUsers();
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const getRoleBadge = (role) => {
    let bg = '#f1f5f9';
    let color = '#475569';
    if (role === 'Admin') { bg = '#fef2f2'; color = '#dc2626'; }
    else if (role === 'Manager') { bg = '#fffbeb'; color = '#d97706'; }
    else if (role === 'Cashier') { bg = '#ecfdf5'; color = '#059669'; }

    return (
      <span style={{
        background: bg, color: color,
        padding: '0.25rem 0.625rem', borderRadius: '100px',
        fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.375rem'
      }}>
        <Shield size={12} /> {role}
      </span>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={24} color="#4f46e5" />
            Staff Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage system access and employee accounts.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ width: 'auto' }}
        >
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search staff by name or email..."
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
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><div className="spinner" style={{ borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} /></div>
                    Loading staff members...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No staff records found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.userid} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.fullname}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b', fontSize: '0.875rem' }}>
                        <Mail size={14} /> {u.email}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {getRoleBadge(u.role)}
                    </td>
                    <td style={tdStyle}>
                      {u.isactive ? (
                        <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
                          <CheckCircle size={14} /> Active
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 500 }}>Inactive</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {new Date(u.createdat).toLocaleDateString()}
                      </span>
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
            Showing page {page} of {totalPages} ({total} users)
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

      {isAddModalOpen && (
        <AddStaffModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveStaff}
        />
      )}
    </div>
  );
}

const thStyle = { padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', color: '#334155' };
const pageBtnStyle = { background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', cursor: 'pointer' };
