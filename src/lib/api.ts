import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('mikanaos-auth');
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error('Failed to parse auth data:', error);
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('mikanaos-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: {
    email: string;
    name: string;
    password: string;
    role: string;
  }) => api.post('/auth/register', data),
};

// Inventory
export const inventoryAPI = {
  getAll: (params?: { branchId?: string; status?: string; search?: string }) =>
    api.get('/inventory', { params }),

  getOne: (id: string) => api.get(`/inventory/${id}`),

  create: (data: any) => api.post('/inventory', data),

  update: (id: string, data: any) => api.patch(`/inventory/${id}`, data),

  delete: (id: string) => api.delete(`/inventory/${id}`),

  getLowStock: () => api.get('/inventory/alerts/low-stock'),
};

// Orders
export const ordersAPI = {
  getAll: (params?: {
    branchId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/orders', { params }),

  getOne: (id: string) => api.get(`/orders/${id}`),

  create: (data: {
    branchId: string;
    dispatchDate: string;
    items: Array<{
      itemName: string;
      quantity: number;
      unit: string;
      price: number;
    }>;
    notes?: string;
  }) => api.post('/orders', data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),

  delete: (id: string) => api.delete(`/orders/${id}`),

  getUpcoming: () => api.get('/orders/schedule/upcoming'),
};

// Chat
export const chatAPI = {
  getMessages: (params?: { limit?: number; before?: string }) =>
    api.get('/chat/messages', { params }),

  sendMessage: (message: string) => api.post('/chat/messages', { message }),

  getOnlineUsers: () => api.get('/chat/users/online'),
};

// Data Import
export const dataImportAPI = {
  getHistory: (params?: { source?: string; limit?: number }) =>
    api.get('/data-import/history', { params }),

  upload: (file: File, dataType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataType', dataType);

    return api.post('/data-import/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  syncSharePoint: () => api.post('/data-import/sharepoint/sync'),

  syncSource: (source: string) =>
    api.post(`/data-import/sharepoint/sync/${source}`),

  getSyncStatus: () => api.get('/data-import/sharepoint/status'),
};

// AI & Insights
export const aiAPI = {
  getInsights: (params?: { type?: string; isActive?: boolean; limit?: number }) =>
    api.get('/ai/insights', { params }),

  generateInsights: () => api.post('/ai/insights/generate'),

  applyInsight: (id: string) => api.patch(`/ai/insights/${id}/apply`),

  dismissInsight: (id: string) => api.patch(`/ai/insights/${id}/dismiss`),

  getForecast: (params?: { branchId?: string; days?: number }) =>
    api.get('/ai/forecast', { params }),

  generateForecast: (branchId?: string) =>
    api.post('/ai/forecast/generate', { branchId }),
};

// Analytics
export const analyticsAPI = {
  getDashboard: (params?: {
    branchId?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/analytics/dashboard', { params }),

  getSalesByBranch: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/analytics/sales/by-branch', { params }),

  getSalesByCategory: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/analytics/sales/by-category', { params }),

  getSalesTrends: (params?: { branchId?: string; days?: number }) =>
    api.get('/analytics/sales/trends', { params }),

  getTopItems: (params?: { limit?: number; startDate?: string; endDate?: string }) =>
    api.get('/analytics/items/top', { params }),

  getInventoryTurnover: (params?: { branchId?: string }) =>
    api.get('/analytics/inventory/turnover', { params }),
};

export default api;
