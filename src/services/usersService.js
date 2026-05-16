import api from '../lib/api';

export const usersService = {
  // Get all users (Admin only)
  getAll: async (params) => {
    const { data } = await api.get('/users', { params });
    return data;
  },

  // Register a new user (Admin only)
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  // Toggle user activation (Admin only)
  toggleActive: async (userId, isActive) => {
    const { data } = await api.patch(`/users/${userId}/activate`, { isActive });
    return data;
  }
};
