import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, AlertTriangle, ShoppingCart, IndianRupee, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../services/dashboardService';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  
  const [metrics, setMetrics] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, recentRes] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getRecentActivity()
        ]);
        
        setMetrics(metricsRes);
        setRecentOrders(recentRes.recentOrders);
        setLowStockItems(recentRes.lowStockItems);

        if (isAdmin) {
          const chartRes = await dashboardService.getSalesChart();
          setSalesData(chartRes);
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderColor: '#e2e8f0', borderTopColor: '#4f46e5' }} />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Dashboard Overview</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Welcome back, {user?.fullname}. Here's what's happening today.</p>
      </div>

      {/* Metrics Grid */}
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}
      >
        <MetricCard 
          title="Total Products" 
          value={metrics?.totalProducts || 0} 
          icon={<Package size={24} color="#4f46e5" />} 
          bg="#eef2ff" 
          variants={itemVariants} 
        />
        <MetricCard 
          title="Today's Orders" 
          value={metrics?.todaysOrders || 0} 
          icon={<ShoppingCart size={24} color="#059669" />} 
          bg="#ecfdf5" 
          variants={itemVariants} 
        />
        <MetricCard 
          title="Low Stock Alerts" 
          value={metrics?.lowStockCount || 0} 
          icon={<AlertTriangle size={24} color="#dc2626" />} 
          bg="#fef2f2" 
          variants={itemVariants} 
        />
        {isAdmin && (
          <MetricCard 
            title="Today's Revenue" 
            value={`₹${(metrics?.todaysRevenue || 0).toLocaleString()}`} 
            icon={<IndianRupee size={24} color="#ca8a04" />} 
            bg="#fefce8" 
            variants={itemVariants} 
          />
        )}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '2fr 1fr' : '1fr', gap: '1.5rem', marginTop: '1rem' }}>
        
        {/* Left Column: Chart (If Admin) & Recent Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <TrendingUp size={20} color="#4f46e5" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>Sales Trends (Last 7 Days)</h2>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`₹${value}`, 'Revenue']}
                    />
                    <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isAdmin ? 0.4 : 0.2 }}
            style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem' }}>Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No recent orders found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentOrders.map(order => (
                  <div key={order.orderid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{order.customername}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {new Date(order.orderdate).toLocaleString()} • {order.invoices?.invoicenumber || 'No Invoice'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{Number(order.totalamount).toFixed(2)}</div>
                      <div style={{ fontSize: '0.75rem', color: order.status === 'COMPLETED' ? '#059669' : '#dc2626', fontWeight: 600, marginTop: '0.25rem' }}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Low Stock Alerts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', alignSelf: 'start' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertTriangle size={20} color="#dc2626" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>Low Stock Alerts</h2>
          </div>
          
          {lowStockItems.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>All stock levels are healthy.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lowStockItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                  <div style={{ fontWeight: 500, color: '#991b1b', fontSize: '0.875rem' }}>{item.productname}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dc2626' }}>
                    {item.quantity} / {item.lowstockthreshold}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, bg, variants }) {
  return (
    <motion.div 
      variants={variants}
      style={{ 
        background: '#fff', padding: '1.5rem', borderRadius: '1rem', 
        border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex', alignItems: 'center', gap: '1rem'
      }}
    >
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{title}</p>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginTop: '0.125rem' }}>{value}</h3>
      </div>
    </motion.div>
  );
}
