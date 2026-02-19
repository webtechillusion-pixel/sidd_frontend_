import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin, Calendar, Car, ArrowRightLeft, Clock, MapPinned,
  Navigation, Loader2, X, Map, Users, Check, CreditCard, DollarSign,
  Shield, Phone, Star, User, Truck, Wind, CheckCircle, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import bookingService from '../../services/bookingService';
import api from '../../services/api';
import { toast } from 'react-toastify';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SERVICE_TYPES = [
  { id: 'OUTSTATION', label: 'Outstation', icon: '🗺️', description: 'Inter-city travel' },
  { id: 'LOCAL_RENTAL', label: 'Local Rental', icon: '🚗', description: 'Hourly/Daily rental' },
];

const TRIP_TYPES = [
  { id: 'ONE_WAY', label: 'One Way', icon: ArrowRightLeft },
  { id: 'ROUND_TRIP', label: 'Round Trip', icon: ArrowRightLeft },
];

const VEHICLES = [
  { id: 'sedan', name: 'Sedan', seats: '4 Seats', price: '₹12/km', icon: '🚗' },
  { id: 'suv', name: 'SUV', seats: '6-7 Seats', price: '₹18/km', icon: '🚙' },
  { id: 'luxury', name: 'Luxury', seats: '4 Seats', price: '₹25/km', icon: '🏎️' },
  { id: 'mini_bus', name: 'Mini Bus', seats: '12 Seats', price: '₹30/km', icon: '🚌' },
];

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

const BookingWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected, joinBookingRoom, joinUserRoom } = useSocket();

const [step, setStep] = useState(1); // 1: Location, 2: Vehicle, 3: Status
  const [serviceType, setServiceType] = useState('OUTSTATION');
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
  const [manualInput, setManualInput] = useState({ pickup: '', drop: '' });
  const [showSuggestions, setShowSuggestions] = useState({ pickup: false, drop: false });

  // Booking states
  const [tripType, setTripType] = useState('ONE_WAY');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [bookingType, setBookingType] = useState('IMMEDIATE');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [bookingOTP, setBookingOTP] = useState('');
  const [searchingRiders, setSearchingRiders] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [assignedRider, setAssignedRider] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('IDLE');
  const [nearbyCabs, setNearbyCabs] = useState([]);
  const [loadingCabs, setLoadingCabs] = useState(false);
  const [cabTypes, setCabTypes] = useState([]);

const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const didRedirectRef = useRef(false);
  const pickupMarkerRef = useRef(null);
  const dropMarkerRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // --- Get user location on mount ---
  useEffect(() => {
    const getUserLocation = async () => {
      if (!navigator.geolocation) return;
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
        });
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        if (address) {
          setPickupLocation({ text: address, lat: latitude, lng: longitude });
          setManualInput(prev => ({ ...prev, pickup: address }));
          
          // Check if user is from specific location (Bhaarta/Bharat)
          const locationLower = address.toLowerCase();
          const redirectCities = ['bhaarta', 'bharat', 'delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'pune', 'jaipur'];
          const isFromRedirectCity = redirectCities.some(city => locationLower.includes(city));
          
          if (isFromRedirectCity && user) {
            console.log('User from supported city:', address);
          }
        }
      } catch (error) {
        console.log('Unable to get user location:', error);
      }
    };
    getUserLocation();
  }, []);

  // --- Map functions ---
  useEffect(() => {
    if (showMapModal && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (showMapModal && window.google) {
      setMapLoaded(true);
      initializeMap();
    }
  }, [showMapModal]);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    let defaultCenter = { lat: 19.0760, lng: 72.8777 };
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          mapInstanceRef.current.setCenter({ lat: userLat, lng: userLng });
          mapInstanceRef.current.setZoom(14);
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
        },
        (error) => console.log('Geolocation error:', error)
      );
    }

    if (searchInputRef.current) {
      const options = { types: ['geocode', 'establishment'], componentRestrictions: { country: 'in' } };
      autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current, options);
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    }

    mapInstanceRef.current.addListener('click', async (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const address = await reverseGeocode(lat, lng);
      handleMapLocationSelect({ name: address || 'Selected Location', coords: { lat, lng }, type: 'map_click' });
    });
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      return data.results?.[0]?.formatted_address || null;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return null;
    }
  };

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      handleMapLocationSelect({
        name: place.name || place.formatted_address,
        coords: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
        type: 'selected'
      });
    }
  };

  const handleMapLocationSelect = (location) => {
    const addressText = location.name;
    const locationData = {
      text: addressText,
      lat: location.coords.lat,
      lng: location.coords.lng,
    };

    if (mapSelectingFor === 'pickup') {
      setPickupLocation(locationData);
      setManualInput({ ...manualInput, pickup: addressText });
    } else {
      setDropLocation(locationData);
      setManualInput({ ...manualInput, drop: addressText });
    }

    setShowMapModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setMapLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);
      handleMapLocationSelect({ name: address || 'Current Location', coords: { lat: latitude, lng: longitude } });
    } catch (error) {
      toast.error('Unable to get location');
    } finally {
      setMapLoading(false);
    }
  };

  const openMapModal = (field) => {
    setMapSelectingFor(field);
    setShowMapModal(true);
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleManualInput = (value, type) => {
    if (type === 'pickup') {
      setManualInput({ ...manualInput, pickup: value });
      if (!value) setPickupLocation({ text: '', lat: null, lng: null });
    } else {
      setManualInput({ ...manualInput, drop: value });
      if (!value) setDropLocation({ text: '', lat: null, lng: null });
    }
  };

  // --- Fare calculation ---
  useEffect(() => {
    const calculateFare = async () => {
      if (!pickupLocation.lat || !dropLocation.lat) return;
      try {
        const fareData = {
          pickupLat: pickupLocation.lat,
          pickupLng: pickupLocation.lng,
          dropLat: dropLocation.lat,
          dropLng: dropLocation.lng,
          cabType: vehicleType,
          vehicleType: vehicleType,
          passengers: passengers
        };
        const response = await bookingService.calculateFare(fareData);
        if (response.success) {
          setFareEstimate(response.data.estimatedFare);
          setFareDetails(response.data);
        } else {
          setFareEstimate(150);
          setFareDetails({ distance: 5.0, estimatedDuration: 15, breakdown: { baseFare: 50, distanceFare: 100 } });
        }
      } catch (error) {
        setFareEstimate(150);
        setFareDetails({ distance: 5.0, estimatedDuration: 15, breakdown: { baseFare: 50, distanceFare: 100 } });
      }
    };
    calculateFare();
  }, [pickupLocation, dropLocation, vehicleType, passengers]);

  // --- Nearby cabs (if needed) ---
  const fetchNearbyCabs = async () => {
    if (!pickupLocation.lat) return;
    setLoadingCabs(true);
    try {
      const response = await api.get(`/api/search/cabs/nearby?lat=${pickupLocation.lat}&lng=${pickupLocation.lng}&cabType=${vehicleType}`);
      if (response.data.success) {
        setNearbyCabs(response.data.data.availableCabs || []);
      }
    } catch (error) {
      console.error('Error fetching cabs:', error);
      setNearbyCabs([]);
    } finally {
      setLoadingCabs(false);
    }
  };

  const calculateFareForCab = (cab, distance) => {
    if (!distance) return 0;
    const baseFares = { HATCHBACK: 50, SEDAN: 60, SUV: 80, PREMIUM: 100 };
    const perKmRates = { HATCHBACK: 12, SEDAN: 14, SUV: 18, PREMIUM: 25 };
    const cabType = cab?.cab?.type || vehicleType;
    const baseFare = baseFares[cabType] || 60;
    const perKmRate = perKmRates[cabType] || 14;
    const surge = nearbyCabs.length < 3 ? 1.2 : 1;
    return Math.round((baseFare + distance * perKmRate) * surge);
  };

  // --- Polling fallback ---
  const startPolling = (id) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await bookingService.getBookingDetails(id);
        if (response?.success) {
          const booking = response.data;
          if (booking.bookingStatus !== currentStatus) {
            setCurrentStatus(booking.bookingStatus);
            if (booking.bookingStatus === 'DRIVER_ASSIGNED') {
              setAssignedRider(booking.rider);
              toast.success(`🚗 Rider assigned!`);
              if (searchTimeout) clearTimeout(searchTimeout);
            } else if (booking.bookingStatus === 'DRIVER_ARRIVED') {
              toast.info('Rider has arrived');
            } else if (booking.bookingStatus === 'TRIP_STARTED') {
              toast.info('Trip started');
            } else if (booking.bookingStatus === 'TRIP_COMPLETED') {
              toast.success('Trip completed!');
              setTimeout(() => resetBookingState(), 3000);
            } else if (booking.bookingStatus === 'CANCELLED') {
              toast.error('Booking cancelled');
              setTimeout(() => resetBookingState(), 3000);
            }
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // --- WebSocket listeners ---
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleRideAccepted = (data) => {
      console.log('📡 Ride accepted event received:', data);
      if (data.bookingId === bookingId) {
        setAssignedRider(data.rider);
        setCurrentStatus('DRIVER_ASSIGNED');
        toast.success(`🚗 Rider ${data.rider?.name || 'Driver'} accepted your ride!`);
        if (searchTimeout) clearTimeout(searchTimeout);
      }
    };
    const handleDriverArrived = (data) => {
      console.log('📡 Driver arrived event received:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('DRIVER_ARRIVED');
        toast.info('Rider has arrived');
      }
    };
    const handleTripStarted = (data) => {
      console.log('📡 Trip started event received:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('TRIP_STARTED');
        toast.info('Trip started');
      }
    };
    const handleTripCompleted = (data) => {
      console.log('📡 Trip completed event received:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('TRIP_COMPLETED');
        toast.success('Trip completed!');
        if (!didRedirectRef.current) {
          didRedirectRef.current = true;
          setTimeout(() => resetBookingState(), 3000);
        }
      }
    };
    const handleBookingCancelled = (data) => {
      console.log('📡 Booking cancelled event received:', data);
      if (data.bookingId === bookingId) {
        setCurrentStatus('CANCELLED');
        toast.error(data.reason || 'Booking cancelled');
        setTimeout(() => resetBookingState(), 3000);
      }
    };

    socket.on('ride-accepted', handleRideAccepted);
    socket.on('driver-arrived', handleDriverArrived);
    socket.on('trip-started', handleTripStarted);
    socket.on('trip-completed', handleTripCompleted);
    socket.on('booking-cancelled', handleBookingCancelled);

    if (bookingId) {
      console.log('🔗 Joining booking room:', bookingId);
      socket.emit('join-booking', bookingId);
      // Also start polling as fallback
      startPolling(bookingId);
    }

    if (user?._id && joinUserRoom) joinUserRoom(user._id);

    return () => {
      socket.off('ride-accepted', handleRideAccepted);
      socket.off('driver-arrived', handleDriverArrived);
      socket.off('trip-started', handleTripStarted);
      socket.off('trip-completed', handleTripCompleted);
      socket.off('booking-cancelled', handleBookingCancelled);
      if (bookingId) {
        socket.emit('leave-booking', bookingId);
      }
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [socket, isConnected, bookingId, searchTimeout, user?._id]);

  // --- Booking creation ---
  const handleCreateBooking = async () => {
    if (!pickupLocation.lat || !dropLocation.lat) {
      toast.error('Please select both pickup and drop locations');
      return;
    }
    if (bookingType === 'SCHEDULED' && (!scheduledDate || !scheduledTime)) {
      toast.error('Please select date and time for scheduled booking');
      return;
    }
    setLoading(true);
    try {
      const bookingData = {
        pickup: {
          addressText: pickupLocation.text,
          lat: pickupLocation.lat,
          lng: pickupLocation.lng,
          contactName: user?.name || 'Guest',
          contactPhone: user?.phone || '+919999999999'
        },
        drop: {
          addressText: dropLocation.text,
          lat: dropLocation.lat,
          lng: dropLocation.lng
        },
        vehicleType: vehicleType,
        paymentMethod: paymentMethod,
        passengers: passengers,
        tripType: tripType,
        bookingType: bookingType,
        ...(bookingType === 'SCHEDULED' && { scheduledAt: `${scheduledDate}T${scheduledTime}:00.000Z` })
      };

      const response = await bookingService.createBooking(bookingData);
      if (response.success) {
        const { bookingId: newBookingId, otp, estimatedFare, searchingRiders, scheduledAt } = response.data;
        setBookingId(newBookingId);
        setBookingOTP(otp);
        setSearchingRiders(searchingRiders || 0);
        setCurrentStatus('SEARCHING_DRIVER');
        setStep(3);

        if (paymentMethod === 'CASH') {
          toast.success(bookingType === 'IMMEDIATE' ? 'Booking created! Searching for riders...' : `Scheduled booking confirmed for ${new Date(scheduledAt).toLocaleString()}`);

          // Set a timeout to cancel if no rider accepts within 60 seconds
          if (bookingType === 'IMMEDIATE') {
            const timeout = setTimeout(() => {
              if (currentStatus === 'SEARCHING_DRIVER') {
                setCurrentStatus('CANCELLED');
                toast.error('No riders available');
                setTimeout(() => resetBookingState(), 3000);
              }
            }, 60000);
            setSearchTimeout(timeout);
          }

          // Emit booking created event to notify nearby riders
          if (socket && isConnected) {
            socket.emit('booking-created', {
              bookingId: newBookingId,
              pickup: pickupLocation,
              drop: dropLocation,
              vehicleType,
              estimatedFare
            });
          }
        } else {
          // Online payment – redirect to checkout
          sessionStorage.setItem('pendingBookingId', newBookingId);
          sessionStorage.setItem('pendingBookingData', JSON.stringify({
            bookingId: newBookingId, amount: estimatedFare, paymentMethod, bookingType, scheduledAt, vehicleType,
            pickup: pickupLocation.text, drop: dropLocation.text, otp, passengers, tripType
          }));
          navigate('/checkout', { state: {
            bookingId: newBookingId, amount: estimatedFare, paymentMethod, bookingType, scheduledAt, vehicleType,
            pickup: pickupLocation.text, drop: dropLocation.text, otp, passengers, tripType
          } });
          toast.success('Booking created! Redirecting to payment...');
        }
      } else {
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const resetBookingState = () => {
    setBookingId(null);
    setBookingOTP('');
    setSearchingRiders(0);
    setAssignedRider(null);
    setCurrentStatus('IDLE');
    setStep(1);
    if (searchTimeout) clearTimeout(searchTimeout);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    didRedirectRef.current = false;
  };

  const handleCancelBooking = async () => {
    if (!bookingId) return;
    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by user');
      resetBookingState();
      toast.info('Booking cancelled');
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

// --- Step 1: Trip details ---
  const renderStep1 = () => (
    <div className="space-y-4">
      {/* Service Type Selection */}
      <div className="grid grid-cols-2 gap-2">
        {SERVICE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setServiceType(type.id)}
            className={`py-2 px-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1 ${
              serviceType === type.id 
                ? 'bg-[#fb8500] text-white' 
                : 'bg-gray-100 text-[#023047] hover:bg-gray-200'
            }`}
          >
            <span>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TRIP_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setTripType(type.id)}
            className={`py-2 px-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1 ${
              tripType === type.id ? 'bg-[#fb8500] text-white' : 'bg-gray-100 text-[#023047] hover:bg-gray-200'
            }`}
          >
            <type.icon className="h-4 w-4" />
            {type.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-[#023047] mb-1">Pickup Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
          <input
            type="text"
            value={manualInput.pickup || pickupLocation.text}
            onChange={(e) => handleManualInput(e.target.value, 'pickup')}
            placeholder="Enter pickup location"
            className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="p-1 text-[#219ebc] hover:bg-[#8ecae6] rounded"
              title="Use current location"
            >
              <Navigation className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => openMapModal('pickup')}
              className="p-1 text-[#fb8500] hover:bg-[#ffb703] rounded"
              title="Select on map"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#023047] mb-1">Drop Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
          <input
            type="text"
            value={manualInput.drop || dropLocation.text}
            onChange={(e) => handleManualInput(e.target.value, 'drop')}
            placeholder="Enter drop location"
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500]"
          />
          <button
            type="button"
            onClick={() => openMapModal('drop')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#fb8500] hover:bg-[#ffb703] rounded"
            title="Select on map"
          >
            <Map className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#023047] mb-1">Passengers</label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
          <select
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-[#fb8500]"
          >
            {[1,2,3,4].map(num => <option key={num} value={num}>{num} Passenger{num>1?'s':''}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#023047] mb-1">Booking Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setBookingType('IMMEDIATE'); setScheduledDate(''); setScheduledTime(''); }}
            className={`py-2 px-2 rounded-lg text-xs font-medium ${
              bookingType === 'IMMEDIATE' ? 'bg-[#219ebc] text-white' : 'bg-gray-100 text-[#023047] hover:bg-gray-200'
            }`}
          >
            <Clock className="h-4 w-4 inline mr-1" /> Now
          </button>
          <button
            onClick={() => setBookingType('SCHEDULED')}
            className={`py-2 px-2 rounded-lg text-xs font-medium ${
              bookingType === 'SCHEDULED' ? 'bg-[#219ebc] text-white' : 'bg-gray-100 text-[#023047] hover:bg-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1" /> Schedule
          </button>
        </div>
      </div>

      {bookingType === 'SCHEDULED' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500]"
            />
          </div>
          <div>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500]"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-[#023047] mb-1">Payment</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod('CASH')}
            className={`py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
              paymentMethod === 'CASH' ? 'bg-[#fb8500] text-white' : 'bg-gray-100 text-[#023047] hover:bg-gray-200'
            }`}
          >
            <DollarSign className="h-4 w-4" /> Cash
          </button>
          <button
            onClick={() => setPaymentMethod('ONLINE')}
            className={`py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
              paymentMethod === 'ONLINE' ? 'bg-[#fb8500] text-white' : 'bg-gray-100 text-[#023047] hover:bg-gray-200'
            }`}
          >
            <CreditCard className="h-4 w-4" /> Online
          </button>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!pickupLocation.lat || !dropLocation.lat || (bookingType==='SCHEDULED' && (!scheduledDate||!scheduledTime))}
        className="w-full py-2.5 bg-[#219ebc] text-white font-semibold rounded-lg hover:bg-[#8ecae6] hover:text-[#023047] transition-colors text-sm disabled:opacity-50"
      >
        Continue → 
      </button>
    </div>
  );

  // --- Step 2: Vehicle selection ---
  const renderStep2 = () => {
    const selectedVehicle = vehicleOptions.find(v => v.id === vehicleType);
    return (
      <div className="space-y-4">
        <div className="p-3 border-2 border-[#fb8500] rounded-lg bg-[#ffb703]/10 cursor-pointer" onClick={() => setShowVehicleModal(true)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedVehicle?.icon}</span>
              <div>
                <h4 className="font-bold text-[#023047] text-sm">{selectedVehicle?.name}</h4>
                <p className="text-xs text-[#475569]">{selectedVehicle?.capacity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#fb8500]">₹{fareEstimate}</p>
              <p className="text-xs text-[#475569]">est. fare</p>
            </div>
          </div>
        </div>

        {fareDetails && (
          <div className="bg-[#8ecae6]/10 rounded-lg p-3">
            <div className="flex justify-between text-xs">
              <span className="text-[#475569]">Distance</span>
              <span className="font-medium text-[#023047]">{fareDetails.distance?.toFixed(1)} km</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-[#475569]">Duration</span>
              <span className="font-medium text-[#023047]">{fareDetails.estimatedDuration} min</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#475569]">Base Fare</span>
                <span className="font-medium text-[#023047]">₹{fareDetails.breakdown?.baseFare || 50}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#475569]">Distance Fare</span>
                <span className="font-medium text-[#023047]">₹{fareDetails.breakdown?.distanceFare || 100}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setStep(1)}
            className="py-2 border border-gray-300 text-[#475569] rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleCreateBooking}
            disabled={loading}
            className="py-2 bg-[#fb8500] text-white rounded-lg text-sm font-semibold hover:bg-[#ffb703] disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Book Now'}
          </button>
        </div>

        {showVehicleModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#023047]">Select Vehicle</h3>
                <button onClick={() => setShowVehicleModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 gap-3">
                {vehicleOptions.map(vehicle => (
                  <div
                    key={vehicle.id}
                    className={`p-3 border rounded-lg cursor-pointer ${vehicleType === vehicle.id ? 'border-[#fb8500] bg-[#ffb703]/10' : 'border-gray-200 hover:border-[#219ebc]'}`}
                    onClick={() => { setVehicleType(vehicle.id); setShowVehicleModal(false); }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{vehicle.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#023047]">{vehicle.name}</h4>
                        <p className="text-xs text-[#475569]">{vehicle.capacity}</p>
                        <p className="text-xs text-[#475569] mt-1">{vehicle.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {vehicle.features.map(f => <span key={f} className="px-2 py-0.5 bg-gray-100 text-xs rounded">{f}</span>)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#fb8500]">₹{vehicle.pricePerKm}/km</p>
                        <p className="text-xs text-[#475569]">Base ₹{vehicle.baseFare}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Step 3: Booking status with real-time updates ---
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-block p-3 bg-white rounded-full shadow-lg mb-3">
          {currentStatus === 'SEARCHING_DRIVER' ? (
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#fb8500]"></div>
          ) : currentStatus === 'DRIVER_ASSIGNED' ? (
            <CheckCircle className="h-10 w-10 text-green-600" />
          ) : currentStatus === 'DRIVER_ARRIVED' ? (
            <MapPin className="h-10 w-10 text-blue-600" />
          ) : currentStatus === 'TRIP_STARTED' ? (
            <Car className="h-10 w-10 text-[#fb8500]" />
          ) : currentStatus === 'TRIP_COMPLETED' ? (
            <CheckCircle className="h-10 w-10 text-green-600" />
          ) : currentStatus === 'CANCELLED' ? (
            <AlertCircle className="h-10 w-10 text-red-600" />
          ) : (
            <Car className="h-10 w-10 text-[#fb8500]" />
          )}
        </div>
        <h4 className="text-base font-bold text-[#023047] mb-1">
          {currentStatus === 'SEARCHING_DRIVER' && 'Searching for riders...'}
          {currentStatus === 'DRIVER_ASSIGNED' && 'Rider assigned!'}
          {currentStatus === 'DRIVER_ARRIVED' && 'Rider arrived'}
          {currentStatus === 'TRIP_STARTED' && 'Trip started'}
          {currentStatus === 'TRIP_COMPLETED' && 'Trip completed'}
          {currentStatus === 'CANCELLED' && 'Booking cancelled'}
        </h4>
        <p className="text-xs text-[#475569]">
          {currentStatus === 'SEARCHING_DRIVER' && `Searching ${searchingRiders || 10} nearby riders`}
          {currentStatus === 'DRIVER_ASSIGNED' && assignedRider && `${assignedRider.name} is on the way`}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-[#475569]">Booking ID</span>
          <span className="font-medium text-[#023047]">{bookingId || '---'}</span>
        </div>
        {bookingOTP && (
          <div className="flex justify-between">
            <span className="text-[#475569]">Ride OTP</span>
            <span className="font-bold text-lg text-[#fb8500]">{bookingOTP}</span>
          </div>
        )}
      </div>

      {assignedRider && (
        <div className="bg-white border rounded-lg p-3">
          <h5 className="font-bold text-[#023047] text-sm mb-2">Your Rider</h5>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#023047] text-sm">{assignedRider.name}</p>
              <p className="text-xs text-[#475569]">Rating: {assignedRider.rating || 4.5} ★</p>
            </div>
            <button className="px-3 py-1 bg-[#fb8500] text-white text-xs rounded-lg">Call</button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleCancelBooking}
          disabled={currentStatus === 'TRIP_COMPLETED' || currentStatus === 'CANCELLED'}
          className="flex-1 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={() => { resetBookingState(); setStep(1); }}
          className="flex-1 py-2 bg-[#219ebc] text-white rounded-lg text-sm font-medium hover:bg-[#8ecae6]"
        >
          New Booking
        </button>
      </div>
    </div>
  );

  // --- Main render ---
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl p-5 md:p-6">
      <h3 className="text-xl font-bold text-[#023047] mb-1">Book Your Ride</h3>
      <p className="text-sm text-gray-500 mb-4">Quick & easy booking</p>

      {/* Steps indicator */}
      {step < 3 && (
        <div className="flex justify-between mb-4">
          {[1,2].map(s => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= s ? 'bg-[#fb8500] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              {s === 1 && <div className={`flex-1 h-1 ${step > 1 ? 'bg-[#fb8500]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      )}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-semibold text-[#023047] text-sm">
                Select {mapSelectingFor === 'pickup' ? 'Pickup' : 'Destination'} Location
              </h3>
              <button onClick={closeMapModal} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 border-b bg-gray-50">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for a place..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500]"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div ref={mapRef} className="w-full h-64" />
            <div className="p-3 border-t">
              <button
                onClick={handleUseCurrentLocation}
                className="w-full py-2 bg-[#219ebc] text-white rounded-lg text-sm font-medium hover:bg-[#8ecae6] flex items-center justify-center gap-2"
              >
                <Navigation className="h-4 w-4" /> Use Current Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWidget;