import React from 'react';
import { Car, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Car className="h-6 w-6 md:h-8 md:w-8" />,
      title: 'One-Way Trips',
      description: 'Point-to-point travel between cities with transparent pricing.',
      features: ['Fixed pricing', 'Instant confirmation', 'Multiple vehicles'],
      color: 'bg-yellow-100 text-yellow-700',
      route: '/book'
    },
    {
      icon: <Calendar className="h-6 w-6 md:h-8 md:w-8" />,
      title: 'Round Trips',
      description: 'Complete packages with return journey included.',
      features: ['Return included', 'Driver accommodation', 'Flexible itinerary'],
      color: 'bg-yellow-100 text-yellow-700',
      route: '/book'
    },
    {
      icon: <MapPin className="h-6 w-6 md:h-8 md:w-8" />,
      title: 'City Transfers',
      description: 'Reliable city-to-city transfers with experienced drivers.',
      features: ['Inter-city travel', 'Multiple stops', '24/7 availability'],
      color: 'bg-yellow-100 text-yellow-700',
      route: '/book'
    }
    ];

  return (
    <section className="py-10 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold mb-3">
            OUR SERVICES
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Comprehensive Travel Solutions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 hover:shadow-md hover:border-yellow-400 transition-all duration-200"
            >
              <div className={`inline-flex p-2 rounded-lg mb-3 ${service.color}`}>
                {service.icon}
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3">
                {service.description}
              </p>
              
              <ul className="space-y-1 mb-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => navigate(service.route)}
                className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-yellow-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-1"
              >
                Book Now
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center px-5 py-2 border-2 border-gray-900 text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-900 hover:text-yellow-500 transition-colors"
          >
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;