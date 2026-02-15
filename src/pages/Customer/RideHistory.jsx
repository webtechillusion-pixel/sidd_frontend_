import React from 'react';
import { ChevronRight, Calendar, MapPin, Car, Star, Clock, CheckCircle, XCircle } from 'lucide-react';

const RideHistory = ({ rideHistory = [], onBack, onSubmitReview }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2 text-sm font-medium"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Dashboard
          </button>
          <h2 className="text-xl font-bold text-gray-900">Ride History</h2>
          <p className="text-gray-600 text-sm">View all your past rides and reviews</p>
        </div>
        <div className="text-sm text-gray-600">
          Total Rides: {rideHistory.length}
        </div>
      </div>

      {/* Ride History List */}
      <div className="space-y-4">
        {rideHistory.length > 0 ? (
          rideHistory.map((ride) => (
            <div key={ride.id || ride._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex items-center mb-3 sm:mb-0">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(ride.date || ride.createdAt)}
                  </span>
                  <span className="ml-3 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    {formatTime(ride.time)}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                  ride.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  ride.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ride.status || 'completed'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <div className="text-xs text-gray-500">From</div>
                      <div className="text-sm font-medium">{ride.from || ride.pickupLocation || 'Location not specified'}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <div>
                      <div className="text-xs text-gray-500">To</div>
                      <div className="text-sm font-medium">{ride.to || ride.dropLocation || 'Location not specified'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Vehicle:</span>
                    </div>
                    <span className="text-sm font-medium">{ride.vehicle || 'Sedan'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Fare:</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {ride.fare || ride.amount || ride.totalFare || '₹0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Driver and Rating */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {ride.driverPhoto ? (
                      <img 
                        src={ride.driverPhoto} 
                        alt={ride.driverName || 'Driver'}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">D</span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ride.driverName || ride.driver || 'Driver'}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs text-gray-600">
                          {ride.driverRating ? `${ride.driverRating}/5` : 'Not rated'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review/Status Button */}
                  <div>
                    {ride.status === 'completed' && !ride.hasReviewed && (
                      <button
                        onClick={() => onSubmitReview && onSubmitReview({
                          rideId: ride.id || ride._id,
                          driverId: ride.driverId,
                          driverName: ride.driverName
                        })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Submit Review
                      </button>
                    )}
                    {ride.rating && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Your Rating:</span>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="text-sm font-bold">{ride.rating}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Ride History</h3>
            <p className="text-gray-600 mb-6">You haven't taken any rides yet</p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Book Your First Ride
            </button>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {rideHistory.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {rideHistory.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Completed
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {rideHistory.filter(r => r.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                Cancelled
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {rideHistory.reduce((sum, ride) => {
                  const fare = parseFloat(ride.fare?.replace(/[^0-9.]/g, '') || ride.amount || 0);
                  return sum + fare;
                }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {rideHistory.length > 0 
                  ? (rideHistory.reduce((sum, ride) => sum + (ride.rating || 0), 0) / rideHistory.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideHistory;