import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const vehicles = [
  {
    id: 'sedan',
    name: 'Sedan',
    capacity: '4',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800',
    description: 'Perfect for daily commutes and airport transfers.',
    price: '₹12-15/km',
    popular: true
  },
  {
    id: 'suv',
    name: 'SUV',
    capacity: '6-7',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800',
    description: 'Spacious and comfortable for family trips.',
    price: '₹18-22/km',
    popular: true
  },
  {
    id: 'luxury',
    name: 'Luxury Car',
    capacity: '4',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800',
    description: 'Premium experience for special occasions.',
    price: '₹25-35/km',
    popular: false
  },
  {
    id: 'mini_bus',
    name: 'Mini Bus',
    capacity: '12',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800',
    description: 'Ideal for group outings and events.',
    price: '₹30-40/km',
    popular: false
  }
];

const VehicleFleet = () => {
  return (
    <section className="py-20 bg-white" data-testid="fleet-preview-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">Our Fleet</h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Choose from a wide range of well-maintained vehicles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              data-testid={`fleet-card-${vehicle.id}`}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#023047]">{vehicle.name}</h3>
                  {vehicle.popular && (
                    <span className="bg-[#fb8500] text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-[#475569] mb-4 text-sm">{vehicle.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-[#475569]">Capacity</span>
                  <span className="font-semibold text-[#023047]">{vehicle.capacity} persons</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#475569]">Fare</span>
                  <span className="text-lg font-bold text-[#fb8500]">{vehicle.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/fleet"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#219ebc] text-white font-semibold rounded-lg hover:bg-[#8ecae6] hover:text-[#023047] transition-colors"
            data-testid="view-fleet-button"
          >
            View All Vehicles <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VehicleFleet;