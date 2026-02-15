import React, { useState } from 'react';
import { ChevronRight, MapPin, Home, Briefcase, Plus, Navigation, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const SavedLocations = ({ locations, onSave, onBack }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    type: 'home',
    coordinates: { lat: '', lng: '' }
  });

  const locationTypes = [
    { id: 'home', name: 'Home', icon: Home, color: 'text-blue-600' },
    { id: 'work', name: 'Work', icon: Briefcase, color: 'text-green-600' },
    { id: 'airport', name: 'Airport', icon: Navigation, color: 'text-purple-600' },
    { id: 'favorite', name: 'Favorite', icon: Star, color: 'text-yellow-600' },
    { id: 'other', name: 'Other', icon: MapPin, color: 'text-gray-600' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('coordinates.')) {
      const field = name.split('.')[1];
      setLocationForm(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [field]: value
        }
      }));
    } else {
      setLocationForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Map frontend location data to backend address schema
  const addressData = {
    label: locationForm.type.toUpperCase(),
    title: locationForm.name,
    addressLine: locationForm.address,
    city: 'Unknown', // You should implement city detection
    state: 'Unknown', // You should implement state detection
    pincode: '000000', // You should implement pincode extraction
    location: {
      type: 'Point',
      coordinates: [
        parseFloat(locationForm.coordinates.lng || 0),
        parseFloat(locationForm.coordinates.lat || 0)
      ]
    },
    isDefault: false
  };

  try {
    await onSave(addressData);
    setShowAddForm(false);
    resetForm();
  } catch (error) {
    // Error is handled in parent
  }
};

  const resetForm = () => {
    setLocationForm({
      name: '',
      address: '',
      type: 'home',
      coordinates: { lat: '', lng: '' }
    });
  };

  const getLocationType = (typeId) => {
    return locationTypes.find(t => t.id === typeId) || locationTypes[4];
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationForm(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6)
            }
          }));
          toast.success('Current location captured');
        },
        (error) => {
          toast.error('Unable to get current location');
        }
      );
    }
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
          <h2 className="text-xl font-bold text-gray-900">Saved Locations</h2>
          <p className="text-gray-600 text-sm">Save your frequently visited places</p>
          <p className="text-xs text-yellow-600 mt-1">
            Note: Locations are saved to your account and can be used for faster booking
          </p>
        </div>
        <MapPin className="h-8 w-8 text-blue-600" />
      </div>

      {/* Add New Location Form */}
      {showAddForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h3 className="font-bold text-gray-900 mb-4">Add New Location</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name *
              </label>
              <input
                type="text"
                name="name"
                value={locationForm.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Home, Office, Mom's House"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={locationForm.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Full address including city and pin code"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (Optional)
                </label>
                <input
                  type="number"
                  step="any"
                  name="coordinates.lat"
                  value={locationForm.coordinates.lat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 28.6139"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (Optional)
                </label>
                <input
                  type="number"
                  step="any"
                  name="coordinates.lng"
                  value={locationForm.coordinates.lng}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 77.2090"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Use Current Location
              </button>
              <div className="text-xs text-gray-500">
                Optional: Coordinates help in accurate pickup
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {locationTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setLocationForm(prev => ({ ...prev, type: type.id }))}
                    className={`p-3 border rounded-lg flex flex-col items-center ${
                      locationForm.type === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <type.icon className={`h-5 w-5 mb-2 ${type.color}`} />
                    <span className="text-xs font-medium">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Save Location
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Location Button */}
      {!showAddForm && (
        <div className="mb-8">
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center"
          >
            <Plus className="h-5 w-5 text-gray-400 mr-2" />
            <span className="font-medium text-gray-700">Add New Location</span>
          </button>
        </div>
      )}

      {/* Locations Display - Read Only */}
      {locations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Saved Locations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location, index) => {
              const type = getLocationType(location.type);
              return (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-start mb-3">
                    <div className={`p-2 rounded-full ${type.color} bg-opacity-10 mr-3`}>
                      <type.icon className={`h-5 w-5 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{location.name}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                  
                  {location.coordinates?.lat && location.coordinates?.lng && (
                    <div className="text-xs text-gray-500">
                      Coordinates: {Number(location.coordinates.lat).toFixed(4)}, {Number(location.coordinates.lng).toFixed(4)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {locations.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Locations</h3>
          <p className="text-gray-600 mb-6">Save your frequent destinations for faster bookings</p>
        </div>
      )}

      {/* Location Tips */}
      <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <h4 className="font-bold text-gray-900 mb-3">Tips for Saved Locations</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
            <span>Save home, office, and airport for one-click booking</span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
            <span>Accurate coordinates ensure precise pickup points</span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
            <span>Locations are saved to your account for future use</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SavedLocations;