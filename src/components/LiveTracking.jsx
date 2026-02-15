import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, MessageCircle, Clock, Car } from 'lucide-react';

const LiveTracking = ({ activeRide, onOpenChat }) => {
  const [riderLocation, setRiderLocation] = useState(null);
  const [eta, setEta] = useState('5 min');

  useEffect(() => {
    if (!activeRide) return;

    // Simulate rider location updates (disabled for production)
    // const interval = setInterval(() => {
    //   // Mock rider location (in real app, get from socket.io)
    //   setRiderLocation({
    //     lat: 28.6139 + (Math.random() - 0.5) * 0.01,
    //     lng: 77.2090 + (Math.random() - 0.5) * 0.01
    //   });
    // }, 3000);

    // Production: rely on real socket updates; ensure no mock interval runs
    return () => {};
  }, [activeRide]);

  if (!activeRide) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Car className="h-5 w-5 mr-2 text-blue-500" />
          Live Tracking
        </h3>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
          Live
        </span>
      </div>

      {/* Rider Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <img
            src={activeRide.driver?.photo || `https://ui-avatars.com/api/?name=${activeRide.driver?.name}&background=4F46E5&color=fff`}
            alt={activeRide.driver?.name}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h4 className="font-semibold">{activeRide.driver?.name}</h4>
            <p className="text-sm text-gray-600">{activeRide.driver?.vehicleNumber}</p>
            <div className="flex items-center text-sm text-yellow-600">
              <span>★ {activeRide.driver?.rating}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-lg font-bold text-blue-600 mb-1">
            <Clock className="h-4 w-4 mr-1" />
            {eta}
          </div>
          <p className="text-xs text-gray-500">ETA</p>
        </div>
      </div>

      {/* Route Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium">Pickup</span>
          </div>
          <Navigation className="h-4 w-4 text-gray-400" />
          <div className="flex items-center text-red-600">
            <span className="font-medium">Drop</span>
            <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <p className="truncate">{activeRide.pickup}</p>
          <p className="truncate mt-1">{activeRide.drop}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => window.location.href = `tel:${activeRide.driver?.phone}`}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
        >
          <Phone className="h-4 w-4" />
          Call Driver
        </button>
        <button
          onClick={onOpenChat}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </button>
      </div>

      {/* OTP Display - Large and Prominent */}
      {activeRide.otp && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg text-center">
          <p className="text-sm font-semibold text-orange-700 mb-2 flex items-center justify-center">
            <span className="animate-pulse mr-2">🔑</span>
            SHARE THIS OTP WITH DRIVER
          </p>
          <div className="text-4xl font-bold text-orange-600 tracking-widest bg-white rounded-lg py-4 px-6 border-2 border-orange-300">
            {activeRide.otp}
          </div>
          <p className="text-xs text-orange-600 mt-2 font-medium">Driver needs this to start your ride</p>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;