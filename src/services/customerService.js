// frontend/src/services/customerService.js
import api from "./api";

const customerService = {
  // ========== PROFILE ==========
  getProfile: async () => {
    return await api.get('/api/users/profile');
  },

  updateProfile: async (data) => {
    return await api.put('/api/users/profile', data);
  },

  // ========== ADDRESSES ==========
  getAddresses: async () => {
    return await api.get('/api/users/addresses');
  },

  addAddress: async (data) => {
    return await api.post('/api/users/addresses', data);
  },

  updateAddress: async (id, data) => {
    return await api.put(`/api/users/addresses/${id}`, data);
  },

  deleteAddress: async (id) => {
    return await api.delete(`/api/users/addresses/${id}`);
  },

  // ========== BOOKINGS ==========
  getBookings: async (params = {}) => {
    const { status, page = 1, limit = 10 } = params;
    let url = `/api/users/bookings?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return await api.get(url);
  },

  getUserBookings: async (params = {}) => {
  try {
    const { status, page = 1, limit = 10 } = params;
    let url = `/api/users/bookings?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    
    const response = await api.get(url);
    return response.data || response;
  } catch (error) {
    console.error('Get user bookings error:', error);
    throw error;
  }
},

  getBookingDetails: async (id) => {
    return await api.get(`/api/bookings/${id}`); 
  },

  cancelBooking: async (id, reason) => {
    return await api.post(`/api/users/bookings/${id}/cancel`, { reason });
  },

  rateRider: async (bookingId, rating, comment) => {
    try {
      return await api.post(`/api/bookings/${bookingId}/rate`, { rating, comment });
    } catch (error) {
      console.error('Rate rider error:', error);
      throw error;
    }
  },

  // ========== NOTIFICATIONS ==========
  getNotifications: async (params = {}) => {
    const { page = 1, limit = 20, unreadOnly = false } = params;
    let url = `/api/users/notifications?page=${page}&limit=${limit}`;
    if (unreadOnly) url += '&unreadOnly=true';
    return await api.get(url);
  },

  markNotificationAsRead: async (id) => {
    return await api.put(`/api/users/notifications/${id}/read`);
  },

  markAllNotificationsAsRead: async () => {
    return await api.put('/api/users/notifications/read-all');
  },

  updateNotificationToken: async (token) => {
    return await api.put('/api/users/notification-token', { notificationToken: token });
  },

  // ========== PAYMENT ==========
   createPaymentOrder: async (data) => {
    try {
      const response = await api.post('/api/payments/create-order', data);
      return response.data || response;
    } catch (error) {
      console.error('Create payment order error:', error);
      throw error;
    }
  },
  verifyPayment: async (data) => {
    try {
      const response = await api.post('/api/payments/verify', data);
      return response.data || response;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  },

  getPaymentDetails: async (bookingId) => {
    try {
      const response = await api.get(`/api/payments/booking/${bookingId}`);
      return response.data || response;
    } catch (error) {
      console.error('Get payment details error:', error);
      throw error;
    }
  },

  processCashPayment: async (data) => {
    return await api.post('/api/payments/cash', data);
  },

  completeCashPayment: async (bookingId) => {
  try {
    const response = await api.post('/api/payments/complete-cash', { bookingId });
    return response.data || response;
  } catch (error) {
    console.error('Complete cash payment error:', error);
    throw error;
  }
},

  // processWalletPayment: async (data) => {
  //   try {
  //     const response = await api.post('/api/payments/wallet', data);
  //     return response.data || response;
  //   } catch (error) {
  //     console.error('Process wallet payment error:', error);
  //     throw error;
  //   }
  // },

  getPaymentHistory: async (params = {}) => {
    try {
      const response = await api.get('/api/payments/history', { params });
      return response.data || response;
    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  },

  // ========== BOOKING CALCULATION ==========
  calculateFareEstimate: async (data) => {
    return await api.post('/api/bookings/calculate-fare', data);
  },

  getNearbyCabs: async (params) => {
    return await api.get('/api/bookings/nearby-cabs', { params });
  },

  createBooking: async (data) => {
    return await api.post('/api/bookings', data);
  },

  trackBooking: async (id) => {
    return await api.get(`/api/bookings/${id}/track`);
  },

  // ========== WALLET ==========
  getWalletBalance: async () => {
    return await api.get('/api/user/wallet/balance');
  },

  getWalletTransactions: async (params = {}) => {
    const { page = 1, limit = 20, type } = params;
    let url = `/api/user/wallet/transactions?page=${page}&limit=${limit}`;
    if (type) url += `&type=${type}`;
    return await api.get(url);
  },

  addMoneyToWallet: async (amount) => {
    return await api.post('/api/user/wallet/add-money', { amount });
  },

  // ========== SUPPORT ==========
  createSupportTicket: async (data) => {
    return await api.post('/api/support/tickets', data);
  },

  getSupportTickets: async (params = {}) => {
    const { page = 1, limit = 10, status } = params;
    let url = `/api/support/tickets?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return await api.get(url);
  },

  getSupportTicketDetails: async (id) => {
    return await api.get(`/api/support/tickets/${id}`);
  },

  addMessageToTicket: async (id, message) => {
    return await api.post(`/api/support/tickets/${id}/messages`, { message });
  },

  // ========== FAVORITES ==========
  getFavoriteDrivers: async () => {
    return await api.get('/api/user/favorite-drivers');
  },

  addFavoriteDriver: async (driverId) => {
    return await api.post('/api/user/favorite-drivers', { driverId });
  },

  removeFavoriteDriver: async (driverId) => {
    return await api.delete(`/api/user/favorite-drivers/${driverId}`);
  },

  // ========== VEHICLE PREFERENCES ==========
  getVehiclePreferences: async () => {
    return await api.get('/api/user/vehicle-preferences');
  },

  updateVehiclePreferences: async (data) => {
    return await api.put('/api/user/vehicle-preferences', data);
  },

  // ========== REFERRAL ==========
  getReferralCode: async () => {
    return await api.get('/api/user/referral-code');
  },

  getReferralStats: async () => {
    return await api.get('/api/user/referral-stats');
  },

  getReferralHistory: async (params = {}) => {
    const { page = 1, limit = 20 } = params;
    return await api.get(`/api/user/referral-history?page=${page}&limit=${limit}`);
  }
};

export default customerService;