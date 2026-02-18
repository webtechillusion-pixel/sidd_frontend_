import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Users,
  Star,
  Settings,
  Calendar,
  Shield,
  Luggage
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingWidget from './BookingWidget';

const AllVehicles = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [gridPage, setGridPage] = useState(1);
  const gridPageSize = 8; // Number of vehicles in the grid per page

  // Generate 300 sample vehicles (same as original)
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
        popular: i <= 30,
        basePrice: type.basePrice * 100,
        examples: [`${brand} ${model}`, `${brand} ${vehicleModels[(i+1)%10]}`, `${brand} ${vehicleModels[(i+2)%10]}`].slice(0,3)
      };
      vehicles.push(vehicle);
    }
    return vehicles;
  };

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    setVehicles(generateVehicles());
  }, []);

  // Get unique vehicle types for filter buttons
  const vehicleTypes = ['all', ...new Set(vehicles.map(v => v.typeId))];

  // Filter by selected type
  const filteredByType = filter === 'all'
    ? vehicles
    : vehicles.filter(v => v.typeId === filter);

  // Sort
  const sortedVehicles = [...filteredByType].sort((a, b) => {
    switch(sortBy) {
      case 'price_low': return a.pricePerKm - b.pricePerKm;
      case 'price_high': return b.pricePerKm - a.pricePerKm;
      case 'rating': return b.rating - a.rating;
      case 'capacity': return b.capacity - a.capacity;
      default: return b.popular - a.popular || b.rating - a.rating;
    }
  });

  // Featured vehicles (first two from sorted list)
  const featuredVehicles = sortedVehicles.slice(0, 2);
  // Remaining vehicles for grid
  const remainingVehicles = sortedVehicles.slice(2);

  // Pagination for grid
  const gridTotalPages = Math.ceil(remainingVehicles.length / gridPageSize);
  const gridStart = (gridPage - 1) * gridPageSize;
  const gridEnd = gridStart + gridPageSize;
  const currentGridVehicles = remainingVehicles.slice(gridStart, gridEnd);

  // Reset grid page when filter/sort changes
  useEffect(() => {
    setGridPage(1);
  }, [filter, sortBy]);

  const handleBook = (id) => {
    setSelectedVehicle(id);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#023047] to-[#023047]/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Fleet</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our wide range of well-maintained and comfortable vehicles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setFilter('all'); setGridPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#fb8500] text-white'
                    : 'bg-gray-100 text-[#475569] hover:bg-gray-200'
                }`}
              >
                All Vehicles
              </button>
              {vehicleTypes.filter(t => t !== 'all').map(typeId => {
                const typeName = vehicles.find(v => v.typeId === typeId)?.type || typeId;
                return (
                  <button
                    key={typeId}
                    onClick={() => { setFilter(typeId); setGridPage(1); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filter === typeId
                        ? 'bg-[#fb8500] text-white'
                        : 'bg-gray-100 text-[#475569] hover:bg-gray-200'
                    }`}
                  >
                    {typeName}
                  </button>
                );
              })}
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#475569]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fb8500]"
              >
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles + Booking Widget */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Featured Vehicle Cards (first two) */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#023047] mb-4">Featured Vehicles</h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key={filter + sortBy}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  {featuredVehicles.length > 0 ? (
                    featuredVehicles.map((vehicle, index) => (
                      <motion.div
                        key={vehicle.id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => setSelectedVehicle(vehicle.id)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                          {/* Image */}
                          <div className="aspect-video md:aspect-square overflow-hidden rounded-xl bg-[#8ecae6]/20 flex items-center justify-center">
                            {vehicle.image ? (
                              <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                            ) : (
                              <Car className="h-20 w-20 text-[#219ebc]" />
                            )}
                          </div>

                          {/* Details */}
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-2xl font-bold text-[#023047]">{vehicle.name}</h3>
                              {vehicle.popular && (
                                <span className="bg-[#fb8500] text-white text-xs px-3 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[#475569] mb-4 text-sm">{vehicle.type}</p>

                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-5 w-5 text-[#219ebc]" />
                                <span className="font-medium text-[#023047]">{vehicle.capacity} Passengers</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Luggage className="h-5 w-5 text-[#219ebc]" />
                                <span className="font-medium text-[#023047]">2-3 Luggage</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Star className="h-5 w-5 text-[#fb8500] fill-[#fb8500]" />
                                <span className="font-medium text-[#023047]">{vehicle.rating} Rating</span>
                              </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-[#475569]">Base Fare</span>
                                <span className="font-semibold text-[#023047]">₹{vehicle.basePrice}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-[#475569]">Per KM</span>
                                <span className="text-xl font-bold text-[#fb8500]">₹{vehicle.pricePerKm}</span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBook(vehicle.id);
                              }}
                              className="w-full mt-4 py-2.5 bg-[#219ebc] text-white font-semibold rounded-lg hover:bg-[#8ecae6] hover:text-[#023047] transition-colors"
                            >
                              Book {vehicle.name}
                            </button>
                          </div>
                        </div>

                        {/* Available Models */}
                        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                          <h4 className="font-semibold text-[#023047] mb-3">Available Models:</h4>
                          <div className="flex flex-wrap gap-2">
                            {vehicle.examples.map((model, idx) => (
                              <span key={idx} className="px-3 py-1 bg-white text-[#475569] text-sm rounded-full border border-gray-200">
                                {model}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                      <Car className="h-16 w-16 text-[#8ecae6] mx-auto mb-4" />
                      <p className="text-[#475569]">No featured vehicles match your filters.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Sticky Booking Widget */}
            <div className="lg:sticky lg:top-24 h-fit">
              <BookingWidget preselectedVehicle={selectedVehicle} />
            </div>
          </div>
        </div>
      </section>

      {/* All Vehicles Grid Section */}
      {remainingVehicles.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#023047] mb-8 text-center">All Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={filter + sortBy + gridPage}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="contents"
                >
                  {currentGridVehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => setSelectedVehicle(vehicle.id)}
                    >
                      <div className="aspect-video bg-[#8ecae6]/20 flex items-center justify-center p-4">
                        {vehicle.image ? (
                          <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                        ) : (
                          <Car className="h-12 w-12 text-[#219ebc]" />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-[#023047]">{vehicle.name}</h3>
                          {vehicle.popular && (
                            <span className="bg-[#fb8500] text-white text-xs px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#475569] mb-2">{vehicle.type}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4 text-[#219ebc]" />
                            <span className="text-[#023047]">{vehicle.capacity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-[#fb8500] fill-[#fb8500]" />
                            <span className="text-sm font-medium text-[#023047]">{vehicle.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm text-[#475569]">₹{vehicle.pricePerKm}/km</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBook(vehicle.id);
                            }}
                            className="px-3 py-1.5 bg-[#219ebc] text-white text-sm font-medium rounded-lg hover:bg-[#8ecae6] hover:text-[#023047] transition-colors"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Grid Pagination */}
            {gridTotalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
                <div className="text-sm text-[#475569]">
                  Showing {gridStart + 1} to {Math.min(gridEnd, remainingVehicles.length)} of {remainingVehicles.length} vehicles
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGridPage(p => Math.max(p-1, 1))}
                    disabled={gridPage === 1}
                    className={`px-4 py-2 rounded-lg border ${
                      gridPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#475569] hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-[#fb8500] text-white rounded-lg">
                    {gridPage}
                  </span>
                  <button
                    onClick={() => setGridPage(p => Math.min(p+1, gridTotalPages))}
                    disabled={gridPage === gridTotalPages}
                    className={`px-4 py-2 rounded-lg border ${
                      gridPage === gridTotalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#475569] hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* If no vehicles at all */}
      {sortedVehicles.length === 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Car className="h-20 w-20 text-[#8ecae6] mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-[#023047] mb-3">No Vehicles Found</h3>
            <p className="text-[#475569] mb-6">Try adjusting your filters.</p>
            <button
              onClick={() => { setFilter('all'); setSortBy('popular'); }}
              className="px-6 py-3 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default AllVehicles;