import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Phone, ArrowLeft, Car, Clock } from 'lucide-react';

const LiveTrackingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rideId, driver, pickup, drop } = location.state || {};
  
  const [riderLocation, setRiderLocation] = useState({
    lat: 28.6139 + Math.random() * 0.01,
    lng: 77.2090 + Math.random() * 0.01
  });
  const [eta, setEta] = useState('8 min');
  const [distance, setDistance] = useState('2.3 km');

  useEffect(() => {
    if (!rideId) {
      navigate('/dashboard');
      return;
    }

    // Simulate rider location updates
    const interval = setInterval(() => {
      setRiderLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
      
      // Update ETA randomly
      const etas = ['7 min', '6 min', '5 min', '4 min', '3 min'];
      setEta(etas[Math.floor(Math.random() * etas.length)]);
      
      // Update distance
      const distances = ['2.1 km', '1.9 km', '1.7 km', '1.5 km', '1.2 km'];
      setDistance(distances[Math.floor(Math.random() * distances.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [rideId, navigate]);

  if (!rideId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/customer-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-lg font-semibold">Live Tracking</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Car className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-700 font-medium">Driver Location</p>
          <p className="text-sm text-gray-500">
            Lat: {riderLocation.lat.toFixed(4)}, Lng: {riderLocation.lng.toFixed(4)}
          </p>
        </div>
        
        {/* Live indicator */}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
          🔴 LIVE
        </div>
      </div>

      {/* Ride Info */}
      <div className="p-4 space-y-4">
        {/* Driver Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={driver?.photo || `https://ui-avatars.com/api/?name=${driver?.name}&background=4F46E5&color=fff`}
                alt={driver?.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold text-lg">{driver?.name || 'Driver'}</h3>
                <p className="text-sm text-gray-600">{driver?.vehicleNumber || 'Vehicle'}</p>
                <div className="flex items-center text-sm text-yellow-600">
                  <span>⭐ {driver?.rating || '4.5'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.href = `tel:${driver?.phone}`}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
            >
              <Phone className="h-5 w-5" />
            </button>
          </div>

          {/* Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <span className="text-lg mr-2">🚗</span>
              <span className="font-medium text-green-800">Driver is on the way to pickup</span>
            </div>
          </div>

          {/* ETA and Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-600">{eta}</p>
              <p className="text-sm text-blue-600">ETA</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Navigation className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-orange-600">{distance}</p>
              <p className="text-sm text-orange-600">Distance</p>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-gray-600" />
            Trip Route
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-sm">Pickup Location</p>
                <p className="text-sm text-gray-600">{pickup || 'Pickup Location'}</p>
              </div>
            </div>
            
            <div className="ml-1.5 border-l-2 border-gray-300 h-6"></div>
            
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-sm">Drop Location</p>
                <p className="text-sm text-gray-600">{drop || 'Drop Location'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">📍 Instructions</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Driver location updates every few seconds</li>
            <li>• You'll be notified when driver arrives</li>
            <li>• Keep your phone ready for driver's call</li>
            <li>• Have your OTP ready to share</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;