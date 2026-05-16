import api from '../lib/api';

export const categoriesService = {
  // Get all categories
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  // Get a single category
  getById: async (id) => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  // Create a new category
  create: async (categoryData) => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },

  // Update a category
  update: async (id, categoryData) => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data;
  },

  // Delete a category
  delete: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  }
};
