import React, { useState, useEffect } from 'react';
import riderService from '../../services/riderService';
import { 
  FaRoute, 
  FaExclamationTriangle, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaCheck, 
  FaStop, 
  FaTimes, 
  FaStar,
  FaCar,
  FaClock,
  FaUserCircle,
  FaCalendarAlt,
  FaSyncAlt
} from "react-icons/fa";

export function Rides({ 
  activeRide, 
  rideRequests, 
  rideStatus, 
  acceptRide, 
  declineRide, 
  updateRideStatus, 
  handleEmergency,
  profile,
  showToast,
  onPageLoad,
  onManualRefresh   // ✅ Correct – just the prop name
}) {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [rideData, setRideData] = useState({ finalDistance: '', additionalCharges: '' });

  useEffect(() => {
    console.log('Rides Component - Ride Requests:', rideRequests);
    console.log('Rides Component - Active Ride:', activeRide);
    console.log('Rides Component - Ride Status:', rideStatus);
  }, [rideRequests, activeRide, rideStatus]);

  // Run onPageLoad once when component mounts
  useEffect(() => {
    if (onPageLoad) {
      console.log('Rides component mounted - calling onPageLoad once');
      onPageLoad();
    }
  }, []); // Empty dependency array – runs only once

  const handleStartRide = () => setShowOTPModal(true);

 const handleOTPSubmit = async () => {
  if (otp && activeRide) {
    try {
      console.log('Starting ride with ID:', activeRide.id, 'and OTP:', otp);
      
      // ✅ Call parent's updateRideStatus with status 'ongoing' and the OTP
      if (updateRideStatus) {
        await updateRideStatus('ongoing', otp);
        
        // ✅ Only close modal and clear OTP if the parent call succeeded
        setShowOTPModal(false);
        setOtp('');
        showToast('Ride started successfully!', 'success');
      }
    } catch (error) {
      console.error('Start ride error:', error);
      showToast(
        error.response?.data?.message || error.message || 'Failed to start ride',
        'error'
      );
    }
  } else {
    showToast('Please enter OTP', 'error');
  }
};

  const handleCompleteRide = () => setShowCompleteModal(true);

  const handleCompleteSubmit = () => {
  if (rideData.finalDistance && activeRide) {
    // ✅ Pass distance and additional charges to parent
    updateRideStatus('completed', rideData.finalDistance, rideData.additionalCharges);
    setShowCompleteModal(false);
    setRideData({ finalDistance: '', additionalCharges: '' });
  } else {
    showToast('Please enter the final distance', 'error');
  }
};

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTimeLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const secondsLeft = Math.floor((deadlineDate - now) / 1000);
    if (secondsLeft <= 0) return 'Expired';
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Auto-refresh timer for countdown
  useEffect(() => {
    const timer = setInterval(() => {}, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Emergency SOS Button */}
      <div className="flex justify-end">
        <button
          onClick={handleEmergency}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <FaExclamationTriangle />
          Emergency SOS
        </button>
      </div>

      {/* Active Ride Tracker */}
      {activeRide && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaRoute className="text-blue-500" />
            Active Ride Tracker
          </h3>
          
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              rideStatus === 'pickup' ? 'bg-yellow-100 text-yellow-800' :
              rideStatus === 'ongoing' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {rideStatus === 'pickup' ? 'Going to Pickup' :
               rideStatus === 'ongoing' ? 'Ride in Progress' : 'Completed'}
            </span>
          </div>

          {/* Passenger Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaUserCircle className="text-2xl text-teal-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{activeRide.passenger}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {activeRide.details?.user?.rating || 'No rating'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Trip Info</h4>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Distance:</span> {activeRide.distance} km</p>
                <p className="text-sm"><span className="font-medium">Fare:</span> ₹{Number(activeRide.fare || 0).toFixed(2)}</p>
                <p className="text-sm"><span className="font-medium">Trip Type:</span> {activeRide.details?.tripType || 'ONE_WAY'}</p>
                {activeRide.details?.bookingType && (
                  <p className="text-sm"><span className="font-medium">Booking Type:</span> {activeRide.details.bookingType}</p>
                )}
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Pickup</p>
                  <p className="text-sm text-gray-600">{activeRide.pickup}</p>
                </div>
              </div>
              <FaRoute className="text-blue-500" />
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="text-right">
                  <p className="font-medium">Dropoff</p>
                  <p className="text-sm text-gray-600">{activeRide.dropoff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ride Actions */}
          <div className="flex gap-3">
            {rideStatus === 'pickup' && (
              <button
                onClick={handleStartRide}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FaCheck />
                Start Ride
              </button>
            )}
            {rideStatus === 'ongoing' && (
              <button
                onClick={handleCompleteRide}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FaStop />
                Complete Ride
              </button>
            )}
          </div>
        </div>
      )}

      {/* Ride Request Panel */}
      {rideRequests.length > 0 && profile?.isOnline && (
        <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Incoming Ride Requests ({rideRequests.length})
            </h3>
            <button
              onClick={onManualRefresh}   // ✅ Use the prop function
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {rideRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                {/* ... rest of the request card ... */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg">{request.passenger}</h4>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar />
                      <span className="text-sm">{request.rating}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold text-green-600">₹{Number(request.fare || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{request.distance}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="truncate max-w-[120px] sm:max-w-[150px]">{request.pickup}</span>
                    </div>
                    <FaRoute className="text-gray-400 mx-2" />
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[120px] sm:max-w-[150px]">{request.dropoff}</span>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Booking Type Indicator */}
                {request.details?.bookingType && (
                  <div className="mb-3">
                    {request.details.bookingType === 'SCHEDULED' && request.details.scheduledTime ? (
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                        <FaCalendarAlt className="text-purple-500" />
                        <div>
                          <span className="text-sm font-medium text-purple-700">Scheduled Ride</span>
                          <p className="text-xs text-purple-600 mt-1">
                            Pickup: {formatTime(request.details.scheduledTime)}
                          </p>
                        </div>
                      </div>
                    ) : request.details.bookingType === 'IMMEDIATE' ? (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                        <FaClock className="text-green-500" />
                        <span className="text-sm font-medium text-green-700">Immediate Ride</span>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Trip Type Badge */}
                {request.details?.tripType && request.details.tripType === 'ROUND_TRIP' && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded border border-orange-200">
                      <FaSyncAlt className="text-xs" /> Round Trip
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => acceptRide(request.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                  >
                    <FaCheck />
                    Accept
                  </button>
                  <button
                    onClick={() => declineRide(request.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                  >
                    <FaTimes />
                    Decline
                  </button>
                </div>

                {request.details?.acceptanceDeadline && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">
                      Respond within: <span className="font-semibold text-red-600">
                        {calculateTimeLeft(request.details.acceptanceDeadline)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Ride Requests Message */}
      {rideRequests.length === 0 && profile?.isOnline && (
        <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaRoute className="text-blue-500 text-xl sm:text-2xl" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">No Ride Requests Available</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            We'll notify you as soon as ride requests come in your area.
          </p>
          <div className="text-xs sm:text-sm text-gray-500">
            <p>Make sure your location is enabled and you're in a busy area.</p>
          </div>
        </div>
      )}

      {/* Rider Offline Message */}
      {!profile?.isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCar className="text-yellow-500 text-xl sm:text-2xl" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-yellow-800">You're Offline</h3>
          <p className="text-yellow-700 mb-4 text-sm sm:text-base">
            Go online to start receiving ride requests and earning.
          </p>
        </div>
      )}

      {/* Ride Statistics */}
      {profile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
            <FaCar className="text-2xl sm:text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-bold">{profile.completedRides || 0}</h3>
            <p className="text-gray-600 text-sm sm:text-base">Total Rides</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
            <FaClock className="text-2xl sm:text-3xl text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-bold">{profile.overallRating || 0}</h3>
            <p className="text-gray-600 text-sm sm:text-base">Rating</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <FaMapMarkerAlt className="text-2xl sm:text-3xl text-green-500 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-bold">{profile.totalRatings || 0}</h3>
            <p className="text-gray-600 text-sm sm:text-base">Total Ratings</p>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Enter OTP to Start Ride</h3>
            <p className="text-gray-600 mb-4">Ask customer for the 4-digit OTP to verify and start the ride.</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="w-full p-3 border rounded-lg mb-4 text-center text-lg font-mono tracking-widest"
              maxLength={6}
            />
            <div className="flex gap-3">
              <button onClick={handleOTPSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">Verify & Start</button>
              <button onClick={() => setShowOTPModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Ride Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Complete Ride Details</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Distance (km)</label>
                <input
                  type="number"
                  value={rideData.finalDistance}
                  onChange={(e) => setRideData({...rideData, finalDistance: e.target.value})}
                  placeholder="Enter distance"
                  className="w-full p-3 border rounded-lg"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Charges (₹)</label>
                <input
                  type="number"
                  value={rideData.additionalCharges}
                  onChange={(e) => setRideData({...rideData, additionalCharges: e.target.value})}
                  placeholder="Enter additional charges"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCompleteSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">Complete Ride</button>
              <button onClick={() => setShowCompleteModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}