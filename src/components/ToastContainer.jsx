import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const CONFIGS = {
  success: { icon: CheckCircle, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', titleColor: '#065f46' },
  error:   { icon: XCircle,     color: '#dc2626', bg: '#fef2f2', border: '#fecaca', titleColor: '#991b1b' },
  warning: { icon: AlertTriangle,color: '#d97706', bg: '#fffbeb', border: '#fde68a', titleColor: '#92400e' },
  info:    { icon: Info,         color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', titleColor: '#3730a3' },
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => {
        const cfg = CONFIGS[t.type] || CONFIGS.info;
        const Icon = cfg.icon;

        return (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              minWidth: '300px',
              maxWidth: '400px',
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: '0.875rem',
              padding: '0.875rem 1rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.06)',
              pointerEvents: 'all',
              animation: t.exiting
                ? 'toastSlideOut 0.35s ease forwards'
                : 'toastSlideIn 0.35s ease forwards',
            }}
          >
            {/* Icon */}
            <div style={{ flexShrink: 0, marginTop: '1px' }}>
              <Icon size={20} color={cfg.color} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {t.title && (
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: cfg.titleColor,
                  marginBottom: t.message ? '0.2rem' : 0,
                }}>
                  {t.title}
                </div>
              )}
              {t.message && (
                <div style={{
                  fontSize: '0.8125rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}>
                  {t.message}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => dismiss(t.id)}
              style={{
                flexShrink: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '4px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#475569')}
              onMouseOut={(e)  => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(110%) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateX(0)    scale(1); }
          to   { opacity: 0; transform: translateX(110%) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
