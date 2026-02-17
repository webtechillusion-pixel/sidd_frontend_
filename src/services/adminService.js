import  api  from './api'; 

export const adminService = {
  // Auth 
  login: (credentials) => api.post('/api/auth/login', { 
    email: credentials.email, 
    password: credentials.password, 
    role: 'ADMIN' 
  }),

  // Add logout function
  logout: () => api.post('/api/auth/logout'),
  
  // Dashboard 
  getDashboardStats: () => api.get('/api/admin/dashboard'),
  
  // Riders
  getRiders: (params) => api.get('/api/admin/riders', { params }),
  getRiderDetails: (id) => api.get(`/api/admin/riders/${id}`),
  approveRider: (id, data) => api.put(`/api/admin/riders/${id}/approve`, data),
  suspendRider: (id, data) => api.put(`/api/admin/riders/${id}/suspend`, data),
  
  // Cabs
  getCabs: (params) => api.get('/api/admin/cabs', { params }),
  createCab: (data) => api.post('/api/admin/cabs', data),
  approveCab: (id, data) => api.put(`/api/admin/cabs/${id}/approve`, data),
  
  // Pricing
  getPricing: () => api.get('/api/admin/pricing'),
  updatePricing: (data) => api.put('/api/admin/pricing', data),
  
  // Bookings
  getBookings: (params) => api.get('/api/admin/bookings', { params }),
  getBookingAnalytics: (params) => api.get('/api/admin/bookings/analytics', { params }),
  
  // Users
  getUsers: (params) => api.get('/api/admin/users', { params }),
  updateUserStatus: (id, data) => api.put(`/api/admin/users/${id}/status`, data),
  
  // Payouts
  getPayouts: (params) => api.get('/api/admin/payouts', { params }),
  processPayout: (id, data) => api.put(`/api/admin/payouts/${id}/process`, data),
  processBulkPayouts: (data) => api.post('/api/admin/payouts/bulk', data),

  // Settings
  updateSettings: (data) => api.put('/api/admin/settings', data),
  getSettings: () => api.get('/api/admin/settings'),
  
  // System
  getSystemStatus: () => api.get('/api/admin/system/status'),
  clearCache: () => api.post('/api/admin/system/clear-cache'),
  
  // Reports
  generateReport: (data) => api.post('/api/admin/reports/generate', data),
  downloadReport: (id) => api.get(`/api/admin/reports/${id}/download`, { responseType: 'blob' })
};