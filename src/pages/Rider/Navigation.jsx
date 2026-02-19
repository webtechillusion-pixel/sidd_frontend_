// components/home/Hero.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  Star, 
  MapPin, 
  Users, 
  Car, 
  Shield, 
  Clock, 
  CreditCard,
  Navigation,
  Calendar,
  ChevronDown,
  Search,
  X,
  Loader,
  Map,
  Crosshair,
  Check,
  CalendarClock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { toast } from 'react-toastify';
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  Autocomplete
} from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.75rem'
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
  mapTypeControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  mapTypeId: 'roadmap'
};

// Libraries to load
const libraries = ['places'];

// Vehicle types with icons and details
const VEHICLE_TYPES = [
  { 
    id: 'HATCHBACK', 
    name: 'Hatchback', 
    icon: '🚗', 
    capacity: 4, 
    luggage: 2,
    description: 'Perfect for city commutes',
    image: '/images/hatchback.png'
  },
  { 
    id: 'SEDAN', 
    name: 'Sedan', 
    icon: '🚘', 
    capacity: 4, 
    luggage: 3,
    description: 'Comfortable for long drives',
    image: '/images/sedan.png'
  },
  { 
    id: 'SUV', 
    name: 'SUV', 
    icon: '🚙', 
    capacity: 7, 
    luggage: 4,
    description: 'Spacious for groups',
    image: '/images/suv.png'
  },
  { 
    id: 'PREMIUM', 
    name: 'Premium', 
    icon: '🚖', 
    capacity: 4, 
    luggage: 3,
    description: 'Luxury travel experience',
    image: '/images/premium.png'
  }
];

// Map Selection Modal Component
const MapSelectionModal = ({ isOpen, onClose, onSelect, initialLocation, type }) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(initialLocation || defaultCenter);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'map-modal-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
  }, []);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    getAddressFromCoords(lat, lng);
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    getAddressFromCoords(lat, lng);
  }, []);

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await bookingService.reverseGeocode(lat, lng);
      if (response.success) {
        setAddress(response.data.addressText);
      }
    } catch (error) {
      console.error('Reverse geocode error:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        
        setMarkerPosition(newLocation);
        if (mapRef.current) {
          mapRef.current.panTo(newLocation);
          mapRef.current.setZoom(16);
        }
        
        await getAddressFromCoords(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        toast.error('Failed to get location');
        setIsLoading(false);
      }
    );
  };

  const onPlaceSelect = (place) => {
    if (place && place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setMarkerPosition(location);
      setAddress(place.formatted_address);
      setSearchInput(place.formatted_address);
      
      if (mapRef.current) {
        mapRef.current.panTo(location);
        mapRef.current.setZoom(16);
      }
    }
  };

  const handleConfirm = () => {
    onSelect({
      lat: markerPosition.lat,
      lng: markerPosition.lng,
      address: address,
      placeId: null
    });
    onClose();
  };

  const onAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      onPlaceSelect(place);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Map className="text-blue-400" />
            Select {type === 'pickup' ? 'Pickup' : 'Drop'} Location
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-700">
          {isLoaded && (
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for a location..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </Autocomplete>
          )}
        </div>

        {/* Map */}
        <div className="p-4">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={markerPosition}
              zoom={14}
              options={mapOptions}
              onClick={onMapClick}
              onLoad={onMapLoad}
            >
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={onMarkerDragEnd}
                icon={{
                  url: type === 'pickup' 
                    ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
              />
            </GoogleMap>
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-slate-800 rounded-xl">
              <Loader className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          )}
        </div>

        {/* Selected Address */}
        {address && (
          <div className="px-4 pb-2">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-sm text-gray-400">Selected Location:</p>
              <p className="text-white text-sm">{address}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Crosshair className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Use My Location
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Booking form state
  const [bookingStep, setBookingStep] = useState(1);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [tripType, setTripType] = useState('one-way');
  const [bookingType, setBookingType] = useState('IMMEDIATE'); // 'IMMEDIATE' or 'SCHEDULED'
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [fareDetails, setFareDetails] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  
  // Map modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapSelectionType, setMapSelectionType] = useState(null);
  
  // Refs for search
  const pickupTimeoutRef = useRef(null);
  const dropTimeoutRef = useRef(null);

  // Features array
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe & Secure",
      description: "Verified drivers and insured vehicles"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Available",
      description: "Book anytime, anywhere"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Transparent Pricing",
      description: "No hidden charges"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Wide Coverage",
      description: "50+ cities across India"
    }
  ];

  // Handle place search
  const searchPlaces = async (input, type) => {
    if (!input || input.length < 3) return;
    
    try {
      const response = await bookingService.searchPlaces(input);
      if (type === 'pickup') {
        setPickupSuggestions(response.data || []);
      } else {
        setDropSuggestions(response.data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle pickup input change
  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);
    
    if (pickupTimeoutRef.current) {
      clearTimeout(pickupTimeoutRef.current);
    }
    
    pickupTimeoutRef.current = setTimeout(() => {
      searchPlaces(value, 'pickup');
    }, 500);
  };

  // Handle drop input change
  const handleDropChange = (e) => {
    const value = e.target.value;
    setDrop(value);
    
    if (dropTimeoutRef.current) {
      clearTimeout(dropTimeoutRef.current);
    }
    
    dropTimeoutRef.current = setTimeout(() => {
      searchPlaces(value, 'drop');
    }, 500);
  };

  // Open map modal
  const openMapModal = (type) => {
    setMapSelectionType(type);
    setIsMapModalOpen(true);
  };

  // Handle map selection
  const handleMapSelect = (location) => {
    if (mapSelectionType === 'pickup') {
      setPickup(location.address);
      setPickupLocation({
        lat: location.lat,
        lng: location.lng,
        addressText: location.address,
        placeId: location.placeId
      });
      setPickupSuggestions([]);
    } else {
      setDrop(location.address);
      setDropLocation({
        lat: location.lat,
        lng: location.lng,
        addressText: location.address,
        placeId: location.placeId
      });
      setDropSuggestions([]);
    }

    // If both locations are selected, calculate fare
    if ((mapSelectionType === 'pickup' && dropLocation) || 
        (mapSelectionType === 'drop' && pickupLocation)) {
      calculateFare();
    }
  };

  // Select place from suggestions
  const selectPlace = async (place, type) => {
    try {
      const details = await bookingService.getPlaceDetails(place.placeId);
      
      if (type === 'pickup') {
        setPickup(place.description);
        setPickupLocation(details.data);
        setPickupSuggestions([]);
      } else {
        setDrop(place.description);
        setDropLocation(details.data);
        setDropSuggestions([]);
      }

      // If both locations are selected, calculate fare
      if ((type === 'pickup' && dropLocation) || (type === 'drop' && pickupLocation)) {
        calculateFare();
      }
    } catch (error) {
      console.error('Error selecting place:', error);
      toast.error('Failed to get location details');
    }
  };

  // Calculate fare
  const calculateFare = async () => {
    if (!pickupLocation || !dropLocation || !selectedVehicle) {
      toast.warning('Please select pickup, drop, and vehicle type');
      return;
    }

    setIsCalculating(true);
    try {
      const response = await bookingService.calculateFare({
        pickup: {
          coordinates: [pickupLocation.lng, pickupLocation.lat],
          address: pickup
        },
        drop: {
          coordinates: [dropLocation.lng, dropLocation.lat],
          address: drop
        },
        vehicleType: selectedVehicle.id,
        tripType: tripType === 'round-trip' ? 'ROUND_TRIP' : 'ONE_WAY'
      });

      if (response.success) {
        setFareDetails(response.data);
        setBookingStep(3);
      }
    } catch (error) {
      console.error('Fare calculation error:', error);
      toast.error('Failed to calculate fare');
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to book a ride');
      navigate('/login/customer');
      return;
    }

    if (!pickupLocation || !dropLocation || !selectedVehicle) {
      toast.error('Please complete all booking details');
      return;
    }

    if (!fareDetails) {
      toast.error('Please calculate fare first');
      return;
    }

    // Validate scheduled booking
    if (bookingType === 'SCHEDULED') {
      if (!scheduledDate || !scheduledTime) {
        toast.error('Please select date and time for scheduled booking');
        return;
      }
      
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      const now = new Date();
      
      if (scheduledDateTime < now) {
        toast.error('Scheduled time must be in the future');
        return;
      }
    }

    setIsSearching(true);
    try {
      const bookingData = {
        pickup: {
          addressText: pickup,
          lat: pickupLocation.lat,
          lng: pickupLocation.lng,
          coordinates: [pickupLocation.lng, pickupLocation.lat],
          contactName: user?.name || '',
          contactPhone: user?.phone || ''
        },
        drop: {
          addressText: drop,
          lat: dropLocation.lat,
          lng: dropLocation.lng,
          coordinates: [dropLocation.lng, dropLocation.lat]
        },
        vehicleType: selectedVehicle.id,
        bookingType: bookingType,
        scheduledAt: bookingType === 'SCHEDULED' ? `${scheduledDate}T${scheduledTime}:00` : null,
        paymentMethod: 'CASH',
        distanceKm: fareDetails.distanceKm,
        estimatedFare: fareDetails.estimatedFare
      };

      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        const successMessage = bookingType === 'SCHEDULED' 
          ? 'Scheduled booking created! Searching for drivers...'
          : 'Booking created! Searching for nearby drivers...';
        
        toast.success(successMessage);
        
        // Store booking ID
        localStorage.setItem('currentBookingId', response.data.booking._id);
        
        // Navigate to tracking page
        navigate(`/booking-tracking/${response.data.booking._id}`, {
          state: { 
            booking: response.data.booking,
            status: bookingType === 'SCHEDULED' ? 'SCHEDULED' : 'SEARCHING_DRIVER',
            bookingType: bookingType
          }
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location
  const getCurrentLocation = (type) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await bookingService.reverseGeocode(latitude, longitude);
          
          if (type === 'pickup') {
            setPickup(response.data.addressText);
            setPickupLocation(response.data);
          } else {
            setDrop(response.data.addressText);
            setDropLocation(response.data);
          }
        } catch (error) {
          console.error('Reverse geocode error:', error);
          toast.error('Failed to get address');
        }
      },
      (error) => {
        toast.error('Failed to get location');
        console.error(error);
      }
    );
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero_img.png"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-purple-900/70"></div>
      </div>

      {/* Map Selection Modal */}
      <MapSelectionModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelect={handleMapSelect}
        initialLocation={mapSelectionType === 'pickup' ? pickupLocation : dropLocation}
        type={mapSelectionType}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Main Content */}
          <div className="text-white">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <span className="text-sm font-semibold">SINCE 2015</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Your Journey, 
                <span className="block text-blue-300 mt-2">Our Responsibility</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-xl">
                Experience hassle-free travel with our premium cab services. 
                From city rides to outstation tours, we ensure comfort, safety, 
                and punctuality in every journey.
              </p>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">10K+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">4.8</div>
                <div className="text-sm text-gray-300 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">99%</div>
                <div className="text-sm text-gray-300">On-time Service</div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-blue-300 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Book Your Ride</h2>
            
            {/* Booking Type Selector - IMMEDIATE vs SCHEDULED */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setBookingType('IMMEDIATE');
                  setScheduledDate('');
                  setScheduledTime('');
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  bookingType === 'IMMEDIATE'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Clock className="inline-block mr-2 h-4 w-4" />
                Now
              </button>
              <button
                onClick={() => setBookingType('SCHEDULED')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  bookingType === 'SCHEDULED'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <CalendarClock className="inline-block mr-2 h-4 w-4" />
                Schedule
              </button>
            </div>

            {/* Trip Type Selector */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTripType('one-way')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  tripType === 'one-way'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                One Way
              </button>
              <button
                onClick={() => setTripType('round-trip')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  tripType === 'round-trip'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Round Trip
              </button>
            </div>

            {/* Step 1: Location Selection */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                {/* Pickup Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={handlePickupChange}
                      placeholder="Enter pickup location"
                      className="w-full pl-10 pr-20 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <button
                        onClick={() => openMapModal('pickup')}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                        title="Select on map"
                      >
                        <Map className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => getCurrentLocation('pickup')}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                        title="Use my location"
                      >
                        <Crosshair className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {pickupSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-slate-800 rounded-xl border border-slate-700 shadow-xl max-h-60 overflow-y-auto">
                      {pickupSuggestions.map((place, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectPlace(place, 'pickup')}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 text-white text-sm border-b border-slate-700 last:border-0"
                        >
                          {place.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Drop Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Drop Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5" />
                    <input
                      type="text"
                      value={drop}
                      onChange={handleDropChange}
                      placeholder="Enter drop location"
                      className="w-full pl-10 pr-20 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <button
                        onClick={() => openMapModal('drop')}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        title="Select on map"
                      >
                        <Map className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => getCurrentLocation('drop')}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        title="Use my location"
                      >
                        <Crosshair className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {dropSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-slate-800 rounded-xl border border-slate-700 shadow-xl max-h-60 overflow-y-auto">
                      {dropSuggestions.map((place, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectPlace(place, 'drop')}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 text-white text-sm border-b border-slate-700 last:border-0"
                        >
                          {place.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Schedule (Only for SCHEDULED bookings) */}
                {bookingType === 'SCHEDULED' && (
                  <div className="grid grid-cols-2 gap-3 mt-4 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Pick Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 bg-purple-900/30 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Pick Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 bg-purple-900/30 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setBookingStep(2)}
                  disabled={!pickup || !drop}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select Vehicle
                </button>
              </div>
            )}

            {/* Step 2: Vehicle Selection */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Select Vehicle Type
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {VEHICLE_TYPES.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        selectedVehicle?.id === vehicle.id
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{vehicle.icon}</div>
                        <div className="flex-1 text-left">
                          <h4 className="text-white font-semibold">{vehicle.name}</h4>
                          <p className="text-sm text-gray-400">{vehicle.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {vehicle.capacity} seats
                            </span>
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" /> {vehicle.luggage} luggage
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={calculateFare}
                    disabled={!selectedVehicle || isCalculating}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <Loader className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      'Calculate Fare'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Fare Details & Confirm */}
            {bookingStep === 3 && fareDetails && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Fare Details
                </h3>

                {/* Booking Type Badge */}
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                  bookingType === 'SCHEDULED' 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {bookingType === 'SCHEDULED' ? (
                    <>📅 Scheduled for {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}</>
                  ) : (
                    <>⚡ Immediate Ride</>
                  )}
                </div>

                {/* Route Summary */}
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Pickup</p>
                      <p className="text-sm text-white">{pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Drop</p>
                      <p className="text-sm text-white">{drop}</p>
                    </div>
                  </div>
                </div>

                {/* Fare Breakdown */}
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Distance</span>
                    <span className="text-white">{fareDetails.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base Fare</span>
                    <span className="text-white">₹{fareDetails.baseFare}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Distance Fare</span>
                    <span className="text-white">
                      ₹{fareDetails.pricePerKm} × {fareDetails.distanceKm} km
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                    <span className="text-gray-300">Total Fare</span>
                    <span className="text-blue-400 text-xl">₹{fareDetails.estimatedFare}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={isSearching}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        {bookingType === 'SCHEDULED' ? 'Scheduling...' : 'Booking...'}
                      </>
                    ) : (
                      <>
                        {bookingType === 'SCHEDULED' ? 'Schedule Ride' : 'Confirm Booking'}
                        <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>

                {!isAuthenticated && (
                  <p className="text-sm text-yellow-400 text-center mt-2">
                    You'll need to login to confirm your booking
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Services Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-600/30 to-blue-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">One-Way Trips</h3>
            <p className="text-gray-300 mb-4">Travel between any two cities with fixed pricing</p>
            <button 
              onClick={() => {
                setTripType('one-way');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-300 text-sm font-medium hover:text-blue-200"
            >
              Book now →
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/30 to-purple-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">Round Trips</h3>
            <p className="text-gray-300 mb-4">Complete packages with return journey included</p>
            <button 
              onClick={() => {
                setTripType('round-trip');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-purple-300 text-sm font-medium hover:text-purple-200"
            >
              Book now →
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-600/30 to-indigo-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">Corporate Travel</h3>
            <p className="text-gray-300 mb-4">Business travel solutions with billing support</p>
            <button 
              onClick={() => {
                setTripType('one-way');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-indigo-300 text-sm font-medium hover:text-indigo-200"
            >
              Book now →
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronRight className="h-8 w-8 text-white rotate-90" />
      </div>
    </section>
  );
};

export default Hero;
