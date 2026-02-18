import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Repeat, Plane, Clock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    id: 'oneway',
    icon: 'ArrowRight',
    title: 'One-Way Trips',
    description: 'Point-to-point travel between any two cities with transparent pricing.',
    features: ['Fixed pricing', 'Instant confirmation', 'Multiple vehicle options']
  },
  {
    id: 'roundtrip',
    icon: 'Repeat',
    title: 'Round Trips',
    description: 'Complete packages with return journey included. Perfect for weekend getaways.',
    features: ['Return journey included', 'Driver accommodation', 'Flexible itinerary']
  },
  {
    id: 'outstation',
    icon: 'Plane',
    title: 'Outstation Travel',
    description: 'Inter-city travel with experienced drivers and comfortable vehicles.',
    features: ['Long distance trips', 'Multiple stops', '24/7 availability']
  },
  {
    id: 'hourly',
    icon: 'Clock',
    title: 'Hourly Rentals',
    description: 'Local travel by the hour. Perfect for shopping, meetings, or sightseeing.',
    features: ['Flexible hours', 'Multiple pickups/drops', 'No hidden charges']
  }
];

const ServiceSection = () => {
  // Map icon names to components
  const getIcon = (iconName) => {
    const icons = {
      ArrowRight,
      Repeat,
      Plane,
      Clock
    };
    return icons[iconName];
  };

  return (
    <section className="py-20 bg-[#8ecae6]/10" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">
            Our Services
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Choose from our wide range of services tailored to your travel needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = getIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                data-testid={`service-card-${service.id}`}
              >
                <div className="w-12 h-12 bg-[#219ebc]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#219ebc]/20 transition">
                  {Icon && <Icon className="text-[#219ebc]" size={24} />}
                </div>

                <h3 className="text-xl font-bold text-[#023047] mb-2">
                  {service.title}
                </h3>

                <p className="text-[#475569] mb-4 text-sm">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-[#475569]"
                    >
                      <Check className="text-[#fb8500]" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#219ebc] text-white font-semibold rounded-lg hover:bg-[#8ecae6] hover:text-[#023047] transition-colors"
            data-testid="view-all-services-button"
          >
            View All Services
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;