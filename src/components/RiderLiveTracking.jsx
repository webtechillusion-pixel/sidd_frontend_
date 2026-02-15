import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, MessageCircle, Clock, User, Star, CheckCircle } from 'lucide-react';

const RiderLiveTracking = ({ activeRide, onOpenChat }) => {
  const [rideProgress, setRideProgress] = useState(0);
  const [riderStatus, setRiderStatus] = useState('going_to_pickup'); // going_to_pickup, arrived, ongoing

  useEffect(() => {
    if (!activeRide) return;

    // Simulate rider status updates
    const statusInterval = setInterval(() => {
      setRiderStatus(prev => {
        if (prev === 'going_to_pickup') return 'arrived';
        if (prev === 'arrived') return 'ongoing';
        return prev;
      });
    }, 10000); // Change status every 10 seconds for demo

    return () => clearInterval(statusInterval);
  }, [activeRide]);

  const getStatusInfo = () => {
    switch (riderStatus) {
      case 'going_to_pickup':
        return {
          text: 'Driver is coming to pickup',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: '🚗'
        };
      case 'arrived':
        return {
          text: 'Driver has arrived at pickup',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: '✅'
        };
      case 'ongoing':
        return {
          text: 'Trip in progress',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: '🛣️'
        };
      default:
        return {
          text: 'Preparing trip',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: '⏳'
        };
    }
  };

  if (!activeRide) return null;

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Navigation className="h-5 w-5 mr-2 text-green-500" />
          Active Trip
        </h3>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
          Live
        </span>
      </div>

      {/* Rider Status */}
      <div className={`mb-4 p-3 rounded-lg ${statusInfo.bgColor}`}>
        <div className="flex items-center">
          <span className="text-lg mr-2">{statusInfo.icon}</span>
          <span className={`font-semibold ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <img
            src={activeRide.customer?.photo || `https://ui-avatars.com/api/?name=${activeRide.passenger}&background=0D8ABC&color=fff`}
            alt={activeRide.passenger}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h4 className="font-semibold">{activeRide.passenger}</h4>
            <div className="flex items-center text-sm text-yellow-600">
              <Star className="h-3 w-3 mr-1" />
              <span>{activeRide.rating || '4.5'}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            ₹{activeRide.fare}
          </div>
          <p className="text-xs text-gray-500">{activeRide.distance}</p>
        </div>
      </div>

      {/* Route Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium">Pickup</span>
          </div>
          <div className="flex items-center text-red-600">
            <span className="font-medium">Drop</span>
            <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
          </div>
        </div>
        
        <div className="text-xs text-gray-600">
          <p className="truncate mb-1">📍 {activeRide.pickup}</p>
          <p className="truncate">🏁 {activeRide.dropoff}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => window.location.href = `tel:${activeRide.customer?.phone}`}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
        >
          <Phone className="h-4 w-4" />
          Call Customer
        </button>
        <button
          onClick={onOpenChat}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </button>
      </div>
    </div>
  );
};

export default RiderLiveTracking;