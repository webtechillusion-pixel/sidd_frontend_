import React from 'react';
import { X, MapPin, User, Car, Clock, DollarSign, Calendar, Phone, Mail, Navigation } from 'lucide-react';

const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-blue-100 text-blue-800',
      ONGOING: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Booking Details - #{booking._id?.slice(-8).toUpperCase()}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Booking Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Booking Date</p>
                      <p className="font-medium truncate">
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Total Fare</p>
                      <p className="font-medium text-green-600 truncate">
                        {formatCurrency(booking.finalFare || booking.estimatedFare)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Location Details</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">Pickup Location</p>
                      <p className="text-gray-600 break-words">{booking.pickup?.addressText}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.pickup?.lat}, {booking.pickup?.lng}
                      </p>
                      {booking.pickup?.contactPhone && (
                        <p className="text-sm text-gray-500 mt-1">
                          Contact: {booking.pickup?.contactName} ({booking.pickup?.contactPhone})
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">Drop Location</p>
                      <p className="text-gray-600 break-words">{booking.drop?.addressText}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.drop?.lat}, {booking.drop?.lng}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-medium">{booking.distanceKm} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Duration</p>
                      <p className="font-medium">{booking.estimatedDuration} minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User & Rider Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">User Information</h4>
                  {booking.userId && (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{booking.userId.name}</p>
                          <p className="text-sm text-gray-500 truncate">User ID: {booking.userId._id?.slice(-6)}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{booking.userId.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{booking.userId.email}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rider Information */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Rider Information</h4>
                  {booking.riderId ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{booking.riderId.name}</p>
                          <p className="text-sm text-gray-500 truncate">Rider ID: {booking.riderId._id?.slice(-6)}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{booking.riderId.phone}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Rating: {booking.riderId.overallRating || 'N/A'} ⭐
                      </div>
                      {booking.cabId && (
                        <div className="text-sm text-gray-600">
                          Cab: {booking.cabId.cabNumber} ({booking.cabId.cabType})
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No rider assigned yet</p>
                  )}
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Fare Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-medium">₹50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance Fare ({booking.distanceKm} km × ₹10/km)</span>
                    <span className="font-medium">₹{booking.distanceKm * 10}</span>
                  </div>
                  {booking.bookingType === 'ROUND_TRIP' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Return Trip</span>
                      <span className="font-medium">+ ₹{booking.distanceKm * 10}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Fare</span>
                      <span className="text-green-600">
                        {formatCurrency(booking.finalFare || booking.estimatedFare)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Payment Type: {booking.paymentType}
                    {booking.paidAmount > 0 && ` • Paid: ${formatCurrency(booking.paidAmount)}`}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Booking Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium">Booking Created</p>
                      <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {booking.acceptedAt && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      <div className="ml-4 min-w-0">
                        <p className="text-sm font-medium">Rider Accepted</p>
                        <p className="text-xs text-gray-500">{new Date(booking.acceptedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.rideStartTime && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                      <div className="ml-4 min-w-0">
                        <p className="text-sm font-medium">Ride Started</p>
                        <p className="text-xs text-gray-500">{new Date(booking.rideStartTime).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.rideEndTime && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                      <div className="ml-4 min-w-0">
                        <p className="text-sm font-medium">Ride Completed</p>
                        <p className="text-xs text-gray-500">{new Date(booking.rideEndTime).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:text-sm"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:text-sm"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;