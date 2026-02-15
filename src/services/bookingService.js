import api from './api';

// Helper function to calculate distance between two points (Haversine formula)
const calculateDistanceFallback = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const bookingService = {
  // Create Rapido-style Booking
  createBooking: async (bookingData) => {
    try {
      console.log('Creating booking:', bookingData);
      const response = await api.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  // Calculate Fare Estimate - Updated for distance-based calculation
  calculateFare: async (fareData) => {
    try {
      console.log('Calculating fare with data:', fareData);
      
      // Format data to match server expectations
      const fareRequest = {
        pickup: {
          lat: fareData.pickupLat,
          lng: fareData.pickupLng
        },
        drop: {
          lat: fareData.dropLat,
          lng: fareData.dropLng
        },
        vehicleType: fareData.cabType || fareData.vehicleType
      };
      
      console.log('Sending fare request:', fareRequest);
      
      const response = await api.post('/api/bookings/calculate-fare', fareRequest);
      console.log('Fare calculation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Calculate fare error:', error.response?.data || error.message);
      
      // Calculate fallback fare based on estimated distance
      const distance = calculateDistanceFallback(
        fareData.pickupLat, fareData.pickupLng,
        fareData.dropLat, fareData.dropLng
      );
      
      const vehicleType = fareData.cabType || fareData.vehicleType || 'SEDAN';
      const baseFares = { HATCHBACK: 50, SEDAN: 60, SUV: 80, PREMIUM: 100 };
      const perKmRates = { HATCHBACK: 10, SEDAN: 12, SUV: 15, PREMIUM: 20 };
      
      const baseFare = baseFares[vehicleType] || 60;
      const perKmRate = perKmRates[vehicleType] || 12;
      const estimatedFare = baseFare + (distance * perKmRate);
      
      return {
        success: true,
        data: {
          estimatedFare: Math.round(estimatedFare),
          distance: parseFloat(distance.toFixed(2)),
          estimatedDuration: Math.round((distance / 25) * 60),
          breakdown: {
            baseFare: baseFare,
            distanceFare: Math.round(distance * perKmRate)
          }
        }
      };
    }
  },

  // Get Nearby Riders (instead of cabs for Rapido)
  getNearbyRiders: async (lat, lng, vehicleType) => {
    try {
      const response = await api.get('/api/riders/nearby', {
        params: { lat, lng, vehicleType }
      });
      return response.data;
    } catch (error) {
      console.error('Get nearby riders error:', error);
      // Production: return empty list on error (do not use mock fallback data)
      return {
        success: false,
        data: []
      };
    }
  },

  // Cancel Booking
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await api.post(`/api/bookings/${bookingId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },

  // Get User Bookings
  getUserBookings: async () => {
    try {
      const response = await api.get('/api/bookings/my-bookings');
      return response.data;
    } catch (error) {
      console.error('Get user bookings error:', error);
      throw error;
    }
  },

  // Get Booking Details
  getBookingDetails: async (bookingId) => {
    try {
      const response = await api.get(`/api/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Get booking details error:', error);
      throw error;
    }
  },

  // Update Booking Status
  updateBookingStatus: async (bookingId, statusData) => {
    try {
      const response = await api.put(`/api/bookings/${bookingId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Update booking status error:', error);
      throw error;
    }
  }
};

export default bookingService;