import api from '../lib/api';

export const authService = {
  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    return data;
  },

  changePassword: async (payload) => {
    const { data } = await api.put('/auth/change-password', payload);
    return data;
  }
};
