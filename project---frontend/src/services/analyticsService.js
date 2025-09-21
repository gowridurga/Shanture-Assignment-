import api from './api';

export const analyticsService = {
  getDashboard: async (params) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },

  generateReport: async (data) => {
    const response = await api.post('/analytics/reports', data);
    return response.data;
  },

  getSavedReports: async (params) => {
    const response = await api.get('/analytics/reports', { params });
    return response.data;
  },

  getReportById: async (id) => {
    const response = await api.get(`/analytics/reports/${id}`);
    return response.data;
  },
};
