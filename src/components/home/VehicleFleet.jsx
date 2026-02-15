import React, { useState } from 'react';
import { Car, Users, Fuel, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const VehicleFleet = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const vehicles = [
    {
      id: 'sedan',
      name: 'Sedan',
      capacity: '4 Passengers',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800',
      features: ['Air Conditioning', 'Spacious Boot', 'Comfort Seats', 'Music System'],
      price: '₹12-15/km',
      popular: true
    },
    {
      id: 'suv',
      name: 'SUV',
      capacity: '6-7 Passengers',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800',
      features: ['Extra Space', 'AC & Heating', 'Entertainment', 'Comfort Seats'],
      price: '₹18-22/km',
      popular: true
    },
    {
      id: 'luxury',
      name: 'Luxury Car',
      capacity: '4 Passengers',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800',
      features: ['Premium Interior', 'Chauffeur Service', 'WiFi', 'Refreshments'],
      price: '₹25-35/km',
      popular: false
    },
    {
      id: 'mini_bus',
      name: 'Mini Bus',
      capacity: '12 Passengers',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800',
      features: ['Ample Space', 'AC', 'Comfortable Seating', 'Luggage Rack'],
      price: '₹30-40/km',
      popular: false
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % vehicles.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            OUR FLEET
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Premium Vehicles for Every Journey
          </h2>
          <p className="text-lg text-gray-600">
            Choose from our well-maintained fleet of vehicles, each equipped for comfort and safety.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {vehicle.popular && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{vehicle.capacity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{vehicle.price}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {vehicle.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                 <Link 
    to="/book" 
    className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
  >
    Book This Vehicle
  </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/Tab Carousel */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-4 border border-gray-200">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                      {vehicle.popular && (
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Most Popular
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="text-sm">{vehicle.capacity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{vehicle.price}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {vehicle.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                       <Link 
    to="/book" 
    className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
  >
    Book This Vehicle
  </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-white"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {vehicles.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
  <button 
    onClick={() => navigate('/fleet')}
    className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
  >
    View Complete Fleet
  </button>
</div>
      </div>
    </section>
  );
};

export default VehicleFleet;