import React, { useState, useEffect } from 'react';
import { ChevronRight, Bell, Check, Mail, Phone, Clock, MapPin, CreditCard, Car } from 'lucide-react';
import customerService from '../../services/customerService';

const Notifications = ({ onBack }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await customerService.getNotifications();
      if (response.data?.success) {
        setNotifications(response.data.data?.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
      case 'DRIVER_ASSIGNED':
        return <Car className="h-5 w-5 text-green-600" />;
      case 'TRIP_STARTED':
      case 'TRIP_COMPLETED':
        return <MapPin className="h-5 w-5 text-blue-600" />;
      case 'PAYMENT_SUCCESS':
      case 'PAYMENT_FAILED':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <ChevronRight className="h-5 w-5 rotate-180 mr-2" />
            Back to Dashboard
          </button>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600 text-sm">Your recent activity</p>
        </div>
        <div className="relative">
          <Bell className="h-8 w-8 text-blue-600" />
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {notifications.filter(n => n.type?.includes('COMPLETED')).length}
          </p>
          <p className="text-xs text-gray-600">Completed</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">
            {notifications.filter(n => n.type?.includes('ASSIGNED')).length}
          </p>
          <p className="text-xs text-gray-600">Assigned</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">
            {notifications.filter(n => n.type?.includes('PAYMENT')).length}
          </p>
          <p className="text-xs text-gray-600">Payments</p>
        </div>
      </div>

      {/* Recent Notifications */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Recent Notifications</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent notifications</p>
            <p className="text-sm text-gray-500 mt-2">
              Your notifications will appear here when you have active rides
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div 
                key={notification._id || index}
                className={`p-4 rounded-lg border ${
                  !notification.isRead 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-medium ${
                        !notification.isRead ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                        {notification.title || 'Notification'}
                      </h4>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    {notification.data?.bookingId && (
                      <p className="text-xs text-blue-600 mt-2">
                        Booking ID: {notification.data.bookingId.slice(-8)}
                      </p>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
