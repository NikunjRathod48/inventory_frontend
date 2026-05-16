import { useState, useEffect } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function AddStaffModal({ onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    role: 'Staff',
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
    setLoading(true);

    try {
      await onSave({
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create staff account.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      setLoading(false);
    }
  };

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
          width: '100%', maxWidth: '450px',
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={20} color="#4f46e5" />
              Add New Staff
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.125rem' }}>
              Create an account for a new employee.
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

          <form id="add-staff-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input required type="text" name="fullname" value={form.fullname} onChange={handleChange} className="input-field" placeholder="e.g. John Doe" />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input required type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="john@company.com" />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="Set a secure password" 
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                <option value="Admin">Admin (Full Access)</option>
                <option value="Manager">Manager (Manage Products & Stock)</option>
                <option value="Staff">Staff (View Only)</option>
                <option value="Cashier">Cashier (Process Orders)</option>
              </select>
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
          <button type="submit" form="add-staff-form" disabled={loading} style={{
            padding: '0.625rem 1.25rem', background: '#4f46e5', border: 'none',
            borderRadius: '0.5rem', fontWeight: 500, color: '#ffffff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
          }}>
            {loading ? <div className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}} /> : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem'
};
