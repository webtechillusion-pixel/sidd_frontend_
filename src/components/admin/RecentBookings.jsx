import React from 'react';
import { MapPin, User, Car, Clock, DollarSign, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentBookings = ({ bookings }) => {
  const navigate = useNavigate();

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

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent bookings
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.slice(0, 5).map((booking) => (
        <div
          key={booking._id}
          onClick={() => navigate(`/admin/bookings/${booking._id}`)}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    #{booking._id?.slice(-6).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(booking.estimatedFare)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pickup</p>
                    <p className="text-xs text-gray-600 truncate">
                      {booking.pickup?.addressText}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Drop</p>
                    <p className="text-xs text-gray-600 truncate">
                      {booking.drop?.addressText}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    <span>{booking.userId?.name || 'User'}</span>
                  </div>
                  {booking.riderId && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Car className="h-3 w-3 mr-1" />
                      <span>{booking.riderId.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {bookings.length > 5 && (
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/admin/bookings')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View all bookings →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentBookings;