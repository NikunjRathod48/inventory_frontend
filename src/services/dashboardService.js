import api from '../lib/api';

export const dashboardService = {
  getMetrics: async () => {
    const { data } = await api.get('/dashboard/metrics');
    return data;
  },
  
  getSalesChart: async () => {
    const { data } = await api.get('/dashboard/sales-chart');
    return data;
  },
  
  getRecentActivity: async () => {
    const { data } = await api.get('/dashboard/recent-activity');
    return data;
  }
};
