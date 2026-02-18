import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin, Calendar, Car, ArrowRightLeft, Clock, MapPinned,
  Navigation, Loader2, X, Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const TRIP_TYPES = [
  { id: 'oneway', label: 'One Way', icon: ArrowRightLeft },
  { id: 'roundtrip', label: 'Round Trip', icon: ArrowRightLeft },
  { id: 'outstation', label: 'Outstation', icon: MapPinned },
  { id: 'local', label: 'Local Rental', icon: Clock },
];

const VEHICLES = [
  { id: 'sedan', name: 'Sedan', seats: '4 Seats', price: '₹12/km', icon: '🚗' },
  { id: 'suv', name: 'SUV', seats: '6-7 Seats', price: '₹18/km', icon: '🚙' },
  { id: 'luxury', name: 'Luxury', seats: '4 Seats', price: '₹25/km', icon: '🏎️' },
  { id: 'mini_bus', name: 'Mini Bus', seats: '12 Seats', price: '₹30/km', icon: '🚌' },
];

const BookingWidget = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('oneway');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSelectingFor, setMapSelectingFor] = useState('pickup');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null, address: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    returnDate: '',
    hours: ''
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Map initialization (same as your original)
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
    }
  }, [showMapModal]);

  useEffect(() => {
    if (showMapModal && mapLoaded && mapRef.current && !markerRef.current) {
      const defaultCenter = { lat: 19.0760, lng: 72.8777 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        fullscreenControl: false,
        zoomControl: true,
      });
      map.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        if (markerRef.current) markerRef.current.setMap(null);
        const marker = new window.google.maps.Marker({ position: { lat, lng }, map, draggable: true });
        markerRef.current = marker;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setSelectedLocation({ lat, lng, address: results[0].formatted_address });
          } else {
            setSelectedLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
          }
        });
      });
    }
  }, [showMapModal, mapLoaded]);

  const openMapModal = (field) => {
    setMapSelectingFor(field);
    setSelectedLocation({ lat: null, lng: null, address: '' });
    setSearchQuery('');
    setSearchResults([]);
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    setShowMapModal(true);
  };

  const searchPlaces = (query) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === 'OK') {
        setSearchResults(results.slice(0, 5).map(r => ({
          description: r.formatted_address,
          place_id: r.place_id,
          lat: r.geometry.location.lat(),
          lng: r.geometry.location.lng()
        })));
      }
    });
  };

  const selectSearchResult = (place) => {
    if (!window.google) return;
    if (place.lat && place.lng) {
      setSelectedLocation({ lat: place.lat, lng: place.lng, address: place.description });
      setSearchResults([]);
      setSearchQuery('');
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        setSelectedLocation({
          lat: location.lat(),
          lng: location.lng(),
          address: results[0].formatted_address
        });
      } else {
        setSelectedLocation({ lat: null, lng: null, address: place.description });
      }
      setSearchResults([]);
      setSearchQuery(place.description);
    });
  };

  const confirmLocation = () => {
    if (selectedLocation.address) {
      setFormData(prev => ({ ...prev, [mapSelectingFor]: selectedLocation.address }));
      setShowMapModal(false);
    }
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setSearchQuery('');
    setSearchResults([]);
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setFormData(prev => ({ ...prev, pickup: results[0].formatted_address }));
            } else {
              setFormData(prev => ({ ...prev, pickup: 'Current Location' }));
            }
            setLoadingLocation(false);
          });
        } else {
          setFormData(prev => ({ ...prev, pickup: 'Current Location' }));
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter manually.');
        setLoadingLocation(false);
      }
    );
  };

  const handleFormSubmit = () => {
    if (!formData.pickup) {
      alert('Please enter pickup location');
      return;
    }
    if (tripType !== 'local' && !formData.destination) {
      alert('Please enter destination');
      return;
    }
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }
    const bookingData = {
      tripType,
      pickup: formData.pickup,
      destination: formData.destination,
      date: formData.date,
      time: formData.time,
      returnDate: formData.returnDate,
      hours: formData.hours,
      vehicle: selectedVehicle,
      fromHero: true
    };
    navigate('/book', { state: bookingData });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Render trip type toggle
  const renderTripTypeToggle = () => (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {TRIP_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => setTripType(type.id)}
          className={`py-2.5 px-2 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1 ${
            tripType === type.id
              ? 'bg-[#fb8500] text-white'
              : 'bg-gray-100 text-[#023047] hover:bg-gray-200'
          }`}
        >
          <type.icon className="h-4 w-4" />
          {type.label}
        </button>
      ))}
    </div>
  );

  // Render form fields
  const renderForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }} className="space-y-3">
      {/* Pickup */}
      <div>
        <label className="block text-xs font-medium text-[#023047] mb-1">
          {tripType === 'local' ? 'Pickup Location' : 'From City'}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
          <input
            type="text"
            name="pickup"
            value={formData.pickup}
            onChange={handleInputChange}
            placeholder={tripType === 'local' ? "Enter pickup location" : "Enter pickup city"}
            className="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500] focus:border-[#fb8500]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="p-1 text-[#219ebc] hover:bg-[#8ecae6] rounded"
              title="Use current location"
            >
              {loadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
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

      {/* Destination (if not local) */}
      {tripType !== 'local' && (
        <div>
          <label className="block text-xs font-medium text-[#023047] mb-1">To City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="Enter destination city"
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500] focus:border-[#fb8500]"
            />
            <button
              type="button"
              onClick={() => openMapModal('destination')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#fb8500] hover:bg-[#ffb703] rounded"
              title="Select on map"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Date/Time or Hours */}
      {tripType === 'local' ? (
        <div>
          <label className="block text-xs font-medium text-[#023047] mb-1">Rental Hours</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
            <select
              name="hours"
              value={formData.hours}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500] focus:border-[#fb8500]"
            >
              <option value="">Select hours</option>
              <option value="2">2 Hours</option>
              <option value="4">4 Hours</option>
              <option value="6">6 Hours</option>
              <option value="8">8 Hours</option>
              <option value="10">10 Hours</option>
              <option value="12">12 Hours</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#023047] mb-1">Pickup Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={getMinDate()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500] focus:border-[#fb8500]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#023047] mb-1">Pickup Time</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500] focus:border-[#fb8500]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Return date for round trips */}
      {tripType === 'roundtrip' && (
        <div>
          <label className="block text-xs font-medium text-[#023047] mb-1">Return Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ecae6]" />
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleInputChange}
              min={formData.date || getMinDate()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500] focus:border-[#fb8500]"
            />
          </div>
        </div>
      )}

      {/* Vehicle selection */}
      <div>
        <label className="block text-xs font-medium text-[#023047] mb-2">Select Vehicle</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VEHICLES.map((vehicle) => (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => setSelectedVehicle(vehicle)}
              className={`p-2 rounded-lg border-2 text-center transition-all ${
                selectedVehicle?.id === vehicle.id
                  ? 'border-[#fb8500] bg-[#ffb703]/10'
                  : 'border-gray-200 hover:border-[#219ebc]'
              }`}
            >
              <div className="text-lg mb-1">{vehicle.icon}</div>
              <div className="font-medium text-xs text-[#023047]">{vehicle.name}</div>
              <div className="text-xs text-gray-500">{vehicle.seats}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Car className="h-4 w-4" />
        Book Now
      </button>
    </form>
  );

  // Map modal (same as original, with updated colors)
  const renderMapModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h3 className="font-semibold text-[#023047] text-sm sm:text-base">
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
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 2) searchPlaces(e.target.value);
                else setSearchResults([]);
              }}
              placeholder="Search for a place..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#fb8500]"
              autoFocus
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg">
              {searchResults.map((place, index) => (
                <button
                  key={index}
                  onClick={() => selectSearchResult(place)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b last:border-b-0 flex items-start gap-2"
                >
                  <MapPin className="h-4 w-4 text-[#8ecae6] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{place.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div ref={mapRef} className="w-full h-48 sm:h-64" />
        {selectedLocation.address && (
          <div className="p-3 sm:p-4 border-t bg-gray-50">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              <span className="font-medium text-[#fb8500]">Selected:</span> {selectedLocation.address}
            </p>
            <button
              onClick={confirmLocation}
              className="w-full py-2.5 bg-[#fb8500] hover:bg-[#ffb703] text-white font-medium rounded-lg text-sm sm:text-base"
            >
              Confirm Location
            </button>
          </div>
        )}
        <div className="p-2 sm:p-3 text-xs text-gray-500 text-center bg-gray-50">
          💡 Tip: Search for a place OR click on the map to select
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {showMapModal && renderMapModal()}
      <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-6">
        <h3 className="text-xl font-bold text-[#023047] mb-1">Book Your Ride</h3>
        <p className="text-sm text-gray-500 mb-4">Quick & easy booking in seconds</p>
        {renderTripTypeToggle()}
        {renderForm()}
      </div>
    </div>
  );
};

export default BookingWidget;