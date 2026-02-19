// services/bookingService.js
import api from './api';

const bookingService = {
  // ================= BOOKING CREATION =================
  
  /**
   * Calculate fare for a trip
   * @param {Object} data - { pickup, drop, vehicleType }
   */
  calculateFare: async (data) => {
    try {
      const response = await api.post('/api/bookings/calculate-fare', data);
      return response.data;
    } catch (error) {
      console.error('Calculate fare error:', error);
      throw error;
    }
  },

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking details
   */
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  // ================= BOOKING MANAGEMENT =================

  /**
   * Get booking details by ID
   * @param {string} bookingId 
   */
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/api/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Get booking error:', error);
      throw error;
    }
  },

  /**
   * Get user's bookings
   * @param {Object} params - { status, page, limit }
   */
  getUserBookings: async (params = {}) => {
    try {
      const response = await api.get('/api/bookings/user/my-bookings', { params });
      return response.data;
    } catch (error) {
      console.error('Get user bookings error:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   * @param {string} bookingId 
   * @param {string} reason 
   */
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await api.post(`/api/bookings/${bookingId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },

  /**
   * Generate invoice for booking
   * @param {string} bookingId 
   */
  generateInvoice: async (bookingId) => {
    try {
      const response = await api.get(`/api/bookings/${bookingId}/invoice`);
      return response.data;
    } catch (error) {
      console.error('Generate invoice error:', error);
      throw error;
    }
  },

  // ================= LOCATION SERVICES =================

  /**
   * Search places using Google Places Autocomplete
   * @param {string} input - Search input
   */
  searchPlaces: async (input) => {
    try {
      // Using Google Places API directly (you might want to proxy this through your backend)
      const response = await api.get('/api/search/places', {
        params: { input }
      });
      return response.data;
    } catch (error) {
      console.error('Search places error:', error);
      throw error;
    }
  },

  /**
   * Get place details by placeId
   * @param {string} placeId 
   */
  getPlaceDetails: async (placeId) => {
    try {
      const response = await api.get('/api/search/place-details', {
        params: { placeId }
      });
      return response.data;
    } catch (error) {
      console.error('Get place details error:', error);
      throw error;
    }
  },

  /**
   * Reverse geocode coordinates to address
   * @param {number} lat 
   * @param {number} lng 
   */
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await api.get('/api/search/reverse-geocode', {
        params: { lat, lng }
      });
      return response.data;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      throw error;
    }
  },

  // ================= VEHICLE TYPES =================

  /**
   * Get all available vehicle types with pricing
   */
  getVehicleTypes: async () => {
    try {
      const response = await api.get('/api/pricing/vehicle-types');
      return response.data;
    } catch (error) {
      console.error('Get vehicle types error:', error);
      throw error;
    }
  },

  // ================= NEARBY RIDERS =================

  /**
   * Find nearby available riders
   * @param {Object} params - { lat, lng, vehicleType, radius }
   */
  findNearbyRiders: async (params) => {
    try {
      const response = await api.get('/api/bookings/nearby-riders', { params });
      return response.data;
    } catch (error) {
      console.error('Find nearby riders error:', error);
      throw error;
    }
  },

  // ================= TRACKING =================

  /**
   * Track rider location during active booking
   * @param {string} bookingId 
   */
  trackRider: async (bookingId) => {
    try {
      const response = await api.get(`/api/bookings/${bookingId}/track`);
      return response.data;
    } catch (error) {
      console.error('Track rider error:', error);
      throw error;
    }
  }
};

export default bookingService;
