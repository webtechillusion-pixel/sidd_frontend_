import React, { useState, useEffect } from 'react';
import { Users, MapPin, Clock, Star, Phone } from 'lucide-react';
import riderService from '../../services/riderService';

export default function NearbyCustomers({ showToast }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNearbyCustomers();
    const interval = setInterval(fetchNearbyCustomers, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNearbyCustomers = async () => {
    try {
      setLoading(true);
      
      // Only fetch if showToast function is available (component is properly mounted)
      if (!showToast) {
        setLoading(false);
        return;
      }
      
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude: lat, longitude: lng } = position.coords;
            
            const response = await riderService.getNearbyCustomers({ lat, lng });
            if (response.success) {
              setCustomers(response.data || []);
            }
          },
          (error) => {
            console.error('Location error:', error);
            // Use default location if geolocation fails
            fetchWithDefaultLocation();
          }
        );
      } else {
        fetchWithDefaultLocation();
      }
    } catch (error) {
      console.error('Fetch nearby customers error:', error);
      if (showToast) {
        showToast('Go online to see nearby customers', 'info');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWithDefaultLocation = async () => {
    try {
      // Use default coordinates (Delhi) if geolocation fails
      const response = await riderService.getNearbyCustomers({ lat: 28.6139, lng: 77.2100 });
      if (response.success) {
        setCustomers(response.data || []);
      }
    } catch (error) {
      console.error('Default location fetch error:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (loading && customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading nearby customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Nearby Customers
        </h3>
        <span className="text-sm text-gray-500">{customers.length} found</span>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent customers in your area</p>
          <p className="text-sm text-gray-400 mt-1">Drive to busier areas to see more customers</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {customers.map((customer) => (
            <div key={customer._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {customer.photo ? (
                      <img 
                        src={customer.photo} 
                        alt={customer.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <span className="text-blue-600 font-semibold">
                        {customer.name?.charAt(0) || 'C'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{customer.name}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="mr-3">Regular customer</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTime(customer.lastRide)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {customer.totalRides} rides
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{customer.avgFare} avg
                  </p>
                </div>
              </div>

              {/* Frequent Locations */}
              {customer.frequentLocations && customer.frequentLocations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Frequent locations:</p>
                  <div className="space-y-1">
                    {customer.frequentLocations.slice(0, 2).map((location, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-600">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate">
                          {location.pickup} → {location.drop}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Button */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => window.location.href = `tel:${customer.phone}`}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Customer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}