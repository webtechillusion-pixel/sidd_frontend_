// pages/Rider/Navigation.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaMapMarkerAlt,
  FaCrosshairs,
  FaLocationArrow,
  FaSatellite,
  FaMap,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import riderService from '../../services/riderService';
import { toast } from 'react-toastify';
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '600px'
};

// Default center (India)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  mapTypeId: 'roadmap',
  mapTypeControlOptions: {
    style: 1,
    position: 3
  }
};

// Libraries to load
const libraries = ['places'];

const Navigation = () => {
  const { user } = useAuth();
  
  // State management
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const locationTimeoutRef = useRef(null);
  const watchIdRef = useRef(null);

  // Load Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Initialize map
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Handle map click to set location
  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setSelectedLocation({ lat, lng });
    setMarkerPosition({ lat, lng });
    setLocationError(null); // Clear any location errors
    
    // Reverse geocode to get address (optional)
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          console.log('Selected address:', results[0].formatted_address);
        }
      });
    }
  }, []);

  // Try multiple geolocation methods
  const getCurrentLocation = useCallback(() => {
    setIsGettingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    // Clear any existing timeout
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }

    // Set a timeout for the location request
    locationTimeoutRef.current = setTimeout(() => {
      // If we're still trying after 15 seconds, try with lower accuracy
      if (isGettingLocation) {
        console.log('📍 High accuracy timeout, trying with lower accuracy...');
        getLocationWithLowAccuracy();
      }
    }, 15000);

    // First attempt: high accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationSuccess(position);
      },
      (error) => {
        console.log('High accuracy failed:', error.message);
        // If high accuracy fails, try with low accuracy
        getLocationWithLowAccuracy();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // Low accuracy fallback
  const getLocationWithLowAccuracy = useCallback(() => {
    console.log('📍 Trying with low accuracy...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationSuccess(position);
      },
      (error) => {
        console.error('Low accuracy also failed:', error.message);
        handleLocationError(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000 // Accept cached locations up to 1 minute old
      }
    );
  }, []);

  // Handle successful location
  const handleLocationSuccess = async (position) => {
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    
    console.log('📍 Location obtained:', location);
    
    // Clear timeout
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }
    
    setCurrentLocation(location);
    setMarkerPosition(location);
    setSelectedLocation(location);
    setLocationError(null);
    setRetryCount(0);
    
    // Center map on current location
    if (mapRef.current) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(16);
    }

    // Update location in backend
    try {
      await riderService.updateLocation(location);
      toast.success('Location updated successfully');
    } catch (error) {
      console.error('Failed to update location:', error);
      toast.error('Failed to update location in server');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Handle location error
  const handleLocationError = (error) => {
    let message = 'Failed to get location';
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission denied. Please enable location access in your browser settings.';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location information unavailable. Please check your GPS signal.';
        break;
      case error.TIMEOUT:
        message = 'Location request timed out. Please try again.';
        break;
    }
    
    setLocationError(message);
    toast.error(message);
    setIsGettingLocation(false);
    
    // If we haven't retried too many times, try again
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        console.log(`Retry attempt ${retryCount + 1}...`);
        getCurrentLocation();
      }, 2000);
    }
  };

  // Update location to server (manual update)
  const updateLocationToServer = useCallback(async () => {
    if (!selectedLocation) {
      toast.warning('Please select a location on map first');
      return;
    }

    setIsLoading(true);
    try {
      await riderService.updateLocation(selectedLocation);
      setCurrentLocation(selectedLocation);
      toast.success('Location updated to server');
    } catch (error) {
      console.error('Failed to update location:', error);
      toast.error('Failed to update location');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation]);

  // Handle map type change
  const handleMapTypeChange = () => {
    setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
    if (mapRef.current) {
      mapRef.current.setMapTypeId(mapType === 'roadmap' ? 'satellite' : 'roadmap');
    }
  };

  // Start watching position for continuous updates (optional)
  const startWatchingPosition = useCallback(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('📍 Position updated:', location);
        setCurrentLocation(location);
      },
      (error) => {
        console.log('Watch position error:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 15000
      }
    );
  }, []);

  // Stop watching position
  const stopWatchingPosition = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
    
    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
      stopWatchingPosition();
    };
  }, []);

  // Show loading state
  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 bg-red-500/10 rounded-xl border border-red-500/30">
          <FaExclamationTriangle className="text-5xl text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to load Google Maps</h2>
          <p className="text-slate-400">Please check your API key and try again</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FaLocationArrow className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Location Manager
              </h1>
              <p className="text-sm text-slate-400">
                {currentLocation ? '📍 Location active' : '⚫ Location pending'}
              </p>
            </div>
          </div>

          {/* Map Type Toggle */}
          <button
            onClick={handleMapTypeChange}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-white transition-all flex items-center gap-2"
          >
            {mapType === 'roadmap' ? <FaSatellite /> : <FaMap />}
            <span>{mapType === 'roadmap' ? 'Satellite' : 'Map'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Current Location Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-teal-400" />
                Current Location
              </h3>
              
              {/* Location Error Message */}
              {locationError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <FaExclamationTriangle />
                    {locationError}
                  </p>
                </div>
              )}
              
              {/* Get Current Location Button */}
              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGettingLocation ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Getting Location...</span>
                  </>
                ) : (
                  <>
                    <FaCrosshairs />
                    <span>Get My Current Location</span>
                  </>
                )}
              </button>

              {/* Location Coordinates */}
              {currentLocation && (
                <div className="space-y-2 mb-4 p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-400">Latitude:</span><br />
                    <span className="font-mono text-teal-400">{currentLocation.lat.toFixed(6)}</span>
                  </p>
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-400">Longitude:</span><br />
                    <span className="font-mono text-teal-400">{currentLocation.lng.toFixed(6)}</span>
                  </p>
                </div>
              )}

              {/* Manual Location Tips */}
              <div className="text-xs text-slate-500 mt-2">
                <p>💡 Tips:</p>
                <ul className="list-disc list-inside">
                  <li>Ensure GPS is enabled</li>
                  <li>Check browser permissions</li>
                  <li>Try moving to an open area</li>
                </ul>
              </div>
            </div>

            {/* Selected Location Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                Selected Location
              </h3>
              
              {selectedLocation ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-400">Latitude:</span><br />
                      <span className="font-mono text-blue-400">{selectedLocation.lat.toFixed(6)}</span>
                    </p>
                    <p className="text-sm text-slate-300 mt-2">
                      <span className="text-slate-400">Longitude:</span><br />
                      <span className="font-mono text-blue-400">{selectedLocation.lng.toFixed(6)}</span>
                    </p>
                  </div>

                  {/* Update Location Button */}
                  <button
                    onClick={updateLocationToServer}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaLocationArrow />}
                    <span>Update Location to Server</span>
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">
                  Click on the map to select a location
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
              <h3 className="text-white font-semibold mb-2">How to use:</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">1.</span>
                  <span>Click "Get My Current Location" to get your device location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">2.</span>
                  <span>Click anywhere on map to select a different location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">3.</span>
                  <span>Click "Update Location to Server" to save the selected location</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={currentLocation || defaultCenter}
              zoom={15}
              options={{
                ...mapOptions,
                mapTypeId: mapType
              }}
              onLoad={onMapLoad}
              onClick={onMapClick}
            >
              {/* Current Location Marker (Blue) */}
              {currentLocation && window.google && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                />
              )}

              {/* Selected Location Marker (Red) - if different from current */}
              {selectedLocation && 
               (!currentLocation || 
                selectedLocation.lat !== currentLocation.lat || 
                selectedLocation.lng !== currentLocation.lng) && 
               window.google && (
                <Marker
                  position={selectedLocation}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-800/50 border-t border-slate-700 p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentLocation ? 'bg-green-400' : 'bg-yellow-400'}`} />
            <span className="text-slate-300">
              {currentLocation ? 'Location available' : (isGettingLocation ? 'Getting location...' : 'Location unavailable')}
            </span>
          </div>
          <div className="text-slate-400">
            {locationError ? '⚠️ Location error' : 'Click on map to select location • Click button to update'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
