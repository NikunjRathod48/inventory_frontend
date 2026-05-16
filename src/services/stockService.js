import api from '../lib/api';

export const stockService = {
  // Get stock overview (supports page, limit, search, lowStockOnly)
  getAll: async (params) => {
    const { data } = await api.get('/stock', { params });
    return data;
  },

  // Adjust stock (Add or Remove)
  adjust: async (payload) => {
    const { data } = await api.post('/stock/adjust', payload);
    return data;
  },

  // Get transaction history for a specific product
  getHistory: async (productId, params) => {
    const { data } = await api.get(`/stock/history/${productId}`, { params });
    return data;
  },

  // Update low stock threshold for a product
  updateThreshold: async (productId, threshold) => {
    const { data } = await api.put(`/stock/threshold/${productId}`, { threshold });
    return data;
  },

  // Get high-level alerts (low stock count, out of stock count)
  getAlerts: async () => {
    const { data } = await api.get('/stock/alerts');
    return data;
  }
};
