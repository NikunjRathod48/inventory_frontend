import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      background: '#f8fafc',
    }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
        <div style={{
          position: 'absolute', top: '-15%', left: '-10%',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '520px',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
        }}
      >
        {/* Giant 404 */}
        <div style={{ position: 'relative' }}>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{
              fontSize: 'clamp(7rem, 20vw, 10rem)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              userSelect: 'none',
            }}
          >
            404
          </motion.div>
          {/* Glow behind number */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: -1,
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }} />
        </div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #eef2ff, #c7d2fe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #c7d2fe',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
          }}
        >
          <Search size={32} color="#4f46e5" />
        </motion.div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
            Page Not Found
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '380px' }}>
            The page{' '}
            <code style={{
              background: '#eef2ff', color: '#4f46e5', padding: '0.1rem 0.4rem',
              borderRadius: '0.3rem', fontSize: '0.875rem', fontFamily: 'monospace',
            }}>
              {location.pathname}
            </code>
            {' '}doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8125rem 1.5rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff', borderRadius: '0.75rem',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.35)'; }}
          >
            <Home size={17} />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8125rem 1.5rem',
              background: '#ffffff', color: '#475569', borderRadius: '0.75rem',
              border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.9375rem',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = '#4f46e5'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
