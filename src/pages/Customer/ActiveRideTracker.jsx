import React from 'react';
import { Navigation, Star, Share2 } from 'lucide-react';

const ActiveRideTracker = ({ activeRide, onTrackNow, onShare }) => {
  if (!activeRide) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Active Ride</h3>
          <p className="text-blue-200 text-sm">Track your current journey</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-500 rounded-full text-sm">Live</span>
          <button 
            onClick={onShare}
            className="p-2 hover:bg-blue-700 rounded-lg"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-blue-200 text-sm">From</p>
          <p className="font-semibold">{activeRide.pickup}</p>
        </div>
        <div className="text-center">
          <Navigation className="h-6 w-6 mx-auto text-blue-300" />
          <p className="text-blue-200 text-sm mt-2">ETA: {activeRide.eta}</p>
        </div>
        <div>
          <p className="text-blue-200 text-sm">To</p>
          <p className="font-semibold">{activeRide.drop}</p>
        </div>
      </div>
      
      {/* OTP Display */}
      {activeRide.otp && (
        <div className="bg-blue-700 rounded-lg p-4 mb-4">
          <div className="text-center">
            <p className="text-blue-200 text-sm mb-2">Share this OTP with your driver</p>
            <div className="text-3xl font-bold tracking-widest bg-white text-blue-600 rounded-lg py-3 px-6 inline-block">
              {activeRide.otp}
            </div>
            <p className="text-blue-200 text-xs mt-2">Required to start your ride</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={activeRide.driver.photo} 
            alt="Driver" 
            className="w-10 h-10 rounded-full mr-3 border-2 border-white"
          />
          <div>
            <p className="font-semibold">{activeRide.driver.name}</p>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              {activeRide.driver.rating}
            </div>
          </div>
        </div>
        <button 
          onClick={onTrackNow}
          className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Track Now
        </button>
      </div>
    </div>
  );
};

export default ActiveRideTracker;