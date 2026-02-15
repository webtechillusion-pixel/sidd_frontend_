import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Users, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  List,
  Check,
  Star,
  Fuel,
  Settings,
  Calendar,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllVehicles = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage, setVehiclesPerPage] = useState(12);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    capacity: [],
    priceRange: [0, 100],
    features: []
  });
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate 300 sample vehicles (in real app, this would come from API)
  const generateVehicles = () => {
    const vehicleTypes = [
      { id: 'sedan', name: 'Sedan', capacity: 4, basePrice: 12 },
      { id: 'suv', name: 'SUV', capacity: 6, basePrice: 18 },
      { id: 'hatchback', name: 'Hatchback', capacity: 4, basePrice: 10 },
      { id: 'luxury', name: 'Luxury Car', capacity: 4, basePrice: 25 },
      { id: 'mini_bus', name: 'Mini Bus', capacity: 12, basePrice: 30 },
      { id: 'tempo_traveller', name: 'Tempo Traveller', capacity: 15, basePrice: 35 },
      { id: 'innova_crysta', name: 'Innova Crysta', capacity: 7, basePrice: 20 },
      { id: 'ertiga', name: 'Ertiga', capacity: 6, basePrice: 15 },
      { id: 'scorpio', name: 'Scorpio', capacity: 7, basePrice: 18 },
      { id: 'xuv700', name: 'XUV700', capacity: 7, basePrice: 22 }
    ];

    const vehicleBrands = ['Toyota', 'Hyundai', 'Maruti', 'Honda', 'Tata', 'Mahindra', 'Ford', 'Renault', 'Kia', 'MG'];
    const vehicleModels = ['Swift', 'Dzire', 'Alto', 'Baleno', 'WagonR', 'Creta', 'Venue', 'Seltos', 'Sonet', 'Nexon'];
    const features = ['AC', 'Music System', 'Bluetooth', 'GPS', 'Sunroof', 'Leather Seats', 'Reverse Camera', 'Airbags'];

    const vehicles = [];
    
    for (let i = 1; i <= 300; i++) {
      const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const brand = vehicleBrands[Math.floor(Math.random() * vehicleBrands.length)];
      const model = vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
      const randomFeatures = [...features].sort(() => 0.5 - Math.random()).slice(0, 4);
      
      const vehicle = {
        id: i,
        name: `${brand} ${model}`,
        type: type.name,
        typeId: type.id,
        capacity: type.capacity,
        registrationNumber: `MH${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}`,
        features: randomFeatures,
        pricePerKm: type.basePrice + Math.floor(Math.random() * 5),
        rating: (4 + Math.random()).toFixed(1),
        tripsCompleted: Math.floor(Math.random() * 500) + 50,
        available: Math.random() > 0.2,
        image: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=800&q=80`,
        popular: i <= 30 // First 30 are marked as popular
      };
      
      vehicles.push(vehicle);
    }
    
    return vehicles;
  };

  const [vehicles, setVehicles] = useState([]);
  
  useEffect(() => {
    // Disabled sample vehicle generation for production
    // setVehicles(generateVehicles());
    setVehicles([]);
  }, []);

  const vehicleTypes = [
    { id: 'sedan', name: 'Sedan', count: vehicles.filter(v => v.typeId === 'sedan').length },
    { id: 'suv', name: 'SUV', count: vehicles.filter(v => v.typeId === 'suv').length },
    { id: 'hatchback', name: 'Hatchback', count: vehicles.filter(v => v.typeId === 'hatchback').length },
    { id: 'luxury', name: 'Luxury', count: vehicles.filter(v => v.typeId === 'luxury').length },
    { id: 'mini_bus', name: 'Mini Bus', count: vehicles.filter(v => v.typeId === 'mini_bus').length },
    { id: 'tempo_traveller', name: 'Tempo Traveller', count: vehicles.filter(v => v.typeId === 'tempo_traveller').length }
  ];

  const capacityOptions = [
    { value: '2-4', label: '2-4 Passengers' },
    { value: '5-7', label: '5-7 Passengers' },
    { value: '8-12', label: '8-12 Passengers' },
    { value: '12+', label: '12+ Passengers' }
  ];

  const featuresOptions = [
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'music', label: 'Music System' },
    { value: 'gps', label: 'GPS Navigation' },
    { value: 'sunroof', label: 'Sunroof' },
    { value: 'leather', label: 'Leather Seats' },
    { value: 'camera', label: 'Reverse Camera' }
  ];

  // Filter vehicles based on selected filters and search
  const filteredVehicles = vehicles.filter(vehicle => {
    // Search filter
    if (searchQuery && !vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !vehicle.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (selectedFilters.type.length > 0 && !selectedFilters.type.includes(vehicle.typeId)) {
      return false;
    }
    
    // Capacity filter
    if (selectedFilters.capacity.length > 0) {
      let capacityMatch = false;
      selectedFilters.capacity.forEach(capacity => {
        const [min, max] = capacity.split('-').map(Number);
        if (vehicle.capacity >= min && vehicle.capacity <= max) {
          capacityMatch = true;
        }
      });
      if (!capacityMatch) return false;
    }
    
    // Price filter
    if (vehicle.pricePerKm < selectedFilters.priceRange[0] || vehicle.pricePerKm > selectedFilters.priceRange[1]) {
      return false;
    }
    
    // Features filter (vehicle must have all selected features)
    if (selectedFilters.features.length > 0) {
      const vehicleFeatures = vehicle.features.map(f => f.toLowerCase());
      if (!selectedFilters.features.every(feature => 
        vehicleFeatures.some(vf => vf.includes(feature))
      )) {
        return false;
      }
    }
    
    return true;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch(sortBy) {
      case 'price_low':
        return a.pricePerKm - b.pricePerKm;
      case 'price_high':
        return b.pricePerKm - a.pricePerKm;
      case 'rating':
        return b.rating - a.rating;
      case 'capacity':
        return b.capacity - a.capacity;
      default: // popular
        return b.popular - a.popular || b.rating - a.rating;
    }
  });

  // Pagination
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = sortedVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(sortedVehicles.length / vehiclesPerPage);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (filterType === 'type') {
        if (newFilters.type.includes(value)) {
          newFilters.type = newFilters.type.filter(t => t !== value);
        } else {
          newFilters.type = [...newFilters.type, value];
        }
      } else if (filterType === 'capacity') {
        if (newFilters.capacity.includes(value)) {
          newFilters.capacity = newFilters.capacity.filter(c => c !== value);
        } else {
          newFilters.capacity = [...newFilters.capacity, value];
        }
      } else if (filterType === 'features') {
        if (newFilters.features.includes(value)) {
          newFilters.features = newFilters.features.filter(f => f !== value);
        } else {
          newFilters.features = [...newFilters.features, value];
        }
      }
      setCurrentPage(1);
      return newFilters;
    });
  };

  const handlePriceRangeChange = (min, max) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
    setCurrentPage(1);
  };

  const handleVehiclesPerPageChange = (value) => {
    setVehiclesPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleBookVehicle = (vehicleId) => {
    // In real app, this would navigate to booking with vehicle pre-selected
    navigate('/book', { state: { vehicleId } });
  };

  const resetFilters = () => {
    setSelectedFilters({
      type: [],
      capacity: [],
      priceRange: [0, 100],
      features: []
    });
    setSearchQuery('');
    setSortBy('popular');
    setCurrentPage(1);
  };

  // Render Grid View
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentVehicles.map(vehicle => (
        <div key={vehicle.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
          <div className="relative h-48 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Car className="h-20 w-20 text-blue-400" />
            </div>
            {vehicle.popular && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
            )}
            {!vehicle.available && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">{vehicle.type}</p>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-semibold">{vehicle.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">{vehicle.capacity} seats</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">₹{vehicle.pricePerKm}/km</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {vehicle.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{vehicle.features.length - 3} more
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mb-4">
              Reg: {vehicle.registrationNumber} • {vehicle.tripsCompleted} trips
            </div>
            
            <button
              onClick={() => handleBookVehicle(vehicle.id)}
              disabled={!vehicle.available}
              className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                vehicle.available
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {vehicle.available ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Render List View
  const renderListView = () => (
    <div className="space-y-4">
      {currentVehicles.map(vehicle => (
        <div key={vehicle.id} className="bg-white rounded-xl shadow border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-48 md:h-32 h-48 mb-4 md:mb-0 rounded-lg overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Car className="h-16 w-16 text-blue-400" />
              </div>
            </div>
            
            <div className="md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-bold text-gray-900 text-xl mr-3">{vehicle.name}</h3>
                    {vehicle.popular && (
                      <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{vehicle.type} • Reg: {vehicle.registrationNumber}</p>
                </div>
                
                <div className="mt-2 md:mt-0 text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">₹{vehicle.pricePerKm}/km</div>
                  <div className="flex items-center justify-end">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-semibold">{vehicle.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">({vehicle.tripsCompleted} trips)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Capacity</div>
                    <div className="font-semibold">{vehicle.capacity} seats</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Trips</div>
                    <div className="font-semibold">{vehicle.tripsCompleted}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className={`font-semibold ${vehicle.available ? 'text-green-600' : 'text-red-600'}`}>
                      {vehicle.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Features</div>
                    <div className="font-semibold">{vehicle.features.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                  {vehicle.features.slice(0, 5).map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => handleBookVehicle(vehicle.id)}
                  disabled={!vehicle.available}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    vehicle.available
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {vehicle.available ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Our Complete Vehicle Fleet
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-3xl">
              Explore our extensive collection of {vehicles.length} well-maintained vehicles. 
              From economical sedans to spacious tempo travellers, find the perfect vehicle for your journey.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by vehicle name, type, or features..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              
              <button
                onClick={() => navigate('/book')}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Quick Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-700 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
              
              {/* Vehicle Type Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Vehicle Type</h4>
                <div className="space-y-2">
                  {vehicleTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => handleFilterChange('type', type.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                        selectedFilters.type.includes(type.id)
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        {selectedFilters.type.includes(type.id) && (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        <span>{type.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">({type.count})</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Capacity Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Passenger Capacity</h4>
                <div className="space-y-2">
                  {capacityOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange('capacity', option.value)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                        selectedFilters.capacity.includes(option.value)
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        {selectedFilters.capacity.includes(option.value) && (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Price Range: ₹{selectedFilters.priceRange[0]} - ₹{selectedFilters.priceRange[1]}/km
                </h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedFilters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), selectedFilters.priceRange[1])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedFilters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(selectedFilters.priceRange[0], parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </div>
              </div>
              
              {/* Features Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                <div className="space-y-2">
                  {featuresOptions.map(feature => (
                    <button
                      key={feature.value}
                      onClick={() => handleFilterChange('features', feature.value)}
                      className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                        selectedFilters.features.includes(feature.value)
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {selectedFilters.features.includes(feature.value) ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded mr-2"></div>
                      )}
                      <span>{feature.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Controls Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="text-gray-700 mr-4">
                    <span className="font-semibold">{filteredVehicles.length}</span> vehicles found
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Highest Rating</option>
                      <option value="capacity">Capacity</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-2">Show:</span>
                    <select
                      value={vehiclesPerPage}
                      onChange={(e) => handleVehiclesPerPageChange(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="12">12</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                      <option value="96">96</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Display */}
            {currentVehicles.length > 0 ? (
              <>
                {viewMode === 'grid' ? renderGridView() : renderListView()}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-gray-600">
                      Showing {indexOfFirstVehicle + 1} to {Math.min(indexOfLastVehicle, filteredVehicles.length)} of {filteredVehicles.length} vehicles
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <span className="text-gray-500">...</span>
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              className="w-10 h-10 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 flex items-center justify-center"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Car className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Vehicles Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  No vehicles match your current filters. Try adjusting your search criteria or resetting the filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllVehicles;