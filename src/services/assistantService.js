import api from '../lib/api';

export const assistantService = {
  getHistory: async () => {
    const { data } = await api.get('/assistant/history');
    return data;
  },
  
  askQuestion: async (question) => {
    const { data } = await api.post('/assistant/chat', { question });
    return data;
  }
};
