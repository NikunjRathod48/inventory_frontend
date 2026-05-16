import api from '../lib/api';

export const ordersService = {
  getAll: async (params) => {
    const { data } = await api.get('/orders', { params });
    return data;
  },

  getOne: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/orders', payload);
    return data;
  },

  cancel: async (id) => {
    const { data } = await api.patch(`/orders/${id}/cancel`);
    return data;
  }
};
