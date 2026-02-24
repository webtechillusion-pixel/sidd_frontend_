import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { Earnings } from './Earnings';
import  Rides  from './Rides';
import  Navigation  from './Navigation';
import { Profile } from './Profile';
import { Documents } from './Documents';
import { Toast } from './Toast';
import RiderLiveTracking from '../../components/RiderLiveTracking';
import RiderSupport from '../../components/RiderSupport';
import CustomerRiderChat, { ChatButton } from '../../components/CustomerRiderChat';
import riderService from '../../services/riderService';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export default function RiderDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [online, setOnline] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const { socket, isConnected, joinRiderRoom } = useSocket();

  const locationWatchIdRef = useRef(null);
  const bookingRefreshIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const onlineStatusRef = useRef(false);
  const lastLocationUpdateRef = useRef(0);

  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalEarnings: 0,
    totalRides: 0,
    rating: 0,
    totalRatings: 0,
    acceptance: 0,
    weeklyEarnings: [],
    hourlyData: [],
    rideHistory: [],
    paymentHistory: [],
    monthlyEarnings: [],
    peakHours: [],
    performance: null
  });

  const [liveEarnings, setLiveEarnings] = useState(0);
  const [activeRide, setActiveRide] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [rideStatus, setRideStatus] = useState('waiting');
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
    photo: '',
    approvalStatus: '',
    availabilityStatus: '',
    currentLocation: null,
    overallRating: 0,
    totalRatings: 0,
    completedRides: 0,
    rejectedRides: 0,
    acceptanceRate: 0,
    avgResponseTime: 0,
    cab: null
  });
  const [toasts, setToasts] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await riderService.getNotifications({ page: 1, limit: 10 });
      if (response.success && response.data) {
        setNotificationList(response.data.notifications || []);
        const unread = response.data.notifications?.filter(n => !n.isRead).length || 0;
        setNotifications(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      await riderService.markNotificationRead(notificationId);
      setNotificationList(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setNotifications(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsRead = async () => {
    try {
      await riderService.markAllNotificationsRead();
      setNotificationList(prev => prev.map(n => ({ ...n, isRead: true })));
      setNotifications(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    onlineStatusRef.current = online;
  }, [online]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchRiderProfile();
    fetchEarnings();
    fetchNotifications();
    
    // Setup socket listeners for real-time booking requests
    if (socket && isConnected && user?._id) {
      console.log('🔗 Setting up rider socket listeners for user:', user._id);
      
      // Join rider room with multiple formats for compatibility
      joinRiderRoom(user._id);
      
      console.log('📢 Joined rider rooms for:', user._id);
      
      // Listen for new booking requests
      const handleNewBookingRequest = (bookingData) => {
        console.log('📲 Raw booking data received:', bookingData);
        
        if (isMountedRef.current && onlineStatusRef.current) {
          console.log('📨 New booking request received:', bookingData);
          
          const transformedBooking = {
            id: bookingData.bookingId || bookingData._id,
            passenger: bookingData.user?.name || bookingData.customerInfo?.name || bookingData.userId?.name || 'Passenger',
            pickup: bookingData.pickup?.addressText || 'Pickup location',
            dropoff: bookingData.drop?.addressText || 'Drop location',
            distance: `${bookingData.distanceKm || bookingData.distanceFromRider || 2.5} km`,
            fare: bookingData.estimatedFare || 0,
            eta: '5 min',
            rating: bookingData.user?.rating || bookingData.customerInfo?.rating || 4.5,
            details: {
              ...bookingData,
              acceptanceDeadline: new Date(Date.now() + 60000).toISOString() // 1 minute to respond
            }
          };
          
          console.log('✨ Transformed booking:', transformedBooking);
          
          setRideRequests(prev => {
            // Avoid duplicates
            const exists = prev.find(r => r.id === transformedBooking.id);
            if (exists) {
              console.log('⚠️ Duplicate booking ignored:', transformedBooking.id);
              return prev;
            }
            console.log('➕ Adding new booking to list');
            return [...prev, transformedBooking];
          });
          
          showToast('📨 New ride request received!', 'success');
          
          // Play notification sound (optional)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Ride Request', {
              body: `From ${transformedBooking.pickup} to ${transformedBooking.dropoff}`,
              icon: '/favicon.ico'
            });
          }
        } else {
          console.log('⚠️ Booking ignored - rider offline or component unmounted');
        }
      };
      // Add a manual refresh function and expose it to the Rides component

      
      // Listen for global booking requests (fallback)
      const handleGlobalBookingRequest = (bookingData) => {
        console.log('🌍 Global booking request received:', bookingData);
        
        // Check if this booking is for our vehicle type
        if (profileData.cab?.cabType === bookingData.vehicleType || !profileData.cab) {
          handleNewBookingRequest(bookingData);
        }
      };
      
      // Listen for booking taken by other rider
      const handleBookingTaken = (data) => {
        if (isMountedRef.current) {
          console.log('🚨 Booking taken by another rider:', data.bookingId);
          setRideRequests(prev => prev.filter(r => r.id !== data.bookingId));
          showToast('🚗 Booking was taken by another rider', 'info');
        }
      };
      
      // Listen for booking cancellation
      const handleBookingCancelled = (data) => {
        if (isMountedRef.current) {
          console.log('❌ Booking cancelled:', data.bookingId);
          setRideRequests(prev => prev.filter(r => r.id !== data.bookingId));
          showToast('❌ Customer cancelled the booking', 'info');
        }
      };

      // Handle ride completion - auto refresh earnings
      const handleRideCompleted = (data) => {
        console.log('🎉 Ride completed:', data);
        if (isMountedRef.current) {
          showToast(`Ride completed! Earned ₹${data.riderEarning}`, 'success');
          // Refresh earnings and stats
          fetchEarnings();
          fetchRiderProfile();
          // Refresh available bookings
          if (onlineStatusRef.current && profileData.approvalStatus === 'APPROVED') {
            fetchAvailableBookings();
          }
          // Refresh active ride
          setActiveRide(null);
        }
      };

      // Handle booking status changes
      const handleBookingStatusChanged = (data) => {
        console.log('📊 Booking status changed:', data);
        if (isMountedRef.current) {
          // Refresh active ride data
          setTimeout(() => {
            if (activeRide) {
              setActiveRide(prev => ({ ...prev, bookingStatus: data.status }));
            }
          }, 500);
        }
      };
      
      socket.on('new-booking-request', handleNewBookingRequest);
      socket.on('global-booking-request', handleGlobalBookingRequest);
      socket.on('booking-taken', handleBookingTaken);
      socket.on('booking-cancelled', handleBookingCancelled);
      socket.on('ride-completed', handleRideCompleted);
      socket.on('trip-status-changed', handleBookingStatusChanged);
      
      // Auto-refresh earnings and profile every 30 seconds
      const earningsInterval = setInterval(() => {
        if (isMountedRef.current) {
          fetchEarnings();
          fetchRiderProfile();
        }
      }, 30000);
      
      return () => {
        console.log('🧹 Cleaning up rider socket listeners');
        socket.off('new-booking-request', handleNewBookingRequest);
        socket.off('global-booking-request', handleGlobalBookingRequest);
        socket.off('booking-taken', handleBookingTaken);
        socket.off('booking-cancelled', handleBookingCancelled);
        socket.off('ride-completed', handleRideCompleted);
        socket.off('trip-status-changed', handleBookingStatusChanged);
        clearInterval(earningsInterval);
      };
    } else {
      console.log('⚠️ Socket not connected - using polling fallback');
      // Fallback: Poll for bookings every 30 seconds if socket fails
      const pollInterval = setInterval(() => {
        if (onlineStatusRef.current && profileData.approvalStatus === 'APPROVED') {
          fetchAvailableBookings().catch(console.error);
        }
      }, 30000);

      // Also poll for earnings in fallback mode
      const earningsPollInterval = setInterval(() => {
        if (isMountedRef.current) {
          fetchEarnings();
        }
      }, 30000);
      
      return () => {
        clearInterval(pollInterval);
        clearInterval(earningsPollInterval);
      };
    }
    
    return () => {
      isMountedRef.current = false;
      stopAllTracking();
      clearAllIntervals();
      
      // Cleanup socket listeners
      if (socket) {
        socket.off('new-booking-request');
        socket.off('booking-taken');
      }
    };
  }, [socket, isConnected, user, profileData.approvalStatus]);

  const stopAllTracking = () => {
    stopLocationTracking();
  };

  const clearAllIntervals = () => {
    if (bookingRefreshIntervalRef.current) {
      clearInterval(bookingRefreshIntervalRef.current);
      bookingRefreshIntervalRef.current = null;
    }
  };

  const fetchRiderProfile = async () => {
    try {
      const response = await riderService.getProfile();
      
      if (response.success && isMountedRef.current) {
        const { rider, cab, wallet, recentEarnings } = response.data;
        
        setProfileData({
          name: rider.name,
          phone: rider.phone,
          email: rider.email,
          photo: rider.photo,
          approvalStatus: rider.approvalStatus,
          availabilityStatus: rider.availabilityStatus,
          isOnline: rider.isOnline,
          currentLocation: rider.currentLocation,
          overallRating: rider.overallRating,
          totalRatings: rider.totalRatings,
          completedRides: rider.completedRides,
          rejectedRides: rider.rejectedRides,
          acceptanceRate: rider.acceptanceRate,
          avgResponseTime: rider.avgResponseTime,
          cab: cab
        });

        setOnline(rider.isOnline || false);
        onlineStatusRef.current = rider.isOnline || false;
        
        setStats(prev => ({
          ...prev,
          todayEarnings: prev.todayEarnings,
          totalRides: rider.completedRides || 0,
          rating: rider.overallRating || 0,
          totalRatings: rider.totalRatings || 0,
          acceptance: rider.acceptanceRate || (rider.completedRides > 0 ? Math.min(100, (rider.completedRides / (rider.completedRides + (rider.rejectedRides || 0))) * 100) : 0),
          performance: rider.performance || {
            completionRate: rider.completedRides > 0 ? 95 : 0,
            responseTime: rider.avgResponseTime || 0,
            customerSatisfaction: rider.overallRating || 0
          },
          rideHistory: recentEarnings?.map(earning => ({
            id: earning._id,
            passenger: `Ride #${earning.bookingId?._id?.slice(-4) || '0000'}`,
            fare: earning.riderEarning || 0,
            time: new Date(earning.createdAt).toLocaleTimeString() || '',
            status: earning.payoutStatus?.toLowerCase() || 'completed'
          })) || []
        }));

        setLiveEarnings(wallet?.balance || 0);
        
        if (rider.isOnline && rider.approvalStatus === 'APPROVED') {
          startLocationTracking();
          // Remove automatic fetching on profile load
        }
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (isMountedRef.current) {
        // Only show error if it's not a network issue
        if (error.code !== 'ERR_NETWORK') {
          showToast('Failed to load profile', 'error');
        }
      }
    }
  };

  

  
  const startLocationTracking = () => {
    if (locationWatchIdRef.current) return; // Already tracking
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      showToast('Geolocation not supported. Cannot track location.', 'error');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        if (now - lastLocationUpdateRef.current < 10000) return; // Throttle: Update every 10 seconds

        const { latitude, longitude } = position.coords;
        console.log('Location updated in real-time:', { latitude, longitude });
        updateLocation(latitude, longitude); // Send to backend
        lastLocationUpdateRef.current = now;
      },
      (error) => {
        console.error('Location tracking error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          showToast('Location permission denied. Enable in browser settings.', 'error');
        } else {
          showToast('Failed to get location.', 'error');
        }
      },
      {
        enableHighAccuracy: true, // Better accuracy for ridesharing
        timeout: 10000,          // 10s timeout
        maximumAge: 0            // No cached positions
      }
    );

    locationWatchIdRef.current = watchId;
    console.log('Started location tracking with watch ID:', watchId);
  };

  const stopLocationTracking = () => {
    if (locationWatchIdRef.current) {
      navigator.geolocation.clearWatch(locationWatchIdRef.current);
      locationWatchIdRef.current = null;
      console.log('Stopped location tracking');
    }
    clearAllIntervals();
  };

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !onlineStatusRef.current;
      onlineStatusRef.current = newStatus;
      
      const response = await riderService.toggleOnlineStatus(newStatus);
      
      if (response.success && isMountedRef.current) {
        setOnline(newStatus);
        
        setProfileData(prev => ({
          ...prev,
          isOnline: newStatus,
          availabilityStatus: newStatus ? 'AVAILABLE' : 'INACTIVE'
        }));
        
        showToast(`You are now ${newStatus ? 'online' : 'offline'}`, newStatus ? 'success' : 'info');
        
        if (newStatus) {
          // Check geolocation permission before starting
          if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
              if (result.state === 'prompt' || result.state === 'denied') {
                showToast('Please enable location permissions for real-time tracking.', 'info');
              }
              startLocationTracking();
            });
          } else {
            startLocationTracking();
          }
          // Remove automatic fetching when going online
        } else {
          stopLocationTracking();
          setRideRequests([]);
        }
      } else if (isMountedRef.current) {
        onlineStatusRef.current = !newStatus;
        showToast('Failed to update online status', 'error');
      }
    } catch (error) {
      console.error('Toggle online status error:', error);
      if (isMountedRef.current) {
        onlineStatusRef.current = !onlineStatusRef.current;
        showToast('Failed to update online status', 'error');
      }
    }
  };

  const updateLocation = async (lat, lng) => {
    try {
      await riderService.updateLocation({ lat, lng });
      
      setProfileData(prev => ({
        ...prev,
        currentLocation: { type: 'Point', coordinates: [lng, lat] }
      }));
      
      // Remove automatic fetching on location update
    } catch (error) {
      console.error('Location update error:', error);
      // Don't show error toast for location updates to avoid spam
    }
  };

  const fetchEarnings = async () => {
    try {
      const today = new Date();
      const todayStr = today.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgoStr = thirtyDaysAgo.toLocaleDateString('en-CA');
      
      console.log('Fetching earnings for today:', todayStr, 'to:', thirtyDaysAgoStr);
      
      // Fetch today's earnings
      const todayResponse = await riderService.getEarnings({
        startDate: todayStr,
        endDate: todayStr,
        page: 1,
        limit: 20
      });

      console.log('Today earnings response:', todayResponse);

      // Fetch total earnings (last 30 days or all time)
      const totalResponse = await riderService.getEarnings({
        startDate: thirtyDaysAgoStr,
        endDate: todayStr,
        page: 1,
        limit: 1
      });

      console.log('Total earnings response:', totalResponse);

      // Also fetch ratings
      const ratingsResponse = await riderService.getRatings({ page: 1, limit: 10 }).catch(() => ({ success: false }));

      if (isMountedRef.current) {
        const todayData = todayResponse.success ? todayResponse.data : {};
        const totalData = totalResponse.success ? totalResponse.data : {};
        
        const todaySummary = todayData?.summary || {};
        const totalSummary = totalData?.summary || {};
        
        console.log('Today summary:', todaySummary);
        console.log('Total summary:', totalSummary);
        
        setStats(prev => ({
          ...prev,
          todayEarnings: todaySummary.totalEarnings || 0,
          totalEarnings: totalSummary.totalEarnings || todaySummary.totalEarnings || 0,
          totalRides: todaySummary.totalRides || totalSummary.totalRides || prev.totalRides,
          rating: ratingsResponse.success ? (ratingsResponse.data?.summary?.averageRating || prev.rating) : prev.rating,
          totalRatings: ratingsResponse.success ? (ratingsResponse.data?.summary?.totalRatings || 0) : 0,
          paymentHistory: todayData?.earnings?.map(earning => ({
            id: earning._id,
            amount: earning.riderEarning,
            date: earning.createdAt,
            type: 'Ride Earnings',
            status: earning.payoutStatus
          })) || [],
          weeklyEarnings: todayData?.charts?.weeklyEarnings || [],
          monthlyEarnings: todayData?.charts?.monthlyEarnings || []
        }));
        
        setLiveEarnings(todaySummary.walletBalance || totalSummary.walletBalance || 0);
      }
    } catch (error) {
      console.error('Earnings fetch error:', error);
      if (isMountedRef.current) {
        showToast('Failed to load earnings', 'error');
      }
    }
  };

  const acceptRide = async (rideId) => {
    try {
      console.log('🚗 Attempting to accept ride:', rideId);
      const response = await riderService.acceptBooking(rideId);
      
      if (response.success && isMountedRef.current) {
        const ride = rideRequests.find(r => r.id === rideId);
        const bookingData = response.data?.booking;
        
        setActiveRide({
          ...ride,
          ...bookingData,
          phone: bookingData?.userId?.phone || ride.details?.customerInfo?.phone || ride.details?.user?.phone || '+91 98765 43210',
          currentLocation: 'Pickup Location',
          otp: response.data?.otp,
          pickup: bookingData?.pickup || ride?.pickup,
          drop: bookingData?.drop || ride?.dropoff,
          distanceKm: bookingData?.distanceKm || ride?.distance,
          estimatedFare: bookingData?.estimatedFare || ride?.fare,
          finalFare: bookingData?.finalFare,
          vehicleType: bookingData?.vehicleType,
          paymentMethod: bookingData?.paymentMethod
        });
        
        setRideRequests(prev => prev.filter(r => r.id !== rideId));
        setRideStatus('pickup');
        
        showToast('✅ Ride accepted successfully!', 'success');
        
        // Emit ride acceptance via socket
        if (socket && isConnected) {
          socket.emit('ride-accepted', {
            bookingId: rideId,
            riderId: user?._id,
            rider: {
              id: user?._id,
              name: profileData.name || user?.name,
              phone: profileData.phone || user?.phone,
              rating: profileData.overallRating || 4.5,
              photo: profileData.photo
            },
            estimatedArrival: 5 // minutes
          });
        }
        
      } else if (isMountedRef.current) {
        showToast(response.message || 'Failed to accept ride', 'error');
      }
    } catch (error) {
      console.error('Accept ride error:', error);
      if (isMountedRef.current) {
        const errorMsg = error.response?.data?.message || 'Failed to accept ride';
        showToast(errorMsg, 'error');
      }
    }
  };

  const declineRide = async (rideId) => {
    try {
      console.log('❌ Declining ride:', rideId);
      await riderService.rejectBooking(rideId);
      
      if (isMountedRef.current) {
        setRideRequests(prev => prev.filter(r => r.id !== rideId));
        showToast('❌ Ride declined', 'info');
        
        // Emit ride rejection via socket
        if (socket && isConnected) {
          socket.emit('ride-rejected', {
            bookingId: rideId,
            riderId: user?._id,
            reason: 'Rider declined'
          });
        }
      }
    } catch (error) {
      console.error('Decline ride error:', error);
      if (isMountedRef.current) {
        showToast('Failed to decline ride', 'error');
      }
    }
  };

// const startRide = async (bookingId) => {
//   try {
//     // const otp = prompt('Enter OTP from customer:');
//     if (!otp) return;

//     console.log('Starting ride with bookingId:', bookingId, 'OTP:', otp);
    
//     // Try the startRide endpoint first (more specific)
//     const response = await riderService.startRide(bookingId, otp);
    
//     if (response.success && isMountedRef.current) {
//       setRideStatus('ongoing');
//       showToast('Ride started successfully!', 'success');
      
//       // Also update trip status to TRIP_STARTED for consistency
//       try {
//         await riderService.updateTripStatus(bookingId, 'TRIP_STARTED', otp);
//       } catch (updateError) {
//         console.log('Update trip status after start:', updateError.message);
//         // Ignore this error, ride already started
//       }
      
//     } else if (isMountedRef.current) {
//       showToast(response.message || 'Failed to start ride', 'error');
//     }
//   } catch (error) {
//     console.error('Start ride error:', error);
//     if (isMountedRef.current) {
//       showToast(
//         error.response?.data?.message || 'Failed to start ride',
//         'error'
//       );
//     }
//   }
// };


  const completeRide = async (bookingId, finalDistance, additionalCharges = 0) => {
    try {
      const response = await riderService.updateTripStatus(
      bookingId,
      'TRIP_COMPLETED',
      null,                 // no OTP for completion
      finalDistance,
      additionalCharges
    );
      
      if (response.success && isMountedRef.current) {
        setActiveRide(null);
        setRideStatus('waiting');
        showToast('Ride completed successfully!', 'success');
        
        fetchEarnings();
        fetchRiderProfile();
        
        // Remove automatic refresh after completing ride
      } else if (isMountedRef.current) {
        showToast(response.message || 'Failed to complete ride', 'error');
      }
    } catch (error) {
      console.error('Complete ride error:', error);
      if (isMountedRef.current) {
        showToast(error.response?.data?.message || 'Failed to complete ride', 'error');
      }
    }
  };

  // const markDriverArrived = async (bookingId) => {
  //   try {

  //      const otp = prompt('Enter OTP from customer:');
  //   if (!otp) return;

  //     const response = await riderService.updateTripStatus(bookingId, 'DRIVER_ARRIVED');
      
  //     if (response.success && isMountedRef.current) {
  //       setRideStatus('arrived');
  //       showToast('OTP verified. You arrived at pickup!', 'success');
  //     } else if (isMountedRef.current) {
  //       showToast(response.message || 'Failed to update status', 'error');
  //     }
  //   } catch (error) {
  //     console.error('Mark arrived error:', error);
  //     if (isMountedRef.current) {
  //       showToast(error.response?.data?.message || 'Failed to update status', 'error');
  //     }
  //   }
  // };

const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Force logout regardless of any errors
      try {
        // Stop tracking
        if (stopAllTracking) stopAllTracking();
        if (clearAllIntervals) clearAllIntervals();
        
        // Disconnect socket safely
        try {
          if (socket && socket.disconnect) socket.disconnect();
        } catch (e) { console.log('Socket disconnect error:', e); }
        
      } catch (e) { console.log('Tracking stop error:', e); }
      
      // Always execute these - clear everything
      const token = localStorage.getItem('token');
      
      // Try to call logout API (non-blocking)
      if (token) {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/logout`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => {});
      }
      
      // Clear ALL storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Call auth logout
      try {
        authLogout();
      } catch (e) { console.log('Auth logout error:', e); }
      
      // Force redirect
      window.location.href = '/login';
    }
  };

  const showToast = useCallback((message, type = 'success') => {
    if (!isMountedRef.current) return;
    
    const id = `${Date.now()}-${Math.random()}`;
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      if (isMountedRef.current) {
        setToasts(prev => prev.filter(t => t.id !== id));
      }
    }, 3000);
  }, []);

  const fetchAvailableBookings = async () => {
    if (loadingBookings || !isMountedRef.current) return;
    
    setLoadingBookings(true);
    
    try {
      console.log('🔍 Fetching available bookings - Rider status:', {
        online: onlineStatusRef.current,
        approved: profileData.approvalStatus,
        hasToken: !!localStorage.getItem('token')
      });
      
      // Check prerequisites before making API call
      if (!onlineStatusRef.current) {
        console.log('⚠️ Rider is offline - skipping booking fetch');
        setRideRequests([]);
        return;
      }
      
      if (profileData.approvalStatus !== 'APPROVED') {
        console.log('⚠️ Rider not approved - skipping booking fetch');
        setRideRequests([]);
        return;
      }
      
      // Get rider's current location for fetching nearby bookings
      const riderLat = profileData.currentLocation?.coordinates?.[1] || 28.6139;
      const riderLng = profileData.currentLocation?.coordinates?.[0] || 77.2100;
      
      // Simple API call with better error handling
      const response = await riderService.getAvailableBookings({ 
        lat: riderLat, 
        lng: riderLng 
      });
      
      if (isMountedRef.current && response.success) {
        const bookings = response.data || [];
        
        if (bookings.length > 0) {
          const transformedBookings = bookings.map(booking => ({
            id: booking._id,
            passenger: booking.user?.name || 'Passenger',
            pickup: booking.pickup?.addressText || 'Pickup location',
            dropoff: booking.drop?.addressText || 'Drop location',
            distance: `${booking.distanceFromRider || 2.5} km away`,
            fare: booking.estimatedFare || 0,
            eta: '5 min',
            rating: booking.user?.rating || 4.5,
            details: booking
          }));
          
          setRideRequests(transformedBookings);
          console.log('✅ Bookings loaded:', transformedBookings.length);
        } else {
          setRideRequests([]);
          console.log('💭 No bookings available');
        }
      }
    } catch (error) {
      console.error('❌ Fetch bookings error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      
      if (isMountedRef.current) {
        setRideRequests([]);
        
        // Only show error toast for non-500 errors to avoid spam
        if (error.response?.status !== 500) {
          showToast(error.response?.data?.message || 'Failed to load bookings', 'error');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingBookings(false);
      }
    }
  };

const manualFetchBookings = useCallback(() => {
  if (onlineStatusRef.current && profileData.approvalStatus === 'APPROVED') {
    console.log('🔄 Manual refresh triggered');
    fetchAvailableBookings();
  } else {
    console.log('⚠️ Cannot refresh – offline or not approved');
    showToast('You need to be online and approved to refresh bookings', 'info');
  }
}, [profileData.approvalStatus, fetchAvailableBookings, showToast]);


  

  const handleEmergency = () => {
    showToast('Emergency SOS activated! Contacting support...', 'error');
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await riderService.updateProfile({
        name: profileData.name,
        phone: profileData.phone
      });
      
      if (response.success) {
        showToast('Profile updated successfully!', 'success');
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.name = profileData.name;
        user.phone = profileData.phone;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        showToast(response.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard stats={stats} profile={profileData} cab={profileData.cab} liveEarnings={liveEarnings} />;
      case "earnings":
        return <Earnings 
          stats={stats} 
          liveEarnings={liveEarnings} 
          profile={profileData} 
          showToast={showToast}
          setStats={setStats}
        />;
      case "rides":
        return (
          <Rides 
            activeRide={activeRide}
            rideRequests={rideRequests}
            rideStatus={rideStatus}
            acceptRide={acceptRide}
            declineRide={declineRide}
            updateRideStatus={async (status, otp = null, distance = null, charges = 0) => {
  if (status === 'ongoing' && activeRide) {
    try {
      const response = await riderService.updateTripStatus(
        activeRide.id,
        'TRIP_STARTED',
        otp
      );
      if (response.success) {
        setRideStatus('ongoing');
        showToast('Ride started successfully!', 'success');
        fetchRiderProfile();
      } else {
        showToast(response.message || 'Failed to start ride', 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to start ride', 'error');
    }
  } else if (status === 'completed' && activeRide) {
    completeRide(activeRide.id, distance, charges);
  } else {
    setRideStatus(status);
  }
}}
            handleEmergency={handleEmergency}
            profile={profileData}
            showToast={showToast}
            onPageLoad={() => {
              // Fetch bookings when rides page is loaded, but only once
              if (onlineStatusRef.current && profileData.approvalStatus === 'APPROVED' && !loadingBookings) {
                console.log('Rides page loaded - fetching bookings');
                fetchAvailableBookings();
              }
            }}
            onManualRefresh={manualFetchBookings}
            onRideComplete={() => {
              // Refresh data after ride completion
              fetchEarnings();
              fetchRiderProfile();
            }}
            onOtpVerified={() => {
              // Refresh data after OTP verification
              fetchRiderProfile();
            }}
          />
        );
case "navigation":
        return <Navigation updateLocation={updateLocation} showToast={showToast} />;
      case "documents":
        return (
          <Documents 
            cab={profileData.cab}
            rider={profileData}
            showToast={showToast}
          />
        );
      case "profile":
        return (
          <Profile 
            profileData={profileData}
            setProfileData={setProfileData}
            stats={stats}
            handleProfileUpdate={handleProfileUpdate}
            showToast={showToast}
          />
        );
      default:
        return <Dashboard stats={stats} profile={profileData} cab={profileData.cab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <Sidebar 
        activePage={activePage}
        setActivePage={setActivePage}
        online={online}
        toggleOnlineStatus={toggleOnlineStatus}
        notifications={notifications}
        handleLogout={handleLogout}
        onOpenSupport={() => setSupportOpen(true)}
      />

      <main className="flex-1 overflow-auto">
        <Header 
          activePage={activePage}
          setActivePage={setActivePage}
          online={online}
          stats={stats}
          liveEarnings={liveEarnings}
          handleLogout={handleLogout}
          toggleOnlineStatus={toggleOnlineStatus}
          notifications={notifications}
          notificationList={notificationList}
          showNotificationPanel={showNotificationPanel}
          setShowNotificationPanel={setShowNotificationPanel}
          markNotificationRead={markNotificationRead}
          markAllNotificationsRead={markAllNotificationsRead}
        />

        <div className="p-2 sm:p-4 lg:p-6">
          {/* Live Tracking Component for Active Ride */}
          {activeRide && (
            <RiderLiveTracking 
              activeRide={activeRide} 
              onOpenChat={() => setChatOpen(true)}
            />
          )}
          
          {loadingBookings && activePage === 'rides' && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
                <p className="text-blue-700 text-sm sm:text-base">Fetching nearby rides...</p>
              </div>
            </div>
          )}
          
          <div className="w-full overflow-x-auto">
            {renderActivePage()}
          </div>
        </div>
      </main>
      
      <Toast toasts={toasts} />
      
      {/* Chat and Support Components */}
      {activeRide && (
        <>
          <CustomerRiderChat
            bookingId={activeRide.id}
            userType="RIDER"
            otherUser={{
              name: activeRide.passenger,
              photo: null,
              phone: activeRide.phone
            }}
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            showToast={showToast}
          />
          
          {!chatOpen && (
            <ChatButton
              onClick={() => setChatOpen(true)}
              hasUnread={hasUnreadMessages}
            />
          )}
        </>
      )}
      
      {/* Rider Support Modal */}
      {supportOpen && (
        <RiderSupport onClose={() => setSupportOpen(false)} />
      )}

      {/* Notification Panel */}
      {showNotificationPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNotificationPanel(false)}></div>
          <div className="relative w-full max-w-md bg-white shadow-xl h-full overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-r from-teal-600 to-blue-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Notifications</h2>
                <button 
                  onClick={() => setShowNotificationPanel(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  ✕
                </button>
              </div>
              {notifications > 0 && (
                <button 
                  onClick={markAllNotificationsRead}
                  className="text-sm text-white/80 hover:text-white mt-2 flex items-center gap-1"
                >
                  <FaCheck /> Mark all as read
                </button>
              )}
            </div>
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              {notificationList.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                notificationList.map((notification, index) => (
                  <div 
                    key={notification._id || index}
                    onClick={() => markNotificationRead(notification._id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`font-medium ${!notification.isRead ? 'text-blue-800' : 'text-gray-800'}`}>
                        {notification.title || 'Notification'}
                      </h4>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
