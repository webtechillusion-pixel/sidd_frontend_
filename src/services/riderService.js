import api from './api';

const riderService = {
  // ================= PROFILE =================
  getProfile: async () => {
    try {
      const res = await api.get('/api/riders/profile');
      return res.data;
    } catch (err) {
      console.error('Get rider profile error:', err);
      throw err;
    }
  },

  // Add to riderService.js
getBookingStatus: async (bookingId) => {
  try {
    const res = await api.get(`/api/bookings/${bookingId}`);
    return res.data;
  } catch (err) {
    console.error('Get booking status error:', err);
    throw err;
  }
},

  // ================= LOCATION =================

  // ================= LOCATION TRACKING =================
startLocationTracking: (onUpdate) => {
  if (!navigator.geolocation) {
    console.error("Geolocation not supported");
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // backend update
      riderService.updateLocation(location).catch(err => {
        console.log('Location update failed:', err.message);
      });

      // optional callback for UI
      if (onUpdate) onUpdate(location);
    },
    (error) => {
      console.log("Location tracking error:", error.message);
      // Don't throw error, just log it
    },
    {
      enableHighAccuracy: false, // Changed to false for better battery life
      maximumAge: 30000, // Allow 30 second old location
      timeout: 15000 // Increased timeout to 15 seconds
    }
  );

  return watchId;
},

stopLocationTracking: (watchId) => {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
},

  updateLocation: async (data) => {
    try {
      const res = await api.put('/api/riders/location', data);
      return res.data;
    } catch (err) {
      // Silently fail location updates to avoid spam
      if (err.code !== 'ERR_NETWORK') {
        console.error('Update location error:', err);
      }
      throw err;
    }
  },

  toggleOnlineStatus: async (data) => {
    try {
      const res = await api.put('/api/riders/online-status', data);
      return res.data;
    } catch (err) {
      console.error('Toggle online status error:', err);
      throw err;
    }
  },

  // ================= BOOKINGS =================
  getAvailableBookings: async ({ lat = 28.61, lng = 77.20 } = {}) => {
    try {
      console.log('🔍 Fetching available bookings with params:', { lat, lng });
      
      const res = await api.get('/api/bookings/rider/available', {
        params: { lat, lng, radius: 10 }
      });
      
      console.log('✅ Available bookings response:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Available bookings error:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        data: err.response?.data
      });
      
      // Return empty result instead of throwing to prevent UI crashes
      if (err.response?.status === 500) {
        console.warn('⚠️ Server error - returning empty bookings list');
        return {
          success: true,
          data: [],
          message: 'Server temporarily unavailable'
        };
      }
      
      throw err;
    }
  },

  acceptBooking: async (bookingId) => {
    try {
      const res = await api.post('/api/riders/bookings/accept', {
        bookingId
      });
      return res.data;
    } catch (err) {
      console.error('Accept booking error:', err);
      throw err;
    }
  },

  rejectBooking: async (bookingId) => {
    try {
      const res = await api.post(`/api/riders/bookings/${bookingId}/reject`);
      return res.data;
    } catch (err) {
      console.error('Reject booking error:', err);
      throw err;
    }
  },

  updateTripStatus: async (bookingId, status, otp = null, actualDistance = null, additionalCharges = 0) => {
    try {
      const res = await api.post('/api/riders/bookings/update-status', {
        bookingId,
        status,
        otp,
        actualDistance,
        additionalCharges
      });
      return res.data;
    } catch (err) {
      console.error('Update trip status error:', err);
      throw err;
    }
  },

    // ================= RIDES =================
  startRide: async (rideId, otp) => {
    try {
      const res = await api.post(`/api/riders/bookings/${rideId}/start`, { otp });
      return res.data;
    } catch (err) {
      console.error('Start ride error:', err);
      throw err;
    }
  },


  // ================= EARNINGS =================
  getEarnings: async (params = {}) => {
    try {
      const res = await api.get('/api/riders/earnings', { params });
      return res.data;
    } catch (err) {
      console.error('Get earnings error:', err);
      throw err;
    }
  },

  // ================= RATINGS =================
  getRatings: async () => {
    try {
      const res = await api.get('/api/riders/ratings');
      return res.data;
    } catch (err) {
      console.error('Get ratings error:', err);
      throw err;
    }
  },

  // ================= NOTIFICATIONS =================
  getNotifications: async (params = {}) => {
    try {
      const res = await api.get('/api/riders/notifications', { params });
      return res.data;
    } catch (err) {
      console.error('Get notifications error:', err);
      throw err;
    }
  },

  // ================= CAB MANAGEMENT =================
  updateCabDetails: async (data) => {
    try {
      const res = await api.put('/api/riders/cab', data);
      return res.data;
    } catch (err) {
      console.error('Update cab details error:', err);
      throw err;
    }
  },

  // ================= NEARBY CUSTOMERS =================
  getNearbyCustomers: async (params = {}) => {
    try {
      const res = await api.get('/api/riders/nearby-customers', { params });
      return res.data;
    } catch (err) {
      console.error('Get nearby customers error:', err);
      throw err;
    }
  }
};

export default riderService;
