import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Car, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  Phone,
  Navigation,
  ArrowLeft,
  Share2,
  Copy
} from 'lucide-react';
import { toast } from 'react-toastify';

const RideTrackingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('SEARCHING_DRIVER');
  const [assignedRider, setAssignedRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollingIntervalRef = useRef(null);

  // Poll for booking status every 30 seconds for automatic updates
  const startPolling = () => {
    if (pollingIntervalRef.current) return;
    
    pollingIntervalRef.current = setInterval(async () => {
      if (!bookingData?.bookingId) return;
      
      try {
        const response = await api.get(`/api/bookings/${bookingData.bookingId}`);
        if (response.data.success) {
          const booking = response.data.data;
          console.log('📊 Polling - Booking status:', booking.bookingStatus);
          
          if (booking.riderId && currentStatus === 'SEARCHING_DRIVER') {
            setAssignedRider({
              name: booking.riderId.name,
              phone: booking.riderId.phone,
              cabDetails: booking.cabId
            });
            setCurrentStatus('DRIVER_ASSIGNED');
            toast.success('Driver assigned! Driver is on the way.');
          }
          
          if (booking.bookingStatus === 'DRIVER_ARRIVED' && currentStatus !== 'DRIVER_ARRIVED') {
            setCurrentStatus('DRIVER_ARRIVED');
            toast.info('Driver has arrived at pickup location');
          }
          
          if (booking.bookingStatus === 'TRIP_STARTED' && currentStatus !== 'TRIP_STARTED') {
            setCurrentStatus('TRIP_STARTED');
            toast.info('Trip started! Enjoy your ride.');
          }
          
          if (booking.bookingStatus === 'TRIP_COMPLETED') {
            setCurrentStatus('TRIP_COMPLETED');
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            toast.success('Trip completed! Redirecting to payment...');
            setTimeout(() => {
              navigate('/customer/payment', { state: { bookingData: { bookingId: bookingData.bookingId } } });
            }, 2000);
          }
          
          if (booking.bookingStatus === 'CANCELLED') {
            setCurrentStatus('CANCELLED');
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            toast.error('Booking was cancelled');
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 30000);
  };

  useEffect(() => {
    const data = location.state?.bookingData;
    if (!data) {
      toast.error('No booking data found');
      navigate('/book');
      return;
    }
    setBookingData(data);
    setLoading(false);

    // Join user room and booking room for real-time updates
    if (socket && isConnected) {
      if (user?._id) {
        socket.emit('join-user', user._id);
        console.log('📡 Joined user room:', user._id);
      }
      socket.emit('join-booking', data.bookingId);
      console.log('📡 Joined booking room:', data.bookingId);
    }
    
    // Start polling as fallback
    startPolling();
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [location.state, navigate, socket, isConnected, user]);

  useEffect(() => {
    if (!socket || !isConnected || !bookingData?.bookingId) return;

    const handleRiderAssigned = (data) => {
      console.log('🎯 Socket: Rider assigned:', data);
      setAssignedRider({
        name: data.riderName,
        phone: data.riderPhone,
        cabDetails: data.cabDetails
      });
      setCurrentStatus('DRIVER_ASSIGNED');
      toast.success('Driver assigned! Driver is on the way.');
    };

    const handleDriverArrived = (data) => {
      console.log('🎯 Socket: Driver arrived:', data);
      setCurrentStatus('DRIVER_ARRIVED');
      toast.info('Driver has arrived at pickup location');
    };

    const handleTripStarted = (data) => {
      console.log('🎯 Socket: Trip started:', data);
      setCurrentStatus('TRIP_STARTED');
      toast.info('Trip started! Enjoy your ride.');
    };

    const handleTripCompleted = (data) => {
      console.log('🎯 Socket: Trip completed:', data);
      setCurrentStatus('TRIP_COMPLETED');
      toast.success('Trip completed! Redirecting to payment...');
      setTimeout(() => {
        navigate('/customer/payment', { state: { bookingData: { bookingId: bookingData.bookingId } } });
      }, 2000);
    };

    const handleBookingCancelled = (data) => {
      console.log('🎯 Socket: Booking cancelled:', data);
      setCurrentStatus('CANCELLED');
      toast.error('Booking was cancelled');
    };

    const handleStatusChanged = (data) => {
      console.log('🎯 Socket: Status changed:', data);
      if (data.status === 'DRIVER_ASSIGNED') {
        if (data.riderName) {
          setAssignedRider({
            name: data.riderName,
            phone: data.riderPhone,
            cabDetails: data.cabDetails
          });
        }
        setCurrentStatus('DRIVER_ASSIGNED');
        toast.success('Driver assigned! Driver is on the way.');
      } else if (data.status === 'DRIVER_ARRIVED') {
        setCurrentStatus('DRIVER_ARRIVED');
        toast.info('Driver has arrived at pickup location');
      } else if (data.status === 'TRIP_STARTED') {
        setCurrentStatus('TRIP_STARTED');
        toast.info('Trip started! Enjoy your ride.');
      } else if (data.status === 'TRIP_COMPLETED') {
        handleTripCompleted(data);
      }
    };

    socket.on('rider-assigned', handleRiderAssigned);
    socket.on('driver-arrived', handleDriverArrived);
    socket.on('trip-started', handleTripStarted);
    socket.on('trip-status-changed', handleStatusChanged);
    socket.on('booking-cancelled', handleBookingCancelled);

    return () => {
      socket.off('rider-assigned', handleRiderAssigned);
      socket.off('driver-arrived', handleDriverArrived);
      socket.off('trip-started', handleTripStarted);
      socket.off('trip-status-changed', handleStatusChanged);
      socket.off('booking-cancelled', handleBookingCancelled);
    };
  }, [socket, isConnected, bookingData?.bookingId, navigate]);

  const handleCopyOTP = () => {
    if (bookingData?.otp) {
      navigator.clipboard.writeText(bookingData.otp);
      toast.success('OTP copied to clipboard!');
    }
  };

  const handleGoBack = () => {
    if (currentStatus === 'SEARCHING_DRIVER' || currentStatus === 'CANCELLED') {
      navigate('/book');
    } else {
      navigate('/customer/dashboard');
    }
  };

  const handleCallDriver = () => {
    if (assignedRider?.phone) {
      window.location.href = `tel:${assignedRider.phone}`;
    }
  };

  const handleRefreshStatus = async () => {
    if (!bookingData?.bookingId) return;
    
    try {
      const response = await api.get(`/api/bookings/${bookingData.bookingId}`);
      if (response.data.success) {
        const booking = response.data.data;
        console.log('🔄 Manual refresh - Status:', booking.bookingStatus);
        
        if (booking.riderId && currentStatus === 'SEARCHING_DRIVER') {
          setAssignedRider({
            name: booking.riderId.name,
            phone: booking.riderId.phone,
            cabDetails: booking.cabId
          });
          setCurrentStatus('DRIVER_ASSIGNED');
          toast.success('Driver found!');
        }
        
        if (booking.bookingStatus === 'DRIVER_ARRIVED') {
          setCurrentStatus('DRIVER_ARRIVED');
        }
        
        if (booking.bookingStatus === 'TRIP_STARTED') {
          setCurrentStatus('TRIP_STARTED');
        }
        
        if (booking.bookingStatus === 'TRIP_COMPLETED') {
          setCurrentStatus('TRIP_COMPLETED');
          toast.success('Trip completed!');
          setTimeout(() => navigate('/customer/payment', { state: { bookingData: { bookingId: bookingData.bookingId } } }), 2000);
        }
        
        if (booking.bookingStatus === 'CANCELLED') {
          setCurrentStatus('CANCELLED');
        }
      }
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  const getStatusMessage = () => {
    switch (currentStatus) {
      case 'SEARCHING_DRIVER':
        return 'Searching for available drivers...';
      case 'DRIVER_ASSIGNED':
        return 'Driver accepted your ride!';
      case 'DRIVER_ARRIVED':
        return 'Driver has arrived at pickup location';
      case 'TRIP_STARTED':
        return 'Trip in progress';
      case 'TRIP_COMPLETED':
        return 'Trip completed!';
      case 'CANCELLED':
        return 'Booking was cancelled';
      default:
        return 'Processing...';
    }
  };

  const getStatusSubMessage = () => {
    switch (currentStatus) {
      case 'SEARCHING_DRIVER':
        return 'Please wait while we find a driver for you';
      case 'DRIVER_ASSIGNED':
        return `${assignedRider?.name || 'Driver'} is on the way to pickup location`;
      case 'DRIVER_ARRIVED':
        return 'Please meet the driver at the pickup point';
      case 'TRIP_STARTED':
        return 'Enjoy your ride!';
      case 'TRIP_COMPLETED':
        return 'Thank you for riding with us!';
      case 'CANCELLED':
        return 'Please try booking again';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={handleGoBack}
          className="flex items-center text-white hover:bg-white/10 rounded-lg p-2"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleRefreshStatus}
          className="flex items-center text-white hover:bg-white/10 rounded-lg p-2"
        >
          <Loader2 className="h-5 w-5 mr-1" />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* Status Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
              {currentStatus === 'SEARCHING_DRIVER' && (
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              )}
              {currentStatus === 'DRIVER_ASSIGNED' && (
                <Car className="h-10 w-10 text-green-600" />
              )}
              {currentStatus === 'DRIVER_ARRIVED' && (
                <Navigation className="h-10 w-10 text-yellow-600" />
              )}
              {currentStatus === 'TRIP_STARTED' && (
                <Car className="h-10 w-10 text-blue-600" />
              )}
              {currentStatus === 'TRIP_COMPLETED' && (
                <CheckCircle className="h-10 w-10 text-green-600" />
              )}
              {currentStatus === 'CANCELLED' && (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStatus === 'SEARCHING_DRIVER' && 'Finding Your Driver'}
              {currentStatus === 'DRIVER_ASSIGNED' && 'Driver Accepted!'}
              {currentStatus === 'DRIVER_ARRIVED' && 'Driver Arrived!'}
              {currentStatus === 'TRIP_STARTED' && 'Trip Started'}
              {currentStatus === 'TRIP_COMPLETED' && 'Trip Completed'}
              {currentStatus === 'CANCELLED' && 'Booking Cancelled'}
            </h2>
            
            <p className="text-gray-600">{getStatusMessage()}</p>
            <p className="text-sm text-gray-500 mt-1">{getStatusSubMessage()}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>Searching</span>
              <span>Accepted</span>
              <span>Arrived</span>
              <span>Started</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentStatus === 'CANCELLED' ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ 
                  width: currentStatus === 'SEARCHING_DRIVER' ? '15%' :
                         currentStatus === 'DRIVER_ASSIGNED' ? '40%' :
                         currentStatus === 'DRIVER_ARRIVED' ? '65%' :
                         currentStatus === 'TRIP_STARTED' ? '90%' :
                         currentStatus === 'TRIP_COMPLETED' ? '100%' : '0%'
                }}
              ></div>
            </div>
          </div>

          {/* OTP Section */}
          {currentStatus !== 'CANCELLED' && currentStatus !== 'TRIP_COMPLETED' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Share this OTP with your driver</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-bold text-yellow-900 tracking-wider">
                      {bookingData?.otp || '------'}
                    </span>
                    <button
                      onClick={handleCopyOTP}
                      className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-lg"
                      title="Copy OTP"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm text-yellow-700">
                  <p>Booking ID</p>
                  <p className="font-mono text-xs">{bookingData?.bookingId?.slice(-8)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Driver Info Card */}
          {assignedRider && currentStatus !== 'CANCELLED' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Car className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{assignedRider.name}</p>
                  <p className="text-sm text-gray-600">
                    {assignedRider.cabDetails?.cabModel || 'Sedan'} • {assignedRider.cabDetails?.cabNumber || '---'}
                  </p>
                  {currentStatus !== 'TRIP_COMPLETED' && (
                    <button
                      onClick={handleCallDriver}
                      className="mt-2 flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
                    >
                      <Phone className="h-4 w-4" />
                      Call Driver
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Trip Details */}
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium text-gray-900">{bookingData?.pickup || '---'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Dropoff</p>
                  <p className="font-medium text-gray-900">{bookingData?.drop || '---'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium text-gray-900">{bookingData?.vehicleType || '---'}</p>
                </div>
              </div>
              {bookingData?.tripType === 'ROUND_TRIP' && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Trip Type</p>
                    <p className="font-medium text-gray-900">Round Trip</p>
                    {bookingData?.tripDays && (
                      <p className="text-xs text-gray-500">{bookingData.tripDays} day{bookingData.tripDays > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fare Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estimated Fare</span>
            <span className="text-2xl font-bold text-gray-900">₹{bookingData?.estimatedFare || 0}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Final fare may vary based on actual distance</p>
        </div>

        {/* Help Text */}
        {currentStatus === 'SEARCHING_DRIVER' && (
          <p className="text-center text-white/80 text-sm mt-6">
            Driver will accept your ride shortly. Please keep this page open.
          </p>
        )}
      </div>
    </div>
  );
};

export default RideTrackingPage;
