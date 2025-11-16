import api from '../lib/api';

export const statsService = {
  getDashboard: async () => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get('/stats/progress');
    return response.data;
  },

  getMonthlyReport: async (year: number, month: number) => {
    const response = await api.get(`/stats/monthly?year=${year}&month=${month}`);
    return response.data;
  },
};

