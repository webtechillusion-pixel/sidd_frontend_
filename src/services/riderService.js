// services/riderService.js
import api from './api';

const riderService = {
  // ================= PROFILE MANAGEMENT =================
  
  /**
   * Get rider profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/api/riders/profile');
      return response.data;
    } catch (error) {
      console.error('Get rider profile error:', error);
      throw error;
    }
  },

  /**
   * Update rider profile
   * @param {Object} data - { name, phone }
   */
  updateProfile: async (data) => {
    try {
      const response = await api.put('/api/riders/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update rider profile error:', error);
      throw error;
    }
  },

  /**
   * Update rider location
   * @param {Object} location - { lat, lng }
   */
  updateLocation: async (location) => {
    try {
      const response = await api.put('/api/riders/location', location);
      return response.data;
    } catch (error) {
      // Silently fail location updates to avoid console spam
      if (error.code !== 'ERR_NETWORK') {
        console.error('Update location error:', error);
      }
      throw error;
    }
  },

  /**
   * Toggle online status
   * @param {boolean} isOnline 
   * @param {string} socketId 
   */
  toggleOnlineStatus: async (isOnline, socketId = null) => {
    try {
      const response = await api.put('/api/riders/online-status', { 
        isOnline, 
        socketId 
      });
      return response.data;
    } catch (error) {
      console.error('Toggle online status error:', error);
      throw error;
    }
  },

  // ================= BOOKING MANAGEMENT =================

  /**
   * Get available booking requests
   * @param {Object} params - { lat, lng, radius }
   */
  // In riderService.js, ensure getAvailableBookings works correctly
getAvailableBookings: async (params = {}) => {
  try {
    const response = await api.get('/api/riders/available-bookings', { params });
    
    // Log the response for debugging
    console.log('Available bookings response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Get available bookings error:', error);
    throw error;
  }
},

  /**
   * Accept a booking request
   * @param {string} bookingId 
   */
  acceptBooking: async (bookingId) => {
    try {
      console.log('Accepting booking:', bookingId);
      const response = await api.post('/api/riders/bookings/accept', { bookingId });
      return response.data;
    } catch (error) {
      console.error('Accept booking error:', error);
      throw error;
    }
  },

  /**
   * Reject a booking request
   * @param {string} bookingId 
   */
  rejectBooking: async (bookingId) => {
    try {
      const response = await api.post(`/api/riders/bookings/${bookingId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Reject booking error:', error);
      throw error;
    }
  },

  /**
   * Get active booking (current ride)
   */
  getActiveBooking: async () => {
    try {
      const response = await api.get('/api/riders/active-booking');
      return response.data;
    } catch (error) {
      console.error('Get active booking error:', error);
      throw error;
    }
  },

  /**
   * Update trip status
   * @param {Object} data - { bookingId, status, otp, actualDistance, additionalCharges }
   */
  updateTripStatus: async (data) => {
    try {
      const response = await api.post('/api/riders/bookings/update-status', data);
      return response.data;
    } catch (error) {
      console.error('Update trip status error:', error);
      throw error;
    }
  },

  /**
   * Start ride with OTP verification
   * @param {string} bookingId 
   * @param {string} otp 
   */
  startRide: async (bookingId, otp) => {
    try {
      const response = await api.post(`/api/riders/bookings/${bookingId}/start`, { otp });
      return response.data;
    } catch (error) {
      console.error('Start ride error:', error);
      throw error;
    }
  },

  /**
   * Complete ride
   * @param {string} bookingId 
   * @param {Object} data - { finalDistance, additionalCharges }
   */
  completeRide: async (bookingId, data) => {
    try {
      const response = await api.post(`/api/riders/bookings/${bookingId}/complete`, data);
      return response.data;
    } catch (error) {
      console.error('Complete ride error:', error);
      throw error;
    }
  },

  // ================= EARNINGS =================

  /**
   * Get rider earnings
   * @param {Object} params - { startDate, endDate, page, limit }
   */
  getEarnings: async (params = {}) => {
    try {
      const response = await api.get('/api/riders/earnings', { params });
      return response.data;
    } catch (error) {
      console.error('Get earnings error:', error);
      throw error;
    }
  },

  // ================= RATINGS =================

  /**
   * Get rider ratings
   * @param {Object} params - { page, limit }
   */
  getRatings: async (params = {}) => {
    try {
      const response = await api.get('/api/riders/ratings', { params });
      return response.data;
    } catch (error) {
      console.error('Get ratings error:', error);
      throw error;
    }
  },

  // ================= NOTIFICATIONS =================

  /**
   * Get rider notifications
   * @param {Object} params - { page, limit, unreadOnly }
   */
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/api/riders/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId 
   */
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.put(`/api/riders/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark notification read error:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsRead: async () => {
    try {
      const response = await api.put('/api/riders/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Mark all notifications read error:', error);
      throw error;
    }
  },

  // ================= CAB MANAGEMENT =================

  /**
   * Update cab details
   * @param {FormData} formData 
   */
  updateCabDetails: async (formData) => {
    try {
      const response = await api.put('/api/riders/cab', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update cab details error:', error);
      throw error;
    }
  },

  // ================= NEARBY CUSTOMERS =================

  /**
   * Get nearby customers
   * @param {Object} params - { lat, lng, radius }
   */
  getNearbyCustomers: async (params = {}) => {
    try {
      const response = await api.get('/api/riders/nearby-customers', { params });
      return response.data;
    } catch (error) {
      console.error('Get nearby customers error:', error);
      throw error;
    }
  },
  

  getVehiclePricing: async () => {
    try {
      const response = await api.get('/api/pricing/vehicle-types');
      return response.data;
    } catch (error) {
      console.error('Get vehicle pricing error:', error);
      throw error;
    }
  },
  // ================= DEBUG =================

  /**
   * Debug booking status
   * @param {string} bookingId 
   */
  debugBooking: async (bookingId) => {
    try {
      const response = await api.get(`/api/riders/bookings/${bookingId}/debug`);
      return response.data;
    } catch (error) {
      console.error('Debug booking error:', error);
      throw error;
    }
  }
};

export default riderService;
