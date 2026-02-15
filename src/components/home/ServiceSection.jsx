import React from 'react';
import { Car, MapPin, Calendar, Users, Building, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Car className="h-12 w-12" />,
      title: 'One-Way Trips',
      description: 'Point-to-point travel between any two cities with transparent pricing and instant booking.',
      features: ['Fixed pricing', 'Instant confirmation', 'Multiple vehicle options'],
      color: 'bg-blue-100 text-blue-600',
      route: '/book'
    },
    {
      icon: <Calendar className="h-12 w-12" />,
      title: 'Round Trips',
      description: 'Complete travel packages with return journey included. Perfect for weekend getaways.',
      features: ['Return journey included', 'Driver accommodation', 'Flexible itinerary'],
      color: 'bg-green-100 text-green-600',
      route: '/book'
    },
    {
      icon: <MapPin className="h-12 w-12" />,
      title: 'City Transfers',
      description: 'Reliable city-to-city transfers with experienced drivers and comfortable vehicles.',
      features: ['Inter-city travel', 'Multiple stops option', '24/7 availability'],
      color: 'bg-purple-100 text-purple-600',
      route: '/book'
    }
    ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            OUR SERVICES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Comprehensive Travel Solutions
          </h2>
          <p className="text-lg text-gray-600">
            From daily commutes to special occasions, we offer a wide range of travel services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-300"
            >
              <div className={`inline-flex p-3 rounded-lg mb-6 ${service.color}`}>
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => navigate(service.route)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
              >
                Learn More
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;