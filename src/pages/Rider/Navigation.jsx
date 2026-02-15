import React, { useState, useEffect } from 'react';
import { Navigation as NavigationIcon, MapPin, Phone, MessageCircle, AlertTriangle } from 'lucide-react';

export const Navigation = ({ activeRide, updateLocation, showToast }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (activeRide && navigator.geolocation) {
      startNavigation();
    }
    return () => stopNavigation();
  }, [activeRide]);

  const startNavigation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported', 'error');
      return;
    }

    setIsNavigating(true);
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        updateLocation(location.lat, location.lng);
      },
      (error) => {
        console.error('Navigation error:', error);
        showToast('Location tracking failed', 'error');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setDirections(null);
  };

  const openGoogleMaps = (destination) => {
    if (!currentLocation) {
      showToast('Current location not available', 'error');
      return;
    }

    const url = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${destination.lat},${destination.lng}`;
    window.open(url, '_blank');
  };

  const callCustomer = () => {
    if (activeRide?.phone) {
      window.location.href = `tel:${activeRide.phone}`;
    }
  };

  const sendSMS = () => {
    if (activeRide?.phone) {
      const message = `Hi, I'm your driver. I'm on my way to pick you up. ETA: 5 minutes.`;
      window.location.href = `sms:${activeRide.phone}?body=${encodeURIComponent(message)}`;
    }
  };

  if (!activeRide) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <NavigationIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Ride</h3>
          <p className="text-gray-500">Accept a ride to start navigation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Ride Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Ride</h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {activeRide.status || 'In Progress'}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Pickup</p>
              <p className="text-gray-600 text-sm">{activeRide.pickup}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Drop-off</p>
              <p className="text-gray-600 text-sm">{activeRide.dropoff}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{activeRide.passenger}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Fare</p>
              <p className="font-medium text-green-600">₹{Number(activeRide.fare || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => openGoogleMaps({ 
              lat: activeRide.pickupLat || 28.6139, 
              lng: activeRide.pickupLng || 77.2090 
            })}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <NavigationIcon className="h-5 w-5" />
            <span>To Pickup</span>
          </button>

          <button
            onClick={() => openGoogleMaps({ 
              lat: activeRide.dropLat || 28.6139, 
              lng: activeRide.dropLng || 77.2090 
            })}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <MapPin className="h-5 w-5" />
            <span>To Drop</span>
          </button>
        </div>

        {/* Current Location */}
        {currentLocation && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Current Location</p>
            <p className="text-sm font-mono">
              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isNavigating ? '🟢 Live tracking active' : '🔴 Tracking stopped'}
            </p>
          </div>
        )}
      </div>

      {/* Communication */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Contact</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={callCustomer}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>Call</span>
          </button>

          <button
            onClick={sendSMS}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>SMS</span>
          </button>
        </div>

        {activeRide.phone && (
          <p className="text-center text-sm text-gray-600 mt-3">
            {activeRide.phone}
          </p>
        )}
      </div>

      {/* Emergency */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to trigger emergency alert?')) {
              showToast('Emergency alert sent!', 'error');
            }
          }}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          <AlertTriangle className="h-5 w-5" />
          <span>Emergency SOS</span>
        </button>
      </div>
    </div>
  );
};