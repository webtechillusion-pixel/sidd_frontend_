import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  Car, 
  MapPin, 
  Users, 
  Clock, 
  ArrowRightLeft,
  ChevronDown,
  Check,
  Shield,
  DollarSign,
  Navigation,
  Phone,
  X,
  CreditCard,
  Search,
  Target,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  Radio,
  Sparkles,
  Star,
  Truck,
  Wind,
  User
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

// Add Google Maps API integration
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected, joinBookingRoom, joinUserRoom } = useSocket();
  
  const [step, setStep] = useState(1); // 1: Location, 2: Vehicle, 3: Confirm
  const [pickupLocation, setPickupLocation] = useState({ text: '', lat: null, lng: null });
  const [dropLocation, setDropLocation] = useState({ text: '', lat: null, lng: null });
  const [passengers, setPassengers] = useState(1);
  const [vehicleType, setVehicleType] = useState('SEDAN');
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSelectingFor, setMapSelectingFor] = useState('pickup');
  const [fareEstimate, setFareEstimate] = useState(0);
  const [fareDetails, setFareDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Added nearbyCabs state to fix the error
  const [nearbyCabs, setNearbyCabs] = useState([]);
  const [loadingCabs, setLoadingCabs] = useState(false);
  const [cabTypes, setCabTypes] = useState([]);
  
  const [manualInput, setManualInput] = useState({ pickup: '', drop: '' });
  const [showSuggestions, setShowSuggestions] = useState({ pickup: false, drop: false });
  
  // New Rapido-style states
  const [bookingId, setBookingId] = useState(null);
  const [bookingOTP, setBookingOTP] = useState('');
  const [searchingRiders, setSearchingRiders] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [assignedRider, setAssignedRider] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('IDLE'); // IDLE, SEARCHING, DRIVER_ASSIGNED, etc.
  const [tripType, setTripType] = useState('ONE_WAY');

  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const [bookingType, setBookingType] = useState('IMMEDIATE');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const didRedirectRef = useRef(false);

  const pickupMarkerRef = useRef(null);
  const dropMarkerRef = useRef(null);
  const pickupInfoWindowRef = useRef(null);
  const dropInfoWindowRef = useRef(null);

  // Vehicle options matching backend
 const vehicleOptions = [
  {
    id: 'HATCHBACK',
    name: 'Hatchback',
    capacity: '4 passengers',
    icon: '🚘',
    description: 'Economical option for city travel',
    features: ['AC', 'Fuel Efficient', 'Easy Parking'],
    baseFare: 40,
    pricePerKm: 10
  },
  {
    id: 'SEDAN',
    name: 'Sedan',
    capacity: '4 passengers',
    icon: '🚗',
    description: 'Comfortable cars for city travel',
    features: ['AC', 'Music System', 'Spacious Boot'],
    baseFare: 50,
    pricePerKm: 12
  },
  {
    id: 'SUV',
    name: 'SUV',
    capacity: '6-7 passengers',
    icon: '🚙',
    description: 'Spacious vehicles for groups',
    features: ['AC', 'Extra Space', 'Comfort Seats'],
    baseFare: 70,
    pricePerKm: 18
  },
  {
    id: 'PREMIUM',
    name: 'Premium Car',
    capacity: '4 passengers',
    icon: '🏎️',
    description: 'Premium cars for special occasions',
    features: ['Premium AC', 'Leather Seats', 'WiFi'],
    baseFare: 100,
    pricePerKm: 25
  }
];

  useEffect(() => {
    if (id) {
      // Load booking by ID and set step 4
      const loadBooking = async () => {
        try {
          const response = await bookingService.getBookingDetails(id);
          if (response?.success) {
            const booking = response.data;
            setBookingId(booking._id);
            setBookingOTP(booking.otp);
            setCurrentStatus(booking.bookingStatus);
            setStep(4);
            // also set other relevant state (pickup, drop, vehicleType, etc.) if needed
          } else {
            navigate('/book');
          }
        } catch (error) {
          console.error('Error loading booking:', error);
          navigate('/book');
        }
      };
      loadBooking();
    }
  }, [id, navigate]);

  // Initialize Google Maps and Autocomplete
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key is not configured');
      return;
    }

    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
  if (!window.google || !window.google.maps || !mapRef.current) return;

  // Set default center to user's location if available
  let defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai
  
  mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
    center: defaultCenter,
    zoom: 12,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  // Try to get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // Center map on user's location
        mapInstanceRef.current.setCenter({ lat: userLat, lng: userLng });
        mapInstanceRef.current.setZoom(14);
        
        // Add blue dot for user's current location
        new window.google.maps.Marker({
          position: { lat: userLat, lng: userLng },
          map: mapInstanceRef.current,
          title: 'Your Current Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          },
          zIndex: 1000
        });
        
        // Add circle around user's location
        new window.google.maps.Circle({
          strokeColor: '#4285F4',
          strokeOpacity: 0.3,
          strokeWeight: 1,
          fillColor: '#4285F4',
          fillOpacity: 0.1,
          map: mapInstanceRef.current,
          center: { lat: userLat, lng: userLng },
          radius: 500 // 500 meters
        });
      },
      (error) => {
        console.log('Geolocation permission denied or error:', error);
        // Keep default center
      }
    );
  }

  // Initialize autocomplete for search
  if (searchInputRef.current) {
    const options = {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'in' }
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      searchInputRef.current,
      options
    );

    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  }

  // Add click listener to map for selecting locations
  mapInstanceRef.current.addListener('click', async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    // Reverse geocode to get address
    const address = await reverseGeocode(lat, lng);
    
    const location = {
      name: address || 'Selected Location',
      coords: { lat, lng },
      lat,
      lng,
      type: 'map_click'
    };
    
    handleMapLocationSelect(location);
  });

  // If we already have pickup/drop locations, add their markers
  if (pickupLocation.lat && pickupLocation.lng) {
    addLocationMarker(pickupLocation, 'pickup');
  }
  
  if (dropLocation.lat && dropLocation.lng) {
    addLocationMarker(dropLocation, 'drop');
  }
  
  // Update map bounds if we have markers
  updateMapBounds();
};

    if (showMapModal) {
      loadGoogleMapsScript();
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [showMapModal]);

  // Setup WebSocket listeners for real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('Setting up WebSocket listeners for booking updates');

    // Listen for rider assignment
    const handleRideAccepted = (data) => {
      console.log('✅ Ride accepted:', data);
      if (data.bookingId === bookingId) {
        setAssignedRider(data.rider);
        setCurrentStatus('DRIVER_ASSIGNED');
        toast.success(`🚗 Rider ${data.rider?.name || 'Driver'} has accepted your ride!`);
        
        // Clear search timeout since ride is accepted
        if (searchTimeout) {
          clearTimeout(searchTimeout);
          setSearchTimeout(null);
        }
      }
    };

    // Listen for rider arrival
    const handleDriverArrived = (data) => {
      console.log('📍 Driver arrived:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('DRIVER_ARRIVED');
        toast.info('🎯 Your rider has arrived at the pickup location');
      }
    };

    // Listen for trip start
    const handleTripStarted = (data) => {
      console.log('🚀 Trip started:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('TRIP_STARTED');
        toast.info('🛣️ Your trip has started. Enjoy your ride!');
      }
    };

    // Listen for trip completion (handles both booking-room 'trip-completed' and user-room 'ride-completed')
    const handleTripCompleted = (data) => {
      console.log('Trip completed:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('TRIP_COMPLETED');
        toast.success('✅ Trip completed!');
        // prevent duplicate redirects from polling + socket
        didRedirectRef.current = true;
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    };

    // Listen for booking cancellation
    const handleBookingCancelled = (data) => {
      console.log('Booking cancelled:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('CANCELLED');
        toast.error(`${data.reason || 'Booking was cancelled'}`);
        setTimeout(() => resetBookingState(), 3000);
      }
    };

    // Listen for no riders available
    const handleNoRidersAvailable = (data) => {
      console.log('No riders available:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('CANCELLED');
        toast.error('No riders available in your area. Please try again later.');
        setTimeout(() => resetBookingState(), 3000);
      }
    };

    // Attach event listeners
    socket.on('ride-accepted', handleRideAccepted);
    socket.on('driver-arrived', handleDriverArrived);
    socket.on('trip-started', handleTripStarted);
    socket.on('trip-completed', handleTripCompleted);
    socket.on('ride-completed', handleTripCompleted); // backend emits 'ride-completed' to user room
    socket.on('booking-cancelled', handleBookingCancelled);
    socket.on('no-riders-available', handleNoRidersAvailable);

    // Join booking room if we have a booking ID
    if (bookingId) {
      console.log('🔗 Joining booking room:', bookingId);
      socket.emit('join-booking', bookingId);
    }

    // Also ensure we join the user room so user-targeted events are received
    if (user && (user._id || user.id) && joinUserRoom) {
      joinUserRoom(user._id || user.id);
    }

    // Listen for reconnection and re-join the room
const onReconnect = () => {
  console.log('🔁 Socket reconnected, rejoining booking room');
  if (bookingId) {
    socket.emit('join-booking', bookingId);
  }
};
socket.io.on('reconnect', onReconnect);

    return () => {
      console.log('🧹 Cleaning up WebSocket listeners');
      socket.off('ride-accepted', handleRideAccepted);
      socket.off('driver-arrived', handleDriverArrived);
      socket.off('trip-started', handleTripStarted);
      socket.off('trip-completed', handleTripCompleted);
      socket.off('ride-completed', handleTripCompleted);
      socket.off('booking-cancelled', handleBookingCancelled);
      socket.off('no-riders-available', handleNoRidersAvailable);
      socket.io.off('reconnect', onReconnect);
      
      if (bookingId) {
        socket.emit('leave-booking', bookingId);
      }
    };
  }, [socket, isConnected, bookingId, searchTimeout]);

  // Fetch nearby cabs when moving to step 3
  useEffect(() => {
    if (step === 3 && pickupLocation.lat && pickupLocation.lng) {
      fetchNearbyCabs();
    }
  }, [step, pickupLocation.lat, pickupLocation.lng, vehicleType]);

  // Calculate fare whenever trip details change
  useEffect(() => {
    const calculateFare = async () => {
      if (!pickupLocation.lat || !dropLocation.lat) {
        setFareEstimate(0);
        setFareDetails(null);
        return;
      }

      try {
        const fareData = {
          pickupLat: pickupLocation.lat,
          pickupLng: pickupLocation.lng,
          dropLat: dropLocation.lat,
          dropLng: dropLocation.lng,
          cabType: vehicleType,
          vehicleType: vehicleType, // Send both for compatibility
          passengers: passengers
        };

        console.log('Calculating fare with data:', fareData);
        const response = await bookingService.calculateFare(fareData);
        
        if (response.success) {
          setFareEstimate(response.data.estimatedFare);
          setFareDetails(response.data);
        } else {
          console.error('Fare calculation failed:', response.message);
          // Set default fare if calculation fails
          setFareEstimate(150);
          setFareDetails({
            distance: 5.0,
            estimatedDuration: 15,
            breakdown: {
              baseFare: 50,
              distanceFare: 100
            }
          });
        }
      } catch (error) {
        console.error('Error calculating fare:', error);
        // Set default values on error
        setFareEstimate(150);
        setFareDetails({
          distance: 5.0,
          estimatedDuration: 15,
          breakdown: {
            baseFare: 50,
            distanceFare: 100
          }
        });
      }
    };

    calculateFare();
  }, [pickupLocation, dropLocation, vehicleType, passengers]);

  // Function to fetch nearby cabs from backend
  const fetchNearbyCabs = async () => {
    if (!pickupLocation.lat || !pickupLocation.lng) {
      toast.error('Please set pickup location first');
      return;
    }

    setLoadingCabs(true);
    console.log('🔍 Fetching nearby cabs for:', { lat: pickupLocation.lat, lng: pickupLocation.lng, vehicleType });
    
    // Development: mock cabs removed for deployment
    // const mockCabs = [ ... ];
    // setNearbyCabs(mockCabs);
    // console.log('✅ Mock cabs loaded:', mockCabs.length);
    // toast.success('Found available drivers in your area!');
    // Production fallback: no nearby cabs until API returns data
    setNearbyCabs([]);
    setLoadingCabs(false);
  };

  // Add this function to handle date/time selection
const handleDateTimeSelect = () => {
  if (!scheduledDate || !scheduledTime) {
    toast.error('Please select both date and time');
    return;
  }

  const selectedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
  const now = new Date();
  
  // Validate: Must be at least 30 minutes in the future
  if (selectedDateTime < new Date(now.getTime() + 30 * 60000)) {
    toast.error('Please select a time at least 30 minutes from now');
    return;
  }

  // Format for display
  const formattedDate = selectedDateTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = selectedDateTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  toast.success(`Scheduled for ${formattedDate} at ${formattedTime}`);
  setShowDateTimePicker(false);
};


  // Function to fetch available cab types
  const fetchCabTypes = async () => {
    if (!pickupLocation.lat || !pickupLocation.lng) return;
    
    try {
      const response = await api.get('/api/search/cab-types', {
        params: {
          lat: pickupLocation.lat,
          lng: pickupLocation.lng
        }
      });

      if (response.data.success) {
        setCabTypes(response.data.data.availableCabTypes || []);
      }
    } catch (error) {
      console.error('Error fetching cab types:', error);
    }
  };

  // Calculate fare based on distance and cab type
  const calculateFareForCab = (cab, distance) => {
    if (!distance || distance === 0) return 0;
    
    const baseFares = {
      'HATCHBACK': 50,
      'SEDAN': 60,
      'SUV': 80,
      'PREMIUM': 100
    };
    
    const perKmRates = {
      'HATCHBACK': 12,
      'SEDAN': 14,
      'SUV': 18,
      'PREMIUM': 25
    };
    
    const cabType = cab?.cab?.type || vehicleType;
    const baseFare = baseFares[cabType] || 60;
    const perKmRate = perKmRates[cabType] || 14;
    
    // Calculate fare: base fare + (distance * per km rate)
    const fare = baseFare + (distance * perKmRate);
    
    // Add surge pricing if few cabs available
    const surgeMultiplier = nearbyCabs.length < 3 ? 1.2 : 1;
    
    return Math.round(fare * surgeMultiplier);
  };

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = {
        name: place.name || place.formatted_address,
        coords: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        type: 'selected'
      };
      handleMapLocationSelect(location);
    }
  };

  // Handle search using Google Geocoding API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results.map(result => ({
          name: result.formatted_address,
          coords: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          },
          type: 'search'
        })));
      } else {
        toast.info('No locations found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle manual input with Google Geocoding
  const searchLocation = async (query, type) => {
    if (!query.trim() || query.length < 3) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const results = data.results.map(result => ({
          name: result.formatted_address,
          coords: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          },
          type: 'search'
        }));
        
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle manual input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (manualInput.pickup.trim() && manualInput.pickup.length >= 3 && !pickupLocation.lat) {
        searchLocation(manualInput.pickup, 'pickup');
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [manualInput.pickup]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (manualInput.drop.trim() && manualInput.drop.length >= 3 && !dropLocation.lat) {
        searchLocation(manualInput.drop, 'drop');
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [manualInput.drop]);

  // ========== POLLING FALLBACK ==========
useEffect(() => {
  if (!bookingId) return;

  const pollInterval = setInterval(async () => {
    try {
      const response = await bookingService.getBookingDetails(bookingId);
      if (response?.success) {
        const booking = response.data;
        console.log('Booking status from Polling:', booking.bookingStatus);
        
        // Update UI based on current booking status
        if (booking.bookingStatus === 'DRIVER_ASSIGNED' && !assignedRider) {
          setCurrentStatus('DRIVER_ASSIGNED');
          // If we have riderId but no rider details, fetch them
          if (booking.riderId) {
            fetchRiderDetails(booking.riderId);
          }
        } else if (booking.bookingStatus === 'DRIVER_ARRIVED') {
          setCurrentStatus('DRIVER_ARRIVED');
        } else if (booking.bookingStatus === 'TRIP_STARTED') {
          setCurrentStatus('TRIP_STARTED');
        } else if (booking.bookingStatus === 'TRIP_COMPLETED') {
          setCurrentStatus('TRIP_COMPLETED');
          if (!didRedirectRef.current) {
            didRedirectRef.current = true;
            setTimeout(() => navigate('/dashboard'), 1500);
          }
        } else if (booking.bookingStatus === 'CANCELLED') {
          setCurrentStatus('CANCELLED');
        }
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 5000); // every 5 seconds

  return () => clearInterval(pollInterval);
}, [bookingId, assignedRider]);

  const handleMapLocationSelect = async (location) => {
  // If location doesn't have exact address, reverse geocode it
  let addressText = location.name;
  if (!addressText || addressText === 'Selected Location' || addressText === 'Current Location') {
    addressText = await reverseGeocode(location.coords.lat, location.coords.lng);
  }
  
  const locationData = {
    text: addressText,
    lat: location.coords.lat,
    lng: location.coords.lng,
    placeId: location.placeId
  };
  
 if (mapSelectingFor === 'pickup') {
    setPickupLocation(locationData);
    setManualInput({ ...manualInput, pickup: addressText });
    
    // Add/update marker on map
    if (mapInstanceRef.current && window.google) {
      addLocationMarker(locationData, 'pickup');
    }
  } else {
    setDropLocation(locationData);
    setManualInput({ ...manualInput, drop: addressText });
    
    // Add/update marker on map
    if (mapInstanceRef.current && window.google) {
      addLocationMarker(locationData, 'drop');
    }
  }
  
  // Update map view to show both markers if map is loaded
  if (mapInstanceRef.current && window.google) {
    updateMapBounds();
  }
  
  // Close modal if open
  setShowMapModal(false);
  setSearchQuery('');
  setSearchResults([]);
  setShowSuggestions({ pickup: false, drop: false });
};

  const handleManualInput = (value, type) => {
    if (type === 'pickup') {
      setManualInput({ ...manualInput, pickup: value });
      if (value === '') {
        setPickupLocation({ text: '', lat: null, lng: null });
      }
    } else {
      setManualInput({ ...manualInput, drop: value });
      if (value === '') {
        setDropLocation({ text: '', lat: null, lng: null });
      }
    }
  };

  const handleUseCurrentLocation = async () => {
  if (navigator.geolocation) {
    setMapLoading(true);
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address
      const address = await reverseGeocode(latitude, longitude);
      
      const locationData = {
        name: address || 'Your Current Location',
        text: address || 'Your Current Location',
        lat: latitude,
        lng: longitude,
        coords: { lat: latitude, lng: longitude },
        type: 'current',
        placeId: null
      };
      
      handleMapLocationSelect(locationData);
      
      // Update map view
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
        mapInstanceRef.current.setZoom(16);
        
        // Add marker
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        
        markerRef.current = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
      }
      
    } catch (error) {
      console.error('Geolocation error:', error);
      toast.error('Unable to get your location. Please enable location services.');
    } finally {
      setMapLoading(false);
    }
  } else {
    toast.error('Geolocation is not supported by your browser');
  }
};

// Add reverse geocode function
const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
};

// Function to add marker to map
const addLocationMarker = (location, type) => {
  if (!window.google || !window.google.maps || !mapInstanceRef.current)
     {
    console.error('Cannot add marker: Missing required data');
    return;
  }
  
  const markerColor = type === 'pickup' 
    ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' 
    : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  
  const markerLabel = type === 'pickup' ? 'P' : 'D';

   // Remove existing marker if it exists
  if (type === 'pickup' && pickupMarkerRef.current) {
    pickupMarkerRef.current.setMap(null);
  } else if (type === 'drop' && dropMarkerRef.current) {
    dropMarkerRef.current.setMap(null);
  }
  
  const marker = new window.google.maps.Marker({
    position: { lat: location.lat, lng: location.lng },
    map: mapInstanceRef.current,
    title: type === 'pickup' ? 'Pickup Location' : 'Drop Location',
    label: markerLabel,
    icon: {
      url: markerColor,
      scaledSize: new window.google.maps.Size(40, 40)
    },
    animation: window.google.maps.Animation.DROP,
    draggable: true
  });

   // Add drag end listener
  marker.addListener('dragend', async (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    const address = await reverseGeocode(newLat, newLng);
    
    const updatedLocation = {
      text: address || 'Dragged Location',
      lat: newLat,
      lng: newLng
    };
    
    if (type === 'pickup') {
      setPickupLocation(updatedLocation);
      setManualInput({ ...manualInput, pickup: address || 'Dragged Location' });
    } else {
      setDropLocation(updatedLocation);
      setManualInput({ ...manualInput, drop: address || 'Dragged Location' });
    }
  });
  
  // Store markers
  if (type === 'pickup') {
    pickupMarkerRef.current = marker;
  } else {
    dropMarkerRef.current = marker;
  }

  
  // Add info window
  const infoWindow = new window.google.maps.InfoWindow({
    content: `
      <div class="p-2">
        <strong class="text-sm">${type === 'pickup' ? '📍 Pickup' : '🎯 Drop'}</strong>
        <p class="text-xs mt-1">${location.text || 'Location selected'}</p>
      </div>
    `
  });
  
  marker.addListener('click', () => {
    infoWindow.open(mapInstanceRef.current, marker);
  });
  
  // Store markers
  if (type === 'pickup') {
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null); // Remove old marker
    }
    pickupMarkerRef.current = marker;
    pickupInfoWindowRef.current = infoWindow;
    
    // Auto-open pickup info window
    infoWindow.open(mapInstanceRef.current, marker);
  } else {
    if (dropMarkerRef.current) {
      dropMarkerRef.current.setMap(null); // Remove old marker
    }
    dropMarkerRef.current = marker;
    dropInfoWindowRef.current = infoWindow;
  }
  
  // Fit bounds to show all markers
  updateMapBounds();
};

// Function to update map bounds to show all markers
const updateMapBounds = () => {
  if (!mapInstanceRef.current || (!pickupMarkerRef.current && !dropMarkerRef.current)) return;
  
  const bounds = new window.google.maps.LatLngBounds();
  
  if (pickupMarkerRef.current) {
    bounds.extend(pickupMarkerRef.current.getPosition());
  }
  
  if (dropMarkerRef.current) {
    bounds.extend(dropMarkerRef.current.getPosition());
  }
  
  if (!bounds.isEmpty()) {
    // Add padding to bounds
    mapInstanceRef.current.fitBounds(bounds);
    const padding = 100; // pixels
    mapInstanceRef.current.panToBounds(bounds, padding);
  }
};


  const resetBookingState = () => {
  setBookingId(null);
  setBookingOTP('');
  setSearchingRiders(0);
  setAssignedRider(null);
  setCurrentStatus('IDLE');
  setBookingType('IMMEDIATE');  // ADD THIS LINE
  setScheduledDate('');         // ADD THIS LINE
  setScheduledTime('');         // ADD THIS LINE
  setPaymentMethod('CASH');
  setStep(1);
  if (searchTimeout) clearTimeout(searchTimeout);
};

// ========== FETCH RIDER DETAILS (FALLBACK) ==========
const fetchRiderDetails = async (riderId) => {
  try {
    const id = typeof riderId === 'object' ? riderId.toString() : riderId; 
    const response = await api.get(`/api/riders/${id}`);
    if (response.data?.success) {
      setAssignedRider(response.data.data);
    }
  } catch (error) {
    console.error('Failed to fetch rider details:', error);
  }
};

  // Rapido-style booking creation
const handleCreateBooking = async (e) => {
  e.preventDefault();
  
  if (!pickupLocation.lat || !dropLocation.lat) {
    toast.error('Please select both pickup and drop locations');
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
    
    // Scheduled time must be at least 30 minutes in the future
    if (scheduledDateTime < new Date(now.getTime() + 30 * 60000)) {
      toast.error('Please select a time at least 30 minutes from now');
      return;
    }
  }

  setLoading(true);
  console.log('🚀 Starting booking creation process...');

  try {
    // Format data to match server expectations
    const bookingData = {
      pickup: {
        addressText: pickupLocation.text || 'Current Location',
        lat: pickupLocation.lat,
        lng: pickupLocation.lng,
        contactName: user?.name || 'Guest',
        contactPhone: user?.phone || '+919999999999'
      },
      drop: {
        addressText: dropLocation.text || 'Destination',
        lat: dropLocation.lat,
        lng: dropLocation.lng
      },
      vehicleType: vehicleType,
      paymentMethod: paymentMethod,
      passengers: passengers,
      tripType: tripType,
      bookingType: bookingType,
      ...(bookingType === 'SCHEDULED' && {
        scheduledAt: `${scheduledDate}T${scheduledTime}:00.000Z`
      })
    };

    console.log('📦 Booking data prepared:', bookingData);

    const response = await bookingService.createBooking(bookingData);
    console.log('📨 Booking API response:', response);
    
    if (response.success) {
      const { bookingId, otp, estimatedFare, searchingRiders, scheduledAt } = response.data;
      
      setBookingId(bookingId);
      setBookingOTP(otp);
      setSearchingRiders(searchingRiders || 0);
      setCurrentStatus('SEARCHING_DRIVER');
      
      // Handle payment redirection based on payment method
      if (paymentMethod === 'CASH') {
        // For cash payments, stay on booking page and search for riders
        setStep(4); // Move to booking confirmation screen
        
        toast.success(
          bookingType === 'IMMEDIATE' 
            ? 'Booking created! Searching for nearby riders...' 
            : `Scheduled booking confirmed for ${new Date(scheduledAt).toLocaleString()}`
        );
        
        // Set timeout for search expiry (for immediate bookings only)
        if (bookingType === 'IMMEDIATE') {
          const timeout = setTimeout(() => {
            if (currentStatus === 'SEARCHING_DRIVER') {
              setCurrentStatus('CANCELLED');
              toast.error('No riders available at the moment. Please try again.');
              // Auto reset after 3 seconds
              setTimeout(() => {
                resetBookingState();
              }, 3000);
            }
          }, 60000); // Increased to 60 seconds
          
          setSearchTimeout(timeout);
        }
        
        // Join booking room for WebSocket updates
        if (socket && isConnected) {
          console.log('🔗 Joining booking room for real-time updates:', bookingId);
          socket.emit('join-booking', bookingId);
          
          // Emit booking created event to notify nearby riders
          socket.emit('booking-created', {
            bookingId: bookingId,
            pickup: pickupLocation,
            drop: dropLocation,
            vehicleType: vehicleType,
            estimatedFare: estimatedFare,
            customerInfo: {
              name: user?.name || 'Customer',
              phone: user?.phone || '+919999999999'
            }
          });
        } else {
          console.warn('⚠️ Socket not connected, booking created but no real-time updates available');
        }
      } else {
        // For online payments, redirect to checkout page
        // Navigate to checkout with booking details

         sessionStorage.setItem('pendingBookingId', bookingId);
  sessionStorage.setItem('pendingBookingData', JSON.stringify({
    bookingId,
    amount: estimatedFare,
    paymentMethod,
    bookingType,
    scheduledAt,
    vehicleType,
    pickup: pickupLocation.text,
    drop: dropLocation.text,
    otp,
    passengers,
    tripType
  }));

navigate('/checkout', {
          state: {
            bookingId: bookingId,
            amount: estimatedFare,
            paymentMethod: paymentMethod,
            bookingType: bookingType,
            scheduledAt: scheduledAt,
            vehicleType: vehicleType,
            pickup: pickupLocation.text,
            drop: dropLocation.text,
            otp: otp,
            passengers: passengers,
            tripType: tripType
          }
        });
        
        toast.success('Booking created! Redirecting to payment...');
      }
      
    } else {
      toast.error(response.message || 'Failed to create booking');
    }
  } catch (error) {
    console.error('Booking error:', error);
    toast.error(error.response?.data?.message || 'Failed to create booking');
  } finally {
    setLoading(false);
  }
};

  const handleCancelBooking = async () => {
    if (!bookingId) return;
    
    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by user');
      resetBookingState();
      toast.info('Booking cancelled');
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Handle cab selection in step 3
  const handleCabSelection = (cab) => {
    setCurrentStatus('DRIVER_SELECTED');
    toast.success(`Selected ${cab.cab?.model || cab.rider?.name}'s vehicle`);
    
    // You can store selected cab in state if needed
  };

  const renderStep1 = () => (
  
    

    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Where to?</h3>
        <p className="text-gray-600">Enter your pickup and drop locations</p>
      </div>

      {/* Trip Type Selection */}
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setTripType('ONE_WAY')}
          className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center ${
            tripType === 'ONE_WAY'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          One Way
        </button>
        <button
          type="button"
          onClick={() => setTripType('ROUND_TRIP')}
          className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center ${
            tripType === 'ROUND_TRIP'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          Round Trip
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`py-3 px-4 rounded-lg border ${paymentMethod === 'CASH' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-300'}`}
            onClick={() => setPaymentMethod('CASH')}
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Cash</span>
            </div>
          </button>
          <button
            type="button"
            className={`py-3 px-4 rounded-lg border ${paymentMethod === 'ONLINE' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-300'}`}
            onClick={() => setPaymentMethod('ONLINE')}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Online</span>
            </div>
          </button>
        </div>
        {paymentMethod === 'ONLINE' && (
          <p className="text-xs text-blue-600 mt-2">
            You'll be redirected to secure payment page
          </p>
        )}
      </div>

      {/* Booking Type Selection */}
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Booking Type
  </label>
  <div className="flex space-x-4">
    <button
      type="button"
      onClick={() => {
        setBookingType('IMMEDIATE');
        setShowDateTimePicker(false);
      }}
      className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center ${
        bookingType === 'IMMEDIATE'
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Clock className="h-4 w-4 mr-2" />
      Immediate Ride
    </button>
    <button
      type="button"
      onClick={() => setBookingType('SCHEDULED')}
      className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center ${
        bookingType === 'SCHEDULED'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Calendar className="h-4 w-4 mr-2" />
      Schedule Later
    </button>
  </div>
</div>

{/* Date Time Picker for Scheduled Bookings */}
{bookingType === 'SCHEDULED' && (
  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-bold text-blue-800">Schedule Your Ride</h4>
        <p className="text-sm text-blue-600">Pick a date and time for your ride</p>
      </div>
      <Calendar className="h-5 w-5 text-blue-600" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">
          Date
        </label>
        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          max={new Date(Date.now() + 7 * 24 * 60 * 60000).toISOString().split('T')[0]}
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">
          Time
        </label>
        <input
          type="time"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
    
    {scheduledDate && scheduledTime && (
      <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="font-medium text-gray-900">
              Scheduled for {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleDateString('en-IN', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-600">
              at {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    )}
    
    <div className="mt-4 text-xs text-blue-600">
      <p>✓ Ride will be booked 15 minutes before scheduled time</p>
      <p>✓ You can cancel up to 30 minutes before scheduled time</p>
    </div>
  </div>
)}

      {/* Pickup Location */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Location *
          </label>
          <button
            type="button"
            onClick={() => {
              setMapSelectingFor('pickup');
              setShowMapModal(true);
            }}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1 sm:mt-0"
          >
            <Navigation className="h-4 w-4 mr-1" />
            Select on Map
          </button>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={manualInput.pickup || pickupLocation.text}
            placeholder="Type pickup location or select on map"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => handleManualInput(e.target.value, 'pickup')}
            onFocus={() => {
              setMapSelectingFor('pickup');
              setShowSuggestions({ ...showSuggestions, pickup: true });
            }}
          />
          {manualInput.pickup && (
            <button
              type="button"
              onClick={() => {
                setManualInput({ ...manualInput, pickup: '' });
                setPickupLocation({ text: '', lat: null, lng: null });
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Suggestions for pickup */}
        {showSuggestions.pickup && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.slice(0, 5).map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  handleMapLocationSelect(result);
                  setShowSuggestions({ ...showSuggestions, pickup: false });
                }}
                className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-start"
              >
                <MapPin className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{result.name}</p>
                  <p className="text-xs text-gray-500">Click to select</p>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {pickupLocation.lat && (
          <p className="text-xs text-green-600 mt-1 flex items-center">
            <Check className="h-3 w-3 mr-1" /> Location coordinates saved
          </p>
        )}
      </div>

      {/* Drop Location */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Drop Location *
          </label>
          <button
            type="button"
            onClick={() => {
              setMapSelectingFor('drop');
              setShowMapModal(true);
            }}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1 sm:mt-0"
          >
            <Target className="h-4 w-4 mr-1" />
            Select on Map
          </button>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={manualInput.drop || dropLocation.text}
            placeholder="Type drop location or select on map"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => handleManualInput(e.target.value, 'drop')}
            onFocus={() => {
              setMapSelectingFor('drop');
              setShowSuggestions({ ...showSuggestions, drop: true });
            }}
          />
          {manualInput.drop && (
            <button
              type="button"
              onClick={() => {
                setManualInput({ ...manualInput, drop: '' });
                setDropLocation({ text: '', lat: null, lng: null });
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Suggestions for drop */}
        {showSuggestions.drop && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.slice(0, 5).map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  handleMapLocationSelect(result);
                  setShowSuggestions({ ...showSuggestions, drop: false });
                }}
                className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-start"
              >
                <MapPin className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{result.name}</p>
                  <p className="text-xs text-gray-500">Click to select</p>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {dropLocation.lat && (
          <p className="text-xs text-green-600 mt-1 flex items-center">
            <Check className="h-3 w-3 mr-1" /> Location coordinates saved
          </p>
        )}
      </div>

      {/* Passengers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Passengers
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Passenger' : 'Passengers'}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      <button
  type="button"
  onClick={() => setStep(2)}
  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
  disabled={!pickupLocation.lat || !dropLocation.lat || (bookingType === 'SCHEDULED' && (!scheduledDate || !scheduledTime))}
>
  {bookingType === 'SCHEDULED' ? 'Schedule Ride' : 'Find Available Cabs'} →
</button>
    </div>
  );

  const renderStep2 = () => {
    const selectedVehicle = vehicleOptions.find(v => v.id === vehicleType);

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Select Vehicle</h3>
          <p className="text-gray-600">Choose your preferred ride</p>
        </div>

        {/* Selected Vehicle Preview */}
        <div 
          className="p-4 border-2 border-blue-500 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => setShowVehicleModal(true)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
              <span className="text-2xl sm:text-3xl">
                {selectedVehicle?.icon}
              </span>
              <div>
                <h4 className="font-bold text-lg sm:text-xl">{selectedVehicle?.name}</h4>
                <p className="text-sm text-gray-600">{selectedVehicle?.capacity}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                ₹{fareEstimate || 'Calculating...'}
              </p>
              <p className="text-sm text-gray-500">Estimated fare</p>
            </div>
          </div>
        </div>

        {/* Available Cab Types */}
        {cabTypes.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold text-gray-800 mb-3">Available Near You</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cabTypes.slice(0, 4).map((cabType, index) => (
                <div key={index} className="text-center p-3 bg-white rounded-lg">
                  <div className="text-lg mb-1">{cabType.icon || '🚗'}</div>
                  <p className="font-medium text-sm">{cabType.cabType}</p>
                  <p className="text-xs text-gray-600">{cabType.count} available</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fare Summary */}
        {fareDetails ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6">
            <h4 className="font-bold text-lg mb-4">Trip Summary</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance</span>
                <span className="font-medium">{fareDetails.distance?.toFixed(1) || 5.0} km</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Duration</span>
                <span className="font-medium">{fareDetails.estimatedDuration || 15} min</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle Type</span>
                <span className="font-medium">{selectedVehicle?.name}</span>
              </div>
              
              {fareDetails.breakdown && (
                <>
                  <div className="pt-2 border-t border-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Fare</span>
                      <span className="font-medium">₹{fareDetails.breakdown.baseFare || 50}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance Fare</span>
                      <span className="font-medium">₹{fareDetails.breakdown.distanceFare || 100}</span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="pt-3 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₹{fareEstimate}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  *Final fare may vary based on actual route
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-gray-700">Calculating fare based on your locations...</span>
            </div>
          </div>
        )}

        {/* Booking Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-medium">Safe & Insured</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-medium">No Hidden Charges</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-medium">24/7 Support</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-medium">On-time Service</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            disabled={!fareDetails}
            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            View Available Cabs
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const selectedVehicle = vehicleOptions.find(v => v.id === vehicleType);
    const cabsToShow = nearbyCabs || [];

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Available Cabs</h3>
          <p className="text-gray-600">Select a cab for your journey</p>
        </div>

        {/* Location Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <MapPin className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Pickup</p>
                  <p className="font-medium truncate">{pickupLocation.text || 'Current Location'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Dropoff</p>
                  <p className="font-medium truncate">{dropLocation.text || 'Destination'}</p>
                </div>
              </div>
              
              {fareDetails?.distance && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-semibold">{fareDetails.distance.toFixed(1)} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Est. Time</p>
                      <p className="font-semibold">{fareDetails.estimatedDuration} min</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setStep(2)}
              className="ml-4 text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
            >
              Change
            </button>
          </div>
        </div>
        
        {/* Available Cabs Section */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Available Cabs</h3>
              <p className="text-gray-600 text-sm mt-1">
                {loadingCabs ? 'Searching for cabs...' : `Found ${cabsToShow.length} available cabs`}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 flex space-x-2">
              <button
                onClick={fetchNearbyCabs}
                disabled={loadingCabs}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Change Vehicle
              </button>
            </div>
          </div>
          
          {loadingCabs ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Finding available cabs...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          ) : cabsToShow.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No cabs available in your area</p>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                Try changing your pickup location, vehicle type, or check back in a few minutes.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Change Location
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Change Vehicle Type
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing <span className="font-bold text-green-600">{cabsToShow.length}</span> available {vehicleType.toLowerCase()} cabs
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {cabsToShow.slice(0, 10).map((cab, index) => (
                  <div 
                    key={cab.rider?.id || index}
                    className="border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-lg border-gray-200 hover:border-blue-400"
                    onClick={() => handleCabSelection(cab)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <Truck className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-bold text-lg text-gray-800">
                                {cab.cab?.model || 'Cab'} 
                              </h4>
                              <span className="text-sm font-normal bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {cab.cab?.type || vehicleType}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {cab.cab?.number || 'MH 01 XX 1234'}
                            </p>
                            
                            {/* Rider Info */}
                            <div className="mt-3 flex flex-wrap items-center gap-4">
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {cab.rider?.name || 'Rider'}
                                </span>
                              </div>
                              
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {cab.rider?.rating || '4.5'} 
                                  <span className="text-gray-500 ml-1">
                                    ({cab.rider?.totalRatings || 100}+)
                                  </span>
                                </span>
                              </div>
                              
                              <div className="flex items-center">
                                <Users className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {cab.cab?.seatingCapacity || 4} seats
                                </span>
                              </div>
                              
                              {cab.cab?.acAvailable && (
                                <div className="flex items-center">
                                  <Wind className="h-4 w-4 text-blue-400 mr-2" />
                                  <span className="text-sm text-gray-700">AC</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 sm:ml-4 sm:text-right">
                        <div className="mb-2">
                          <div className="text-2xl font-bold text-green-600">
                            ₹{calculateFareForCab(cab, fareDetails?.distance || 5)}
                          </div>
                          <div className="text-sm text-gray-500">approx. fare</div>
                        </div>
                        
                        <div className="flex items-center sm:justify-end text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {cab.estimatedArrival || 5} min away
                          </span>
                        </div>
                        
                        <div className="mt-1 text-sm text-gray-500">
                          {cab.rider?.distance?.toFixed(1) || '0.5'} km
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90"
                      >
                        Select This Cab
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            ← Back to Vehicles
          </button>
          <button
            type="button"
            onClick={handleCreateBooking}
            disabled={loading || cabsToShow.length === 0}
            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition-colors text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating Booking...
              </span>
            ) : (
              'Confirm & Book Now'
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmation</h3>
          <p className="text-gray-600">Your booking is being processed</p>
        </div>

        {/* Booking Status Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
              {currentStatus === 'SEARCHING_DRIVER' ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              ) : currentStatus === 'DRIVER_ASSIGNED' ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <Truck className="h-12 w-12 text-blue-600" />
              )}
            </div>
            
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              {currentStatus === 'SEARCHING_DRIVER' && 'Searching for available riders...'}
              {currentStatus === 'DRIVER_ASSIGNED' && 'Rider assigned!'}
              {currentStatus === 'DRIVER_ARRIVED' && 'Rider has arrived!'}
              {currentStatus === 'TRIP_STARTED' && 'Trip in progress'}
              {currentStatus === 'TRIP_COMPLETED' && 'Trip completed!'}
              {currentStatus === 'CANCELLED' && 'Booking cancelled'}
            </h4>
            
            <p className="text-gray-600">
              {currentStatus === 'SEARCHING_DRIVER' && `Searching ${searchingRiders || 10} nearby riders`}
              {currentStatus === 'DRIVER_ASSIGNED' && `Your rider ${assignedRider?.name || 'is on the way'}`}
              {currentStatus === 'DRIVER_ARRIVED' && 'Please meet your rider at the pickup point'}
              {currentStatus === 'TRIP_STARTED' && 'Enjoy your ride!'}
              {currentStatus === 'TRIP_COMPLETED' && 'Please proceed to payment'}
              {currentStatus === 'CANCELLED' && 'Please try booking again'}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Booking Status</span>
              <span className="text-sm font-medium text-blue-600">
                {currentStatus === 'SEARCHING_DRIVER' ? 'Searching' : 
                 currentStatus === 'DRIVER_ASSIGNED' ? 'Assigned' :
                 currentStatus === 'DRIVER_ARRIVED' ? 'Arrived' :
                 currentStatus === 'TRIP_STARTED' ? 'Started' :
                 currentStatus === 'TRIP_COMPLETED' ? 'Completed' : 'Cancelled'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ 
                  width: currentStatus === 'SEARCHING_DRIVER' ? '25%' :
                         currentStatus === 'DRIVER_ASSIGNED' ? '50%' :
                         currentStatus === 'DRIVER_ARRIVED' ? '75%' :
                         currentStatus === 'TRIP_STARTED' ? '90%' :
                         currentStatus === 'TRIP_COMPLETED' ? '100%' : '0%'
                }}
              ></div>
            </div>
            {/* For debugging – remove later */}
<div className="text-xs text-gray-400">
  Status: {currentStatus}
</div>
            
          </div>
          
          {/* Booking Details */}
<div className="bg-white rounded-lg p-4 mb-6">
  <h5 className="font-bold text-gray-800 mb-3">Booking Details</h5>
  <div className="space-y-2">
    <div className="flex justify-between">
      <span className="text-gray-600">Booking ID</span>
      <span className="font-medium text-sm">{bookingId || '---'}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Booking Type</span>
      <span className={`font-medium ${bookingType === 'IMMEDIATE' ? 'text-green-600' : 'text-blue-600'}`}>
        {bookingType === 'IMMEDIATE' ? 'Ride Now' : 'Scheduled'}
      </span>
    </div>
    {bookingType === 'SCHEDULED' && scheduledDate && scheduledTime && (
      <div className="flex justify-between">
        <span className="text-gray-600">Scheduled Time</span>
        <span className="font-medium">
          {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </span>
      </div>
    )}
    <div className="flex justify-between">
      <span className="text-gray-600">Estimated Fare</span>
      <span className="font-medium">₹{fareEstimate}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Vehicle Type</span>
      <span className="font-medium">{vehicleType}</span>
    </div>
    {bookingOTP && (
      <div className="flex justify-between">
        <span className="text-gray-600">Ride OTP</span>
        <span className="font-bold text-lg text-green-600">{bookingOTP}</span>
      </div>
    )}
  </div>
</div>
          
          {/* Assigned Rider Info */}
          {assignedRider && (
            <div className="bg-white rounded-lg p-4 mb-6">
              <h5 className="font-bold text-gray-800 mb-3">Your Rider</h5>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  {assignedRider.photo ? (
                    <img src={assignedRider.photo} alt={assignedRider.name} className="w-12 h-12 rounded-full" />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h6 className="font-bold">{assignedRider.name}</h6>
                  <p className="text-sm text-gray-600">Rating: {assignedRider.rating || 4.5} ★</p>
                </div>
                <div className="text-right">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Call Rider
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCancelBooking}
              className="flex-1 py-3 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Cancel Booking
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Progress Bar */}
{step < 4 && (
  <div className="mb-6 sm:mb-8">
    <div className="flex justify-between items-center mb-4">
      {['Location', 'Vehicle', 'Confirm', 'Status'].map((label, index) => (
        <div key={index} className="flex flex-col items-center w-1/4">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
            step > index + 1
              ? 'bg-green-600 text-white'
              : step === index + 1
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step > index + 1 ? (
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <span className="font-bold text-sm sm:text-base">{index + 1}</span>
            )}
          </div>
          <span className={`text-xs mt-1 sm:mt-2 text-center ${
            step >= index + 1 ? 'font-medium text-blue-600' : 'text-gray-500'
          }`}>
            {label}
          </span>
        </div>
      ))}
    </div>
    <div className="relative h-2 bg-gray-200 rounded-full">
      <div 
        className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-300"
        style={{ width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%' }}
      ></div>
    </div>
  </div>
)}

        {/* Main Form Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    {step === 4 ? 'Ride Status' : 'Book Your Ride'}
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">
                    {step === 1 ? 'Enter your trip details' : 
                     step === 2 ? 'Choose your vehicle' : 
                     step === 3 ? 'Select your cab' :
                     'Tracking your ride'}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <Car className="h-10 w-10 sm:h-12 sm:w-12 text-white/80" />
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-4 sm:p-6">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </div>

            {/* Help Section */}
            <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Need Help?</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Call our 24/7 customer support
                  </p>
                </div>
                <a 
                  href="tel:+919876543210"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  +91-9876543210
                </a>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
            <p>
              By proceeding, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
            <p className="mt-1 sm:mt-2">
              Your fare includes GST and may vary based on actual route
            </p>
          </div>
        </div>

        {/* Vehicle Selection Modal */}
        {showVehicleModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold">Select Vehicle Type</h3>
                <button 
                  onClick={() => setShowVehicleModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {vehicleOptions.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      vehicleType === vehicle.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                    onClick={() => {
                      setVehicleType(vehicle.id);
                      setShowVehicleModal(false);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl sm:text-3xl">{vehicle.icon}</span>
                      {vehicleType === vehicle.id && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <h4 className="font-bold text-lg mb-1">{vehicle.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{vehicle.capacity}</p>
                    <p className="text-sm text-gray-700 mb-3">{vehicle.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vehicle.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Base: ₹{vehicle.baseFare}</span>
                      <span className="text-lg font-bold text-blue-600 block">
                        ₹{vehicle.pricePerKm}/km
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Map Selection Modal - Updated to use Google Geocoding */}
        {showMapModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    Select {mapSelectingFor === 'pickup' ? 'Pickup' : 'Drop'} Location
                  </h3>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    Search for a location or click on the map
                  </p>
                </div>
                <button 
                  onClick={() => setShowMapModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for location..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {/* Current Location Button */}
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={mapLoading}
                  className="w-full mb-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {mapLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Navigation className="h-4 w-4 mr-2" />
                  )}
                  {mapLoading ? 'Getting Location...' : 'Use Current Location'}
                </button>
                
                {/* Map Container */}
                <div 
                  ref={mapRef}
                  id="map"
                  className="relative h-64 sm:h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden mb-4"
                  style={{ minHeight: '300px' }}
                >
                  {!mapLoaded ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                          <MapPin className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
                        </div>
                        <p className="text-gray-600 font-medium">Loading Map...</p>
                        <p className="text-sm text-gray-500 mt-1 sm:mt-2 max-w-md">
                          Please wait while we load the map
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full" id="google-map"></div>
                  )}
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Search Results:</h4>
                    <div className="space-y-2">
                      {searchResults.slice(0, 5).map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleMapLocationSelect(result)}
                          className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                        >
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-sm sm:text-base mb-1">{result.name}</h4>
                              <p className="text-xs text-gray-500">
                                Click to select
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Locations */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Common Locations:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'Delhi Airport', type: 'airport', coords: { lat: 28.5562, lng: 77.1000 } },
                      { name: 'Mumbai Airport', type: 'airport', coords: { lat: 19.0896, lng: 72.8656 } },
                      { name: 'Bangalore Airport', type: 'airport', coords: { lat: 13.1989, lng: 77.7068 } },
                      { name: 'New Delhi Railway Station', type: 'station', coords: { lat: 28.6423, lng: 77.2207 } },
                    ].map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleMapLocationSelect(location)}
                        className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            location.type === 'airport' ? 'bg-blue-100' :
                            location.type === 'station' ? 'bg-green-100' : 'bg-purple-100'
                          }`}>
                            <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 ${
                              location.type === 'airport' ? 'text-blue-600' :
                              location.type === 'station' ? 'text-green-600' : 'text-purple-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm sm:text-base mb-1">{location.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 capitalize">{location.type}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white border-t p-4">
                <button
                  onClick={() => setShowMapModal(false)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Use Selected Location
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {mapSelectingFor === 'pickup' ? pickupLocation.text : dropLocation.text || 'No location selected yet'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;