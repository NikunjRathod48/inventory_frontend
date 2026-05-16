import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── tiny SVG icons ──────────────────────────────────────────────────────────
const EyeIcon = ({ show }) =>
  show ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

// ── Background decoration ────────────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-left orb */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-10%',
        width: '45vw', height: '45vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
      }} />
      {/* Bottom-right orb */}
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '50vw', height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%)',
      }} />
      {/* Centre streak */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent)',
      }} />
      {/* Grid dots */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
    </div>
  );
}

// ── Main login page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please try again.';
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
      <BackgroundOrbs />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
           className="animate-fade-in-up">

        {/* ── Logo ── */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #6366f1, #4338ca)',
            boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
            marginBottom: '1.25rem',
            color: 'white',
          }}>
            <div style={{ width: '32px', height: '32px' }}><BoxIcon /></div>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            StockSense
          </h1>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9375rem', color: '#64748b' }}>
            AI-Powered Inventory Management
          </p>
        </div>

        {/* ── Card ── */}
        <div className="glass" style={{ borderRadius: '1.25rem', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.375rem' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.75rem' }}>
            Sign in to your account to continue
          </p>

          {/* Server Error */}
          {serverError && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '0.625rem',
              marginBottom: '1.25rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
            }}>
              <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>⚠️</span>
              <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '1.125rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={form.email}
                onChange={handleChange}
                placeholder="admin@company.com"
                className={`input-field ${errors.email ? 'error' : ''}`}
              />
              {errors.email && (
                <p style={{ marginTop: '0.375rem', fontSize: '0.8125rem', color: '#ef4444' }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-field ${errors.password ? 'error' : ''}`}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#64748b', padding: '0.25rem',
                    width: '20px', height: '20px', display: 'flex', alignItems: 'center',
                  }}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p style={{ marginTop: '0.375rem', fontSize: '0.8125rem', color: '#ef4444' }}>{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={loading} id="login-submit-btn">
              {loading ? (
                <><div className="spinner" /><span>Signing in…</span></>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
          StockSense © {new Date().getFullYear()} — AI-Powered Inventory System
        </p>
      </div>
    </div>
  );
}
