import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Repeat,
  Plane,
  Clock,
  Check,
  MapPin,
  Calendar,
  Car,
  Users,
  Shield,
  CreditCard,
  Globe
} from 'lucide-react';
import BookingWidget from '../components/home/BookingWidget'; // adjust path if needed

// Services data
const SERVICES = [
  {
    id: 'one-way',
    icon: 'ArrowRight',
    title: 'One-Way Trips',
    description: 'Point-to-point travel between cities with transparent pricing.',
    features: ['Any city pickup & drop', 'Transparent pricing', 'Instant booking', 'Multiple vehicles'],
    popular: true
  },
  {
    id: 'round-trip',
    icon: 'Repeat',
    title: 'Round-Trip Services',
    description: 'Complete packages with return journey included.',
    features: ['Return journey included', 'Multi-day packages', 'Driver accommodation', 'Custom itinerary'],
    popular: true
  },
  {
    id: 'airport-transfer',
    icon: 'Plane',
    title: 'Airport Transfers',
    description: 'Reliable airport pickups with flight tracking.',
    features: ['Flight tracking', 'Meet & greet', 'Free wait time', 'Luggage assistance'],
    popular: false
  },
  {
    id: 'corporate-travel',
    icon: 'Car',
    title: 'Corporate Travel',
    description: 'Professional solutions for businesses.',
    features: ['Monthly billing', 'Priority support', 'Dedicated manager', 'Usage reports'],
    popular: false
  },
  {
    id: 'wedding-transport',
    icon: 'Users',
    title: 'Wedding & Events',
    description: 'Special transport for weddings & parties.',
    features: ['Decorated vehicles', 'Multiple booking', 'Flexible hours', 'Professional drivers'],
    popular: false
  },
  {
    id: 'outstation-tours',
    icon: 'Globe',
    title: 'Outstation Tours',
    description: 'Multi-day tours with accommodation.',
    features: ['Accommodation booking', 'Sightseeing planning', 'Local guide', 'Meal arrangements'],
    popular: false
  },
];

// Icon mapping
const getIcon = (iconName) => {
  const icons = {
    ArrowRight,
    Repeat,
    Plane,
    Clock,
    MapPin,
    Calendar,
    Car,
    Users,
    Shield,
    CreditCard,
    Globe
  };
  return icons[iconName];
};

const ServicesPage = () => {
  const navigate = useNavigate();

  // Separate featured (first two) and remaining services
  const featuredServices = SERVICES.slice(0, 2);
  const moreServices = SERVICES.slice(2);

  const benefits = [
    { title: 'Best Prices', description: 'Competitive rates with no hidden charges. Get the best value for your money.' },
    { title: 'Verified Drivers', description: 'All drivers are verified with background checks and professional training.' },
    { title: 'Well-Maintained Fleet', description: 'Clean, comfortable, and regularly serviced vehicles for a smooth journey.' },
    { title: '24/7 Support', description: 'Our customer support team is always available to assist you.' },
    { title: 'Easy Booking', description: 'Book your cab in minutes with our simple and intuitive booking process.' },
    { title: 'Flexible Cancellation', description: 'Cancel your booking anytime with our flexible cancellation policy.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="services-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#023047] to-[#023047]/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tailored cab services for every travel need – from daily commutes to long-distance trips
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Services with Sticky Booking Widget */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left column: featured service cards */}
            <div className="space-y-8">
              {featuredServices.map((service, index) => {
                const Icon = getIcon(service.icon);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                    data-testid={`service-detail-${service.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-[#8ecae6] rounded-xl flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="text-[#219ebc]" size={32} />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-bold text-[#023047]">{service.title}</h3>
                          {service.popular && (
                            <span className="bg-[#fb8500] text-white text-xs px-3 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>

                        <p className="text-[#475569] mb-4 text-base">{service.description}</p>

                        <ul className="space-y-2 mb-4">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-[#475569] text-sm">
                              <Check className="text-[#fb8500]" size={18} />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => navigate('/book')}
                          className="inline-flex items-center gap-2 px-5 py-2 bg-[#219ebc] text-white font-semibold rounded-lg hover:bg-[#8ecae6] hover:text-[#023047] transition-colors text-sm"
                        >
                          Book Now <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right column: sticky booking widget */}
            <div className="lg:sticky lg:top-32 self-start">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                <BookingWidget />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Quick & easy booking • No hidden charges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Services Section - 4 cards per row on large screens */}
      <section className="py-20 bg-[#8ecae6]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">More Services</h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              Explore our additional offerings for your travel needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {moreServices.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#8ecae6] rounded-xl flex items-center justify-center">
                      {Icon && <Icon className="text-[#219ebc]" size={24} />}
                    </div>
                    <h3 className="text-xl font-bold text-[#023047]">{service.title}</h3>
                  </div>
                  <p className="text-[#475569] mb-4 text-sm">{service.description}</p>
                  <ul className="space-y-1 mb-4">
                    {service.features.slice(0, 2).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[#475569] text-xs">
                        <Check className="text-[#fb8500]" size={14} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/book')}
                    className="w-full py-2 bg-[#219ebc] text-white font-semibold rounded-lg hover:bg-[#8ecae6] hover:text-[#023047] transition-colors text-sm"
                  >
                    Book Now
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">Why Choose Us?</h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              Experience the difference with our commitment to quality and service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all text-center"
              >
                <h3 className="text-xl font-bold text-[#023047] mb-3">{benefit.title}</h3>
                <p className="text-[#475569] text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;