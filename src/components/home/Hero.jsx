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

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.75rem'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  mapTypeId: 'roadmap'
};

const libraries = ['places'];

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

const MapSelectionModal = ({ isOpen, onClose, onSelect, initialLocation, type }) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  
  const mapRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMarkerPosition(initialLocation || defaultCenter);
      setAddress('');
      setSearchInput('');
    }
  }, [isOpen, initialLocation]);

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
        const addressText = response.data.addressText || response.data.address || 'Current Location';
        setAddress(addressText);
        setSearchInput(addressText);
      }
    } catch (error) {
      console.error('Reverse geocode error:', error);
      setAddress('Current Location');
      setSearchInput('Current Location');
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
      <div className="bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[100vh] overflow-hidden border border-slate-700">
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

        {address && (
          <div className="px-4 pb-2">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-sm text-gray-400">Selected Location:</p>
              <p className="text-white text-sm">{address}</p>
            </div>
          </div>
        )}

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
              className="px-6 py-2 bg-white text-black hover:bg-gray-100 rounded-lg transition-all flex items-center gap-2"
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
  
  const [bookingStep, setBookingStep] = useState(1);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [tripType, setTripType] = useState('one-way');
  const [tripDays, setTripDays] = useState(1);
  const [bookingType, setBookingType] = useState('IMMEDIATE');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [fareDetails, setFareDetails] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapSelectionType, setMapSelectionType] = useState(null);
  
  const pickupTimeoutRef = useRef(null);
  const dropTimeoutRef = useRef(null);

  const features = [
    {
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      title: "Safe & Secure",
      description: "Verified drivers and insured vehicles"
    },
    {
      icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      title: "24/7 Available",
      description: "Book anytime, anywhere"
    },
    {
      icon: <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      title: "Transparent Pricing",
      description: "No hidden charges"
    },
    {
      icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      title: "Wide Coverage",
      description: "50+ cities across India"
    }
  ];

  const searchPlaces = async (input, type) => {
    if (!input || input.length < 3) return;
    
    try {
      const response = await bookingService.searchPlaces(input);
      const responseData = response.data || response;
      
      if (type === 'pickup') {
        setPickupSuggestions(responseData || []);
      } else {
        setDropSuggestions(responseData || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

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

  const openMapModal = (type) => {
    setMapSelectionType(type);
    setIsMapModalOpen(true);
  };

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
    } else if (mapSelectionType === 'drop') {
      setDrop(location.address);
      setDropLocation({
        lat: location.lat,
        lng: location.lng,
        addressText: location.address,
        placeId: location.placeId
      });
      setDropSuggestions([]);
    }

    setIsMapModalOpen(false);
    setMapSelectionType(null);

    const selectedType = mapSelectionType;
    const otherLocation = selectedType === 'pickup' ? dropLocation : pickupLocation;
    if (otherLocation) {
      calculateFare();
    }
  };

  const selectPlace = async (place, type) => {
    try {
      const addressText = place.addressText || place.description;
      const placeIdValue = place.place_id || place.placeId;
      
      if (!placeIdValue) {
        toast.error('Invalid place selected');
        return;
      }

      const response = await bookingService.getPlaceDetails(placeIdValue);
      const responseData = response.data || response;
      
      if (responseData && responseData.success && responseData.data && responseData.data.lat && responseData.data.lng) {
        const locationData = {
          addressText: responseData.data.addressText || addressText,
          address: responseData.data.address || addressText,
          placeId: responseData.data.placeId || placeIdValue,
          lat: responseData.data.lat,
          lng: responseData.data.lng,
          city: responseData.data.city,
          state: responseData.data.state,
          country: responseData.data.country
        };
        
        if (type === 'pickup') {
          setPickup(addressText);
          setPickupLocation(locationData);
          setPickupSuggestions([]);
        } else {
          setDrop(addressText);
          setDropLocation(locationData);
          setDropSuggestions([]);
        }

        if ((type === 'pickup' && dropLocation) || (type === 'drop' && pickupLocation)) {
          calculateFare();
        }
      } else {
        toast.error('Could not get location details. Please try again or select from map.');
      }
    } catch (error) {
      console.error('Error selecting place:', error);
      toast.error(error.response?.data?.message || 'Failed to get location details. Please select from map.');
    }
  };

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
        tripType: tripType === 'round-trip' ? 'ROUND_TRIP' : tripType === 'outstation' ? 'OUTSTATION' : tripType === 'local' ? 'LOCAL_RENTAL' : 'ONE_WAY',
        ...(tripType === 'round-trip' && { days: tripDays }),
        ...(tripType === 'outstation' && { days: tripDays }),
        ...(tripType === 'local' && { hours: tripDays }),
        paymentMethod: paymentMethod
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
        
        localStorage.setItem('currentBookingId', response.data.booking._id);
        
        navigate('/ride-tracking', {
          state: { 
            bookingData: {
              bookingId: response.data.booking._id,
              otp: response.data.booking.otp,
              estimatedFare: response.data.booking.estimatedFare,
              pickup: response.data.booking.pickup?.addressText,
              drop: response.data.booking.drop?.addressText,
              vehicleType: response.data.booking.vehicleType,
              tripType: tripType === 'round-trip' ? 'ROUND_TRIP' : tripType === 'outstation' ? 'OUTSTATION' : tripType === 'local' ? 'LOCAL_RENTAL' : 'ONE_WAY',
              tripDays: ['round-trip', 'outstation'].includes(tripType) ? tripDays : null,
              bookingType: bookingType,
              scheduledAt: bookingData.scheduledAt,
              paymentMethod: paymentMethod
            }
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

  const getCurrentLocation = (type) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    if (type !== 'pickup' && type !== 'drop') {
      console.error('Invalid type for getCurrentLocation:', type);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await bookingService.reverseGeocode(latitude, longitude);
          const addressData = response.data;
          const addressText = addressData.address || addressData.addressText || 'Current Location';
          
          const locationData = {
            lat: latitude,
            lng: longitude,
            addressText: addressText,
            city: addressData.city || 'Unknown',
            state: addressData.state || 'Unknown',
            country: addressData.country || 'Unknown'
          };
          
          if (type === 'pickup') {
            setPickup(addressText);
            setPickupLocation(locationData);
          } else if (type === 'drop') {
            setDrop(addressText);
            setDropLocation(locationData);
          }
        } catch (error) {
          console.error('Reverse geocode error:', error);
          const fallbackAddress = 'Current Location';
          const locationData = {
            lat: latitude,
            lng: longitude,
            addressText: fallbackAddress
          };
          
          if (type === 'pickup') {
            setPickup(fallbackAddress);
            setPickupLocation(locationData);
          } else if (type === 'drop') {
            setDrop(fallbackAddress);
            setDropLocation(locationData);
          }
        }
      },
      (error) => {
        toast.error('Failed to get location');
        console.error(error);
      }
    );
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-[100vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero_img.png"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/50 to-slate-900/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50"></div>
      </div>

      <div className="absolute top-24 left-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-l from-amber-500/10 to-transparent rounded-full blur-3xl"></div>

      <MapSelectionModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelect={handleMapSelect}
        initialLocation={mapSelectionType === 'pickup' ? pickupLocation : dropLocation}
        type={mapSelectionType}
      />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10 py-6 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          
          <div className="text-white order-2 lg:order-1">
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md rounded-full mb-3 sm:mb-4 border border-white/20">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs font-medium tracking-wide text-gray-100">INDIA'S TRUSTED CAB SERVICE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight drop-shadow-lg">
                Your Journey, 
                <span className="block mt-1 sm:mt-2 text-white drop-shadow-lg">Our Responsibility</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-100 mb-4 sm:mb-6 max-w-xl leading-relaxed drop-shadow-md">
                Experience hassle-free travel with our premium cab services. 
                From city rides to outstation tours, we ensure comfort, safety, 
                and punctuality in every journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">10K+</div>
                <div className="text-xs sm:text-sm text-gray-200 mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">4.8</div>
                <div className="text-xs sm:text-sm text-gray-200 flex items-center justify-center gap-1 mt-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">99%</div>
                <div className="text-xs sm:text-sm text-gray-200 mt-1">On-time Service</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">50+</div>
                <div className="text-xs sm:text-sm text-gray-300 mt-1">Cities Covered</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-blue-300 mb-2">
                    {React.cloneElement(feature.icon, { className: feature.icon.props.className })}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-200">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl order-1 lg:order-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Book Your Ride</h2>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-green-300">Available</span>
              </div>
            </div>
            
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex gap-1.5 sm:gap-3 p-1.5 bg-white/10 rounded-xl sm:rounded-2xl overflow-x-auto">
                <button
                  onClick={() => { setTripType('one-way'); setTripDays(1); }}
                  className={`flex-1 py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
                    tripType === 'one-way'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  One Way
                </button>
                <button
                  onClick={() => { setTripType('round-trip'); if (tripDays < 1) setTripDays(1); }}
                  className={`flex-1 py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
                    tripType === 'round-trip'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Round Trip
                </button>
                <button
                  onClick={() => { setTripType('outstation'); if (tripDays < 1) setTripDays(1); }}
                  className={`flex-1 py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
                    tripType === 'outstation'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Outstation
                </button>
                <button
                  onClick={() => { setTripType('local'); if (tripDays < 1) setTripDays(2); }}
                  className={`flex-1 py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
                    tripType === 'local'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Local
                </button>
              </div>
            </div>

            {(tripType === 'round-trip' || tripType === 'outstation') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Number of Days
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTripDays(Math.max(1, tripDays - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold text-white transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={tripDays}
                    onChange={(e) => setTripDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 py-3 sm:py-4 px-4 rounded-xl bg-white/10 border border-white/20 text-white text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTripDays(tripDays + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold text-white transition-all"
                  >
                    +
                  </button>
                  <span className="text-gray-300 text-sm">day(s)</span>
                </div>
              </div>
            )}

            {tripType === 'local' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Number of Hours
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTripDays(Math.max(2, tripDays - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold text-white transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="2"
                    value={tripDays}
                    onChange={(e) => setTripDays(Math.max(2, parseInt(e.target.value) || 2))}
                    className="flex-1 py-3 sm:py-4 px-4 rounded-xl bg-white/10 border border-white/20 text-white text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTripDays(tripDays + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold text-white transition-all"
                  >
                    +
                  </button>
                  <span className="text-gray-300 text-sm">hour(s)</span>
                </div>
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-3 sm:py-4 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                    paymentMethod === 'CASH'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`py-3 sm:py-4 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                    paymentMethod === 'ONLINE'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Online
                </button>
              </div>
            </div>

            {bookingStep === 1 && (
              <div className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={handlePickupChange}
                      placeholder="Enter pickup location"
                      className="w-full pl-11 pr-24 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  
                  {pickupSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700 shadow-xl max-h-60 overflow-y-auto">
                      {pickupSuggestions.map((place, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectPlace(place, 'pickup')}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 text-white text-sm border-b border-slate-700 last:border-0 transition-colors"
                        >
                          {place.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Drop Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5" />
                    <input
                      type="text"
                      value={drop}
                      onChange={handleDropChange}
                      placeholder="Enter drop location"
                      className="w-full pl-11 pr-24 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  
                  {dropSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700 shadow-xl max-h-60 overflow-y-auto">
                      {dropSuggestions.map((place, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectPlace(place, 'drop')}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 text-white text-sm border-b border-slate-700 last:border-0 transition-colors"
                        >
                          {place.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setBookingStep(2)}
                  disabled={!pickup || !drop}
                  className="w-full py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Select Vehicle
                </button>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Select Vehicle Type
                </h3>
                
                <div className="space-y-3 max-h-80 md:max-h-96 overflow-y-auto pr-1">
                  {VEHICLE_TYPES.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all ${
                        selectedVehicle?.id === vehicle.id
                          ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{vehicle.icon}</div>
                        <div className="flex-1 text-left">
                          <h4 className="text-white font-semibold text-base">{vehicle.name}</h4>
                          <p className="text-sm text-gray-400">{vehicle.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" /> {vehicle.capacity} Seats
                            </span>
                            <span className="flex items-center gap-1">
                              <Car className="h-4 w-4" /> {vehicle.luggage} Bags
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={calculateFare}
                    disabled={!selectedVehicle || isCalculating}
                    className="flex-1 py-3.5 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all text-sm disabled:opacity-50 shadow-lg"
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

            {bookingStep === 3 && fareDetails && (
              <div className="bg-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Trip Type</span>
                  <span className={`font-medium ${
                    tripType === 'round-trip' ? 'text-purple-400' : 
                    tripType === 'outstation' ? 'text-orange-400' : 
                    tripType === 'local' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {tripType === 'round-trip' ? 'Round Trip' : 
                     tripType === 'outstation' ? 'Outstation' : 
                     tripType === 'local' ? 'Local Rental' : 'One Way'}
                  </span>
                </div>

                {(tripType === 'round-trip' || tripType === 'outstation') && fareDetails?.days && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Days</span>
                      <span className="text-white">{fareDetails.days} day{fareDetails.days > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Nights</span>
                      <span className="text-white">{fareDetails.totalNights} night{fareDetails.totalNights > 1 ? 's' : ''}</span>
                    </div>
                  </>
                )}

                {tripType === 'local' && fareDetails?.hours && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Hours</span>
                    <span className="text-white">{fareDetails.hours} hour{fareDetails.hours > 1 ? 's' : ''}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment Method</span>
                  <span className={`font-medium ${paymentMethod === 'CASH' ? 'text-green-400' : 'text-blue-400'}`}>
                    {paymentMethod === 'CASH' ? 'Cash' : 'Online'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Distance</span>
                  <span className="text-white">{fareDetails?.distanceKm || 0} km</span>
                </div>

                {(tripType === 'round-trip' || tripType === 'outstation') && fareDetails?.billableKm && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Billable KM</span>
                    <span className="text-white">{fareDetails.billableKm} km</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Base Fare</span>
                  <span className="text-white">₹{fareDetails?.baseFare || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Distance Fare</span>
                  <span className="text-white">
                    ₹{fareDetails?.pricePerKm || 0} × {(tripType === 'round-trip' || tripType === 'outstation') ? (fareDetails?.billableKm || 0) : (fareDetails?.distanceKm || 0)} km
                  </span>
                </div>

                {(tripType === 'round-trip' || tripType === 'outstation') && fareDetails?.totalNights && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Driver Allowance</span>
                    <span className="text-white">₹{fareDetails.driverAllowanceTotal || 0}</span>
                  </div>
                )}

                <div className="border-t border-white/20 pt-4 flex justify-between font-semibold">
                  <span className="text-gray-300 text-base">Total Fare</span>
                  <span className="text-blue-400 text-2xl font-bold">₹{fareDetails?.estimatedFare || 0}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={isSearching}
                    className="flex-1 py-3.5 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all text-sm disabled:opacity-50 shadow-lg"
                  >
                    {isSearching ? (
                      <Loader className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          <div className="group bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/30 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">One-Way Trips</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">Travel between any two cities with fixed pricing</p>
            <button 
              onClick={() => {
                setTripType('one-way');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-white text-xs sm:text-sm font-medium hover:text-gray-200 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Book now
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
          
          <div className="group bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-600/30 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">Round Trips</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">Complete packages with return journey included</p>
            <button 
              onClick={() => {
                setTripType('round-trip');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-white text-xs sm:text-sm font-medium hover:text-gray-200 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Book now
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
          
          <div className="group bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer hidden md:block">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/30 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">Corporate Travel</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">Business travel solutions with billing support</p>
            <button 
              onClick={() => {
                setTripType('one-way');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-white text-xs sm:text-sm font-medium hover:text-gray-200 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Book now
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce hidden sm:block group">
        <span className="text-white/60 text-xs font-medium">Scroll to explore</span>
        <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
