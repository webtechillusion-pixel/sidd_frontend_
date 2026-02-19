// pages/Rider/Rides.jsx - FIXED VERSION with database pricing

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaCar,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaMoneyBill,
  FaCheckCircle,
  FaTimesCircle,
  FaRoute,
  FaPhone,
  FaStar,
  FaCalendarAlt,
  FaInfoCircle,
  FaSpinner,
  FaBell,
  FaExclamationTriangle,
  FaLocationArrow,
  FaPlay,
  FaFlag,
  FaStop,
  FaKey,
  FaCheck,
  FaArrowRight,
  FaMap,
  FaWallet,
  FaCreditCard,
  FaMoneyBillWave
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import riderService from '../../services/riderService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Ride status steps for timeline
const RIDE_STATUS_STEPS = [
  { key: 'PENDING', label: 'Request Received', icon: FaBell, color: 'yellow' },
  { key: 'ACCEPTED', label: 'Booking Accepted', icon: FaCheckCircle, color: 'green' },
  { key: 'DRIVER_ASSIGNED', label: 'You are assigned', icon: FaCar, color: 'blue' },
  { key: 'DRIVER_ARRIVED', label: 'Arrived at pickup', icon: FaMapMarkerAlt, color: 'purple' },
  { key: 'TRIP_STARTED', label: 'Trip Started', icon: FaPlay, color: 'indigo' },
  { key: 'TRIP_COMPLETED', label: 'Trip Completed', icon: FaFlag, color: 'green' }
];



const Rides = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  
  // State management
  const [availableBookings, setAvailableBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rideCompletionData, setRideCompletionData] = useState({
    actualDistance: 0,
    additionalCharges: 0
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [locationTracking, setLocationTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [bookingRequests, setBookingRequests] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [vehiclePricing, setVehiclePricing] = useState({});
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  
  const mapRef = useRef(null);
  const audioRef = useRef(null);
  const locationTimeoutRef = useRef(null);

  // Countdown Timer Component - Add this inside your Rides component before the return statement
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference <= 0) {
        return 'Pickup time has arrived!';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      
      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
      } else {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-2xl font-bold text-purple-400">
      {timeLeft}
    </div>
  );
};


  // Fetch vehicle pricing from database
  const fetchVehiclePricing = useCallback(async () => {
    setIsLoadingPricing(true);
    try {
      const response = await riderService.getVehiclePricing();
      if (response.success) {
        setVehiclePricing(response.data);
        console.log('✅ Vehicle pricing loaded:', response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch vehicle pricing:', error);
      toast.error('Failed to load pricing information');
    } finally {
      setIsLoadingPricing(false);
    }
  }, []);

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Get current location - memoized with useCallback
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return null;
    }

    if (isGettingLocation) return; // Prevent multiple requests

    setIsGettingLocation(true);
    
    // Clear any existing timeout
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('📍 Location obtained:', location);
        setCurrentLocation(location);
        setIsGettingLocation(false);
        
        // Update location in backend
        riderService.updateLocation(location).catch(err => {
          console.log('Location update failed:', err.message);
        });
      },
      (error) => {
        console.log('Location error:', error.message);
        setIsGettingLocation(false);
        
        // Set a timeout to retry after 10 seconds
        locationTimeoutRef.current = setTimeout(() => {
          console.log('Retrying location fetch...');
          getCurrentLocation();
        }, 10000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [isGettingLocation]);

  // Start location tracking
  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    if (watchId) return; // Already tracking

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        
        riderService.updateLocation(location).catch(err => {
          console.log('Location update failed:', err.message);
        });

        // If active booking, emit location via socket
        if (activeBooking && socket && isConnected) {
          socket.emit('rider-location', {
            riderId: user?.id,
            location,
            bookingId: activeBooking._id
          });
        }
      },
      (error) => {
        console.log('Location tracking error:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000
      }
    );

    setWatchId(id);
    setLocationTracking(true);
    console.log('📍 Location tracking started');
  }, [activeBooking, socket, isConnected, user, watchId]);

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setLocationTracking(false);
      console.log('📍 Location tracking stopped');
    }
  }, [watchId]);

  // Fetch available bookings
  const fetchAvailableBookings = useCallback(async () => {
    if (!currentLocation) {
      getCurrentLocation();
      return;
    }

    setIsRefreshing(true);
    try {
      console.log('🔍 Fetching available bookings with location:', currentLocation);
      const response = await riderService.getAvailableBookings({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        radius: 30
      });
      
      if (response.success) {
        const bookings = Array.isArray(response.data) ? response.data : [];
        setAvailableBookings(bookings);
        console.log(`📦 Found ${bookings.length} available bookings`);
      }
    } catch (error) {
      console.error('❌ Fetch available bookings error:', error);
      toast.error('Failed to fetch available bookings');
    } finally {
      setIsRefreshing(false);
    }
  }, [currentLocation, getCurrentLocation]);

  // Fetch active booking
  const fetchActiveBooking = useCallback(async () => {
    try {
      console.log('🔍 Fetching active booking');
      const response = await riderService.getActiveBooking();
      
      if (response.success && response.data) {
        console.log('✅ Active booking found:', response.data);
        setActiveBooking(response.data);
        setActiveTab('active');
        startLocationTracking();
      } else {
        console.log('ℹ️ No active booking found');
        if (locationTracking) {
          stopLocationTracking();
        }
      }
    } catch (error) {
      console.error('❌ Fetch active booking error:', error);
    }
  }, [startLocationTracking, stopLocationTracking, locationTracking]);

  // Initial data fetch - runs once on mount
  useEffect(() => {
    console.log('🔄 Initializing Rides component');
    fetchVehiclePricing();
    getCurrentLocation();
    fetchActiveBooking();
    
    return () => {
      console.log('🧹 Cleaning up Rides component');
      stopLocationTracking();
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - runs only once

  const formatScheduledDateTime = (scheduledAt) => {
  if (!scheduledAt) return null;
  
  const date = new Date(scheduledAt);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

  const formatScheduledTime = (scheduledAt) => {
  if (!scheduledAt) return null;
 
  const date = new Date(scheduledAt);
  const now = new Date();
  const diffHours = (date - now) / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffHours / 24);
 
  if (diffHours < 1) {
    return 'Less than 1 hour';
  } else if (diffHours < 24) {
    return `In ${Math.round(diffHours)} hours`;
  } else {
    return `In ${diffDays} days`;
  }
};

  // Fetch available bookings when location changes and tab is available
  useEffect(() => {
    if (currentLocation && activeTab === 'available') {
      fetchAvailableBookings();
    }
  }, [currentLocation, activeTab, fetchAvailableBookings]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('🔌 Socket connected, setting up listeners');

    // Listen for new booking requests
    socket.on('new-booking-request', (data) => {
  console.log('🔥 New booking request received:', data);
 
  // Play notification sound
  if (audioRef.current) {
    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
  }
  // Show toast notification with appropriate message
  const message = data.bookingType === 'SCHEDULED'
    ? `New scheduled ride for ${new Date(data.scheduledAt).toLocaleString()}`
    : 'New booking request received!';
 
  toast.info(message, {
    position: 'top-right',
    autoClose: 5000,
  });
  // Add to available bookings
  setAvailableBookings(prev => {
    const exists = prev.some(b => b._id === data.bookingId);
    if (!exists) {
      const newBooking = {
        _id: data.bookingId,
        pickup: data.pickup,
        drop: data.drop,
        distanceKm: data.distanceKm,
        estimatedFare: data.estimatedFare,
        vehicleType: data.vehicleType,
        bookingType: data.bookingType,
        scheduledAt: data.scheduledAt,
        userId: {
          name: data.customerName || 'Customer'
        },
        expiresAt: data.expiresAt
      };
      return [...prev, newBooking];
    }
    return prev;
  });
});

    // Listen for booking taken by another rider
    socket.on('booking-taken', (data) => {
      console.log('⚠️ Booking taken by another rider:', data);
      setAvailableBookings(prev => prev.filter(b => b._id !== data.bookingId));
      toast.info('This booking was accepted by another rider');
    });

    // Listen for booking updates
    socket.on('booking-updated', (data) => {
      console.log('📝 Booking updated:', data);
      if (data.bookingId === activeBooking?._id) {
        setActiveBooking(data.booking);
        
        switch(data.booking.bookingStatus) {
          case 'DRIVER_ASSIGNED':
            toast.success('Booking accepted! Head to pickup location.');
            break;
          case 'DRIVER_ARRIVED':
            toast.info('You have arrived at pickup location');
            break;
          case 'TRIP_STARTED':
            toast.success('Trip started! Safe drive!');
            break;
          case 'TRIP_COMPLETED':
            toast.success('Trip completed successfully!');
            setActiveBooking(null);
            setActiveTab('available');
            stopLocationTracking();
            break;
          default:
            break;
        }
      }
    });

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('new-booking-request');
      socket.off('booking-taken');
      socket.off('booking-updated');
    };
  }, [socket, isConnected, activeBooking, stopLocationTracking]);

  // Handle accept booking
  const handleAcceptBooking = async (booking) => {
    setIsLoading(true);
    try {
      console.log('✅ Accepting booking:', booking._id);
      const response = await riderService.acceptBooking(booking._id);
      
      if (response.success) {
        toast.success('Booking accepted successfully!');
        
        // Remove from available bookings
        setAvailableBookings(prev => prev.filter(b => b._id !== booking._id));
        
        // Set as active booking
        setActiveBooking(response.data.booking || response.data);
        setActiveTab('active');
        
        // Start location tracking
        startLocationTracking();
      }
    } catch (error) {
      console.error('❌ Accept booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject booking
  const handleRejectBooking = async (bookingId) => {
    try {
      console.log('❌ Rejecting booking:', bookingId);
      await riderService.rejectBooking(bookingId);
      setAvailableBookings(prev => prev.filter(b => b._id !== bookingId));
      toast.info('Booking rejected');
    } catch (error) {
      console.error('❌ Reject booking error:', error);
      toast.error('Failed to reject booking');
    }
  };

  // Handle driver arrived
  const handleDriverArrived = async () => {
    if (!activeBooking) return;

    setIsLoading(true);
    try {
      const response = await riderService.updateTripStatus({
        bookingId: activeBooking._id,
        status: 'DRIVER_ARRIVED'
      });

      if (response.success) {
        toast.success('Arrival status updated');
        setActiveBooking(response.data);
      }
    } catch (error) {
      console.error('❌ Driver arrived error:', error);
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle start ride with OTP
  const handleStartRide = async () => {
    if (!selectedBooking || !otpInput) {
      toast.warning('Please enter OTP');
      return;
    }

    if (otpInput.length !== 6) {
      toast.warning('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await riderService.startRide(selectedBooking._id, otpInput);
      
      if (response.success) {
        toast.success('Ride started successfully!');
        setShowOtpModal(false);
        setOtpInput('');
        setActiveBooking(response.data);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('❌ Start ride error:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle complete ride
  const handleCompleteRide = async () => {
    if (!activeBooking) return;

    const pricing = vehiclePricing[activeBooking.vehicleType];
    if (!pricing) {
      toast.error('Pricing information not available');
      return;
    }

    const estimatedDistance = activeBooking.distanceKm || 0;
    if (rideCompletionData.actualDistance < estimatedDistance) {
      toast.warning('Actual distance cannot be less than estimated distance');
      return;
    }

    setIsLoading(true);
    try {
      const response = await riderService.completeRide(activeBooking._id, rideCompletionData);
      
      if (response.success) {
        // Show different messages based on payment method
        if (response.data.earnings.paymentMethod === 'CASH') {
          toast.success(
            <div>
              <p className="font-bold">Ride Completed! 💰</p>
              <p>Collect ₹{response.data.earnings.finalFare} from customer</p>
              <p className="text-sm">Your earnings: ₹{response.data.earnings.riderEarning}</p>
            </div>,
            { autoClose: 8000 }
          );
        } else {
          toast.success(
            <div>
              <p className="font-bold">Ride Completed! 🎉</p>
              <p>Your earnings: ₹{response.data.earnings.riderEarning}</p>
              <p className="text-sm">Will be credited within 7 days</p>
            </div>,
            { autoClose: 8000 }
          );
        }
        
        setShowCompletionModal(false);
        setActiveBooking(null);
        setActiveTab('available');
        setRideCompletionData({ actualDistance: 0, additionalCharges: 0 });
        stopLocationTracking();
      }
    } catch (error) {
      console.error('❌ Complete ride error:', error);
      toast.error('Failed to complete ride');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format time remaining
  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return null;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch(method) {
      case 'CASH':
        return <FaMoneyBillWave className="text-green-400" />;
      case 'RAZORPAY':
      case 'ONLINE':
        return <FaCreditCard className="text-blue-400" />;
      case 'WALLET':
        return <FaWallet className="text-purple-400" />;
      default:
        return <FaMoneyBill className="text-gray-400" />;
    }
  };

  // Calculate fare based on actual distance and vehicle type using database pricing
  const calculateFare = (vehicleType, actualDistance, additionalCharges = 0) => {
    const pricing = vehiclePricing[vehicleType];
    if (!pricing) {
      console.error('Pricing not found for vehicle type:', vehicleType);
      return {
        baseFare: 0,
        perKmRate: 0,
        distanceFare: 0,
        subtotal: 0,
        totalFare: 0,
        commission: 0,
        riderEarning: 0,
        commissionPercent: 0
      };
    }
    
    const baseFare = pricing.baseFare;
    const perKmRate = pricing.pricePerKm;
    const commissionPercent = pricing.adminCommissionPercent || 25; // Default to 25% if not set
    
    const distanceFare = actualDistance * perKmRate;
    const subtotal = baseFare + distanceFare;
    const totalFare = subtotal + additionalCharges;
    const commission = Math.round(totalFare * commissionPercent / 100);
    const riderEarning = totalFare - commission;
    
    return {
      baseFare,
      perKmRate,
      distanceFare: Math.round(distanceFare),
      subtotal: Math.round(subtotal),
      totalFare: Math.round(totalFare),
      commission,
      riderEarning: Math.round(riderEarning),
      commissionPercent
    };
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FaCar className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Rides Management
              </h1>
              <p className="text-sm text-slate-400">
                {locationTracking ? '🔴 Live tracking active' : '⚫ Location tracking off'}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'available'
                  ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Available Rides 
              {availableBookings.length > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {availableBookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Current Ride 
              {activeBooking && (
                <span className="ml-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs animate-pulse">
                  ACTIVE
                </span>
              )}
            </button>
          </div>

          {/* Refresh Button - only show in available tab */}
          {activeTab === 'available' && (
            <button
              onClick={fetchAvailableBookings}
              disabled={isRefreshing}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-white transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FaSpinner className={`${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Available Rides Tab */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            {/* Available Rides Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Available Rides Near You
              </h2>
              <p className="text-sm text-slate-400">
                {availableBookings.length} ride{availableBookings.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Available Rides List */}
            {isRefreshing && availableBookings.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-4xl text-teal-400" />
              </div>
            ) : availableBookings.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-12 text-center">
                <FaCar className="text-5xl text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Rides Available</h3>
                <p className="text-slate-400 mb-4">
                  Stay online and we'll notify you when new rides are available
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <div className={`w-2 h-2 rounded-full ${locationTracking ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                  <span>{locationTracking ? 'Tracking active' : 'Waiting for location...'}</span>
                </div>
              </div>
            ) : (
              availableBookings.map((booking) => {
                const timeRemaining = getTimeRemaining(booking.expiresAt);
                
                return (
                  <div
                    key={booking._id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-teal-500/50 transition-all"
                  >
                    {/* Ride Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-600/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                          <FaCar className="text-2xl text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {booking.vehicleType || 'Cab'} Ride
                          </h3>
                          <p className="text-sm text-slate-400">
                            {booking.distanceKm ? booking.distanceKm.toFixed(1) : '?'} km • {formatCurrency(booking.estimatedFare || 0)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Timer */}
                      {timeRemaining && booking.bookingType === 'IMMEDIATE' ? (
  <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
    <span className="text-yellow-400 text-sm font-semibold">
      {timeRemaining}
    </span>
  </div>
) : booking.bookingType === 'SCHEDULED' && (
  <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
    <span className="text-purple-400 text-sm font-semibold">
      {Math.round((new Date(booking.expiresAt) - new Date()) / (1000 * 60))}m to respond
    </span>
  </div>
)}
                    </div>

                    {/* Pickup & Drop */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-400">PICKUP</p>
                          <p className="text-sm text-white">
                            {booking.pickup?.addressText || 'Pickup location'}
                          </p>
                          {booking.pickup?.lat && booking.pickup?.lng && (
                            <p className="text-xs text-slate-500 mt-1">
                              {booking.pickup.lat.toFixed(4)}, {booking.pickup.lng.toFixed(4)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-400">DROP</p>
                          <p className="text-sm text-white">
                            {booking.drop?.addressText || 'Drop location'}
                          </p>
                          {booking.drop?.lat && booking.drop?.lng && (
                            <p className="text-xs text-slate-500 mt-1">
                              {booking.drop.lat.toFixed(4)}, {booking.drop.lng.toFixed(4)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    {booking.userId && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <FaUser className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {booking.userId.name || 'Customer'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <FaStar className="text-yellow-400" />
                            <span>{booking.userId.rating || 4.5}</span>
                          </div>
                        </div>
                      </div>
                    )}

{booking.bookingType === 'SCHEDULED' && (
  <div className="mb-4 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
    <div className="flex items-center gap-2 text-purple-400 mb-1">
      <FaCalendarAlt className="text-sm" />
      <span className="text-xs font-semibold">SCHEDULED RIDE</span>
    </div>
    <p className="text-sm text-white">
      {new Date(booking.scheduledAt).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </p>
    <p className="text-xs text-purple-300 mt-1">
      {formatScheduledTime(booking.scheduledAt)}
    </p>
  </div>
)}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptBooking(booking)}
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectBooking(booking._id)}
                        disabled={isLoading}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <FaTimesCircle />
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Active Ride Tab */}
        {/* Active Ride Tab */}
{activeTab === 'active' && activeBooking && (
  <div className="space-y-4">
    {/* Active Ride Header */}
    <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 rounded-xl border border-teal-500/30 p-6">
      <h2 className="text-xl font-bold text-white mb-2">Current Ride</h2>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm text-slate-300">
          Status: {activeBooking.bookingStatus?.replace(/_/g, ' ') || 'ACTIVE'}
        </span>
      </div>
      
      {/* Show scheduled time if this is a scheduled booking */}
      {activeBooking.bookingType === 'SCHEDULED' && activeBooking.scheduledAt && (
        <div className="mt-3 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <FaCalendarAlt className="text-sm" />
            <span className="text-xs font-semibold">SCHEDULED RIDE</span>
          </div>
          <p className="text-sm text-white">
            {formatScheduledDateTime(activeBooking.scheduledAt)}
          </p>
          <p className="text-xs text-purple-300 mt-1">
            Please be at the pickup location on time
          </p>
        </div>
      )}
    </div>

    {/* Ride Status Timeline */}
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
      <h3 className="text-white font-semibold mb-4">Ride Progress</h3>
      <div className="space-y-3">
        {RIDE_STATUS_STEPS.map((step, index) => {
          const currentStatus = activeBooking.bookingStatus || 'DRIVER_ASSIGNED';
          const stepIndex = RIDE_STATUS_STEPS.findIndex(s => s.key === currentStatus);
          const isCompleted = index < stepIndex;
          const isCurrent = index === stepIndex;
          
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-500/20 text-green-400' 
                  : isCurrent
                    ? 'bg-blue-500/20 text-blue-400 animate-pulse'
                    : 'bg-slate-700 text-slate-500'
              }`}>
                <step.icon className="text-sm" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isCompleted ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  {step.label}
                </p>
              </div>
              {isCurrent && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>

    {/* Ride Details */}
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
      <h3 className="text-white font-semibold mb-4">Ride Details</h3>
      
      {/* Pickup & Drop */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400">PICKUP</p>
            <p className="text-sm text-white">
              {activeBooking.pickup?.addressText || 'Pickup location'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400">DROP</p>
            <p className="text-sm text-white">
              {activeBooking.drop?.addressText || 'Drop location'}
            </p>
          </div>
        </div>
      </div>

      {/* Show countdown for scheduled rides */}
      {activeBooking.bookingType === 'SCHEDULED' && activeBooking.scheduledAt && (
        <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <h4 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
            <FaClock className="text-sm" />
            Time Until Pickup
          </h4>
          <CountdownTimer targetDate={activeBooking.scheduledAt} />
        </div>
      )}

      {/* Customer Info */}
      {activeBooking.userId && (
        <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">{activeBooking.userId.name || 'Customer'}</p>
            <p className="text-sm text-slate-400">Customer</p>
          </div>
          {activeBooking.userId.phone && (
            <a 
              href={`tel:${activeBooking.userId.phone}`}
              className="p-2 bg-teal-600/20 hover:bg-teal-600/30 rounded-lg text-teal-400 transition-all"
            >
              <FaPhone />
            </a>
          )}
        </div>
      )}

      {/* Fare Info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Distance</p>
          <p className="text-lg font-semibold text-white">{activeBooking.distanceKm || 0} km</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Estimated Fare</p>
          <p className="text-lg font-semibold text-teal-400">{formatCurrency(activeBooking.estimatedFare || 0)}</p>
        </div>
      </div>

      {/* OTP Display - Only show for immediate rides or when it's time */}
      {activeBooking.otp && activeBooking.bookingType === 'IMMEDIATE' && 
       activeBooking.bookingStatus !== 'TRIP_STARTED' && 
       activeBooking.bookingStatus !== 'TRIP_COMPLETED' && (
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p className="text-xs text-yellow-400 mb-1">Customer OTP</p>
          <p className="text-3xl font-bold text-yellow-400 tracking-wider">{activeBooking.otp}</p>
          <p className="text-xs text-slate-400 mt-1">Share this with customer to start ride</p>
        </div>
      )}

      {/* Action Buttons based on status */}
      <div className="space-y-3">
        {activeBooking.bookingStatus === 'DRIVER_ASSIGNED' && (
          <button
            onClick={handleDriverArrived}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt />}
            I've Arrived at Pickup
          </button>
        )}

        {activeBooking.bookingStatus === 'DRIVER_ARRIVED' && (
          <button
            onClick={() => {
              setSelectedBooking(activeBooking);
              setShowOtpModal(true);
            }}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <FaKey />
            Verify OTP & Start Ride
          </button>
        )}

        {activeBooking.bookingStatus === 'TRIP_STARTED' && (
          <button
            onClick={() => setShowCompletionModal(true)}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <FaFlag />
            Complete Ride
          </button>
        )}
      </div>
    </div>
  </div>
)}

        {/* No Active Ride State */}
        {activeTab === 'active' && !activeBooking && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-12 text-center">
            <FaCar className="text-5xl text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Ride</h3>
            <p className="text-slate-400 mb-4">
              You don't have any active rides at the moment
            </p>
            <button
              onClick={() => setActiveTab('available')}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-xl font-semibold"
            >
              View Available Rides
            </button>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {showOtpModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Enter OTP to Start Ride</h3>
            <p className="text-sm text-slate-400 mb-4">
              Ask the customer for the 6-digit OTP to start the ride
            </p>
            
            <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
              <p className="text-xs text-slate-400">Customer Name</p>
              <p className="text-white font-medium">{selectedBooking.userId?.name || 'Customer'}</p>
            </div>

            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-center text-2xl tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              maxLength="6"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpInput('');
                  setSelectedBooking(null);
                }}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStartRide}
                disabled={otpInput.length !== 6 || isLoading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                Verify & Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ride Completion Modal - FIXED WITH DATABASE PRICING */}
      {showCompletionModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Complete Ride</h3>
            
            {isLoadingPricing ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-4xl text-teal-400" />
              </div>
            ) : (
              (() => {
                const pricing = vehiclePricing[activeBooking.vehicleType];
                if (!pricing) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-red-400">Pricing information not available</p>
                    </div>
                  );
                }
                
                const estimatedDistance = activeBooking.distanceKm || 0;
                const actualDistance = rideCompletionData.actualDistance || estimatedDistance;
                const additionalCharges = rideCompletionData.additionalCharges || 0;
                
                // Calculate fares using database pricing
                const baseFare = pricing.baseFare;
                const perKmRate = pricing.pricePerKm;
                const commissionPercent = pricing.adminCommissionPercent || 25;
                
                const distanceFare = actualDistance * perKmRate;
                const subtotal = baseFare + distanceFare;
                const totalFare = subtotal + additionalCharges;
                const commission = Math.round(totalFare * commissionPercent / 100);
                const riderEarning = totalFare - commission;
                
                return (
                  <div className="space-y-4 mb-6">
                    {/* Distance Input */}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Actual Distance (km)
                      </label>
                      <input
                        type="number"
                        value={rideCompletionData.actualDistance}
                        onChange={(e) => setRideCompletionData({
                          ...rideCompletionData,
                          actualDistance: parseFloat(e.target.value) || 0
                        })}
                        step="0.1"
                        min={estimatedDistance}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter actual distance"
                        autoFocus
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Estimated: {estimatedDistance.toFixed(2)} km
                      </p>
                    </div>

                    {/* Additional Charges */}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Additional Charges (₹)
                      </label>
                      <input
                        type="number"
                        value={rideCompletionData.additionalCharges}
                        onChange={(e) => setRideCompletionData({
                          ...rideCompletionData,
                          additionalCharges: parseFloat(e.target.value) || 0
                        })}
                        min="0"
                        step="10"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Toll, parking, etc."
                      />
                    </div>

                    {/* Fare Breakdown from Database */}
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">Fare Breakdown</h4>
                      
                      <div className="space-y-2">
                        {/* Vehicle Type & Rate */}
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Vehicle Type:</span>
                          <span className="text-white font-medium">{activeBooking.vehicleType}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Rate per km:</span>
                          <span className="text-white font-bold">₹{perKmRate}</span>
                        </div>
                        
                        {/* Base Fare */}
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Base Fare:</span>
                          <span className="text-white">₹{baseFare}</span>
                        </div>
                        
                        {/* Distance Fare */}
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Distance Fare:</span>
                          <span className="text-white">
                            {actualDistance.toFixed(1)} km × ₹{perKmRate} = ₹{Math.round(distanceFare)}
                          </span>
                        </div>
                        
                        {/* Additional Charges */}
                        {additionalCharges > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Additional Charges:</span>
                            <span className="text-white">+ ₹{additionalCharges}</span>
                          </div>
                        )}
                        
                        {/* Divider */}
                        <div className="border-t border-slate-600 my-2"></div>
                        
                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Subtotal:</span>
                          <span className="text-white">₹{Math.round(subtotal)}</span>
                        </div>
                        
                        {/* Total Fare (what customer pays) */}
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-300">💰 TOTAL FARE (Customer pays):</span>
                          <span className="text-teal-400 text-xl">₹{Math.round(totalFare)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Specific Info */}
                    {activeBooking.paymentMethod === 'CASH' ? (
                      <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
                        <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                          <FaMoneyBillWave /> Cash Payment
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-slate-300">
                            <span className="text-slate-400">Collect from customer:</span>{' '}
                            <span className="text-white font-bold">₹{Math.round(totalFare)}</span>
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-400">Company commission ({commissionPercent}%):</span>{' '}
                            <span className="text-yellow-400">₹{commission}</span>
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-400">Your earnings:</span>{' '}
                            <span className="text-green-400 font-bold">₹{Math.round(riderEarning)}</span>
                          </p>
                          <p className="text-xs text-yellow-400 mt-2">
                            ⏰ Please remit ₹{commission} to company within 3 days
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                          <FaCreditCard /> Online Payment
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-slate-300">
                            <span className="text-slate-400">Total fare:</span>{' '}
                            <span className="text-white">₹{Math.round(totalFare)}</span>
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-400">Company commission ({commissionPercent}%):</span>{' '}
                            <span className="text-blue-400">₹{commission}</span>
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-400">Your earnings:</span>{' '}
                            <span className="text-green-400 font-bold">₹{Math.round(riderEarning)}</span>
                          </p>
                          <p className="text-xs text-blue-400 mt-2">
                            ⏰ Amount will be credited to your account within 7 days
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteRide}
                disabled={!rideCompletionData.actualDistance || rideCompletionData.actualDistance < (activeBooking?.distanceKm || 0) || isLoading || isLoadingPricing}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                Complete Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rides;
