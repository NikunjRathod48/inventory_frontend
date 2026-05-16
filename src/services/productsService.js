import api from '../lib/api';

export const productsService = {
  // Get all products with optional filters
  getAll: async (params) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  // Get a single product
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  // Create a new product
  create: async (productData) => {
    const { data } = await api.post('/products', productData);
    return data;
  },

  // Update a product
  update: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  // Soft delete a product
  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  }
};
