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
      features: ['AC', 'Spacious Boot', 'Comfort Seats', 'Music'],
      price: '₹12-15/km',
      popular: true
    },
    {
      id: 'suv',
      name: 'SUV',
      capacity: '6-7 Passengers',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800',
      features: ['Extra Space', 'AC', 'Entertainment', 'Comfort'],
      price: '₹18-22/km',
      popular: true
    },
    {
      id: 'luxury',
      name: 'Luxury Car',
      capacity: '4 Passengers',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800',
      features: ['Premium Interior', 'Chauffeur', 'WiFi', 'Refreshments'],
      price: '₹25-35/km',
      popular: false
    },
    {
      id: 'mini_bus',
      name: 'Mini Bus',
      capacity: '12 Passengers',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800',
      features: ['Ample Space', 'AC', 'Comfortable', 'Luggage'],
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
    <section className="py-10 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold mb-3">
            OUR FLEET
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Premium Vehicles for Every Journey
          </h2>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
              <div className="relative h-32 md:h-36 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                {vehicle.popular && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                )}
              </div>
              
              <div className="p-3 md:p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{vehicle.name}</h3>
                    <div className="flex items-center text-gray-500 mt-0.5">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="text-xs">{vehicle.capacity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm md:text-base font-bold text-gray-900">{vehicle.price}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {vehicle.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-yellow-500 rounded-full mr-1.5"></div>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
                
                 <Link 
    to="/book" 
    className="block w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-yellow-500 hover:text-gray-900 transition-colors text-center"
  >
    Book Now
  </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="w-full flex-shrink-0 px-2">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                      {vehicle.popular && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                          Popular
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{vehicle.name}</h3>
                          <div className="flex items-center text-gray-500 mt-0.5">
                            <Users className="h-3 w-3 mr-1" />
                            <span className="text-xs">{vehicle.capacity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-gray-900">{vehicle.price}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        {vehicle.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-xs text-gray-500">
                            <div className="w-1 h-1 bg-yellow-500 rounded-full mr-1"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                       <Link 
    to="/book" 
    className="block w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-yellow-500 hover:text-gray-900 transition-colors text-center"
  >
    Book Now
  </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-4 px-2">
            <button
              onClick={prevSlide}
              className="bg-white w-8 h-8 rounded-full shadow flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            
            <div className="flex gap-1.5">
              {vehicles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex ? 'bg-yellow-500 w-5' : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="bg-white w-8 h-8 rounded-full shadow flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
  <button 
    onClick={() => navigate('/fleet')}
    className="inline-flex items-center px-5 py-2 border-2 border-gray-900 text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-900 hover:text-yellow-500 transition-colors"
  >
    View Complete Fleet
  </button>
</div>
      </div>
    </section>
  );
};

export default VehicleFleet;