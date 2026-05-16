import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Package, Tags,
  ArrowRightLeft, ShoppingCart, Users, FileText, History, CheckCircle
} from 'lucide-react';
import { reportsService } from '../services/reportsService';
import { useToast } from '../context/ToastContext';

const REPORT_SHEETS = [
  { icon: Package,         color: '#4f46e5', bg: '#eef2ff', label: 'Products',           desc: 'All products with price, cost, barcode & stock level' },
  { icon: Tags,            color: '#0891b2', bg: '#ecfeff', label: 'Categories',          desc: 'Complete list of product categories' },
  { icon: ArrowRightLeft,  color: '#059669', bg: '#ecfdf5', label: 'Stock',               desc: 'Current quantities with low-stock highlights' },
  { icon: ShoppingCart,    color: '#ca8a04', bg: '#fefce8', label: 'Orders',              desc: 'All orders with status, customer and invoice number' },
  { icon: FileText,        color: '#7c3aed', bg: '#f5f3ff', label: 'Order Items',         desc: 'Line-level breakdown of every order' },
  { icon: Users,           color: '#db2777', bg: '#fdf2f8', label: 'Staff',               desc: 'All users, roles and account status' },
  { icon: History,         color: '#ea580c', bg: '#fff7ed', label: 'Stock Transactions',  desc: 'Last 500 stock adjustments with audit trail' },
];

export default function ReportsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await reportsService.downloadReport();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      toast.success('Report Downloaded', 'Your Excel report has been saved successfully.');
    } catch (err) {
      const msg = err?.message || 'Failed to generate report. Please try again.';
      setError(msg);
      toast.error('Download Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show:  { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <FileSpreadsheet size={24} color="#4f46e5" />
            Reports &amp; Export
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Download a complete snapshot of all inventory data as a formatted Excel file.
          </p>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.875rem 1.75rem',
            background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff', border: 'none', borderRadius: '0.75rem',
            fontWeight: 700, fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'; }}}
          onMouseOut={(e)  => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }} />
              Generating…
            </>
          ) : success ? (
            <>
              <CheckCircle size={18} />
              Downloaded!
            </>
          ) : (
            <>
              <Download size={18} />
              Download Excel Report
            </>
          )}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          padding: '0.875rem 1.25rem',
          background: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '0.75rem',
          color: '#b91c1c', fontSize: '0.875rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Info card ── */}
      <div style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
        border: '1px solid #c7d2fe', borderRadius: '1rem',
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'flex-start', gap: '1rem',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #4338ca)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}>
          <FileSpreadsheet size={20} />
        </div>
        <div>
          <p style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: '0.25rem' }}>About this report</p>
          <p style={{ fontSize: '0.875rem', color: '#4338ca', lineHeight: 1.6 }}>
            The exported <strong>.xlsx</strong> file contains <strong>{REPORT_SHEETS.length} worksheets</strong> — one for each data domain.
            Low-stock rows are highlighted in red. All monetary values are in ₹. Stock transactions are capped at the latest 500 records.
          </p>
        </div>
      </div>

      {/* ── Sheets grid ── */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
          Included Worksheets
        </h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {REPORT_SHEETS.map((sheet, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              style={{
                background: '#fff',
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: sheet.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <sheet.icon size={22} color={sheet.color} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                  {sheet.label}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                  {sheet.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
