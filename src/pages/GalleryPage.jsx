import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, X } from 'lucide-react';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1581798459218-842e8c8c7e17?auto=format&fit=crop&w=800', category: 'destinations', title: 'Mountain Getaway', location: 'Manali' },
    { id: 2, src: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&fit=crop&w=800', category: 'vehicles', title: 'Luxury Sedan', location: 'Delhi' },
    { id: 3, src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800', category: 'customers', title: 'Family Tour', location: 'Goa' },
    { id: 4, src: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=800', category: 'destinations', title: 'Desert Adventure', location: 'Jaisalmer' },
    { id: 5, src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800', category: 'vehicles', title: 'SUV Group Travel', location: 'Mumbai' },
    { id: 6, src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800', category: 'customers', title: 'Wedding Transport', location: 'Jaipur' },
    { id: 7, src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800', category: 'destinations', title: 'Coastal Drive', location: 'Kerala' },
    { id: 8, src: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800', category: 'vehicles', title: 'Corporate Fleet', location: 'Bangalore' },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'customers', label: 'Customers' },
  ];

  const filteredImages = activeCategory === 'all' ? galleryImages : galleryImages.filter(img => img.category === activeCategory);

  const testimonials = [
    { name: 'Rahul Sharma', trip: 'Delhi to Manali', rating: 5, comment: 'Excellent service! Comfortable journey.' },
    { name: 'Priya Patel', trip: 'Wedding Trip', rating: 5, comment: 'Beautiful cars and punctual service!' },
    { name: 'Amit Verma', trip: 'Corporate Travel', rating: 4, comment: 'Professional drivers and clean vehicles.' },
  ];

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Travel Gallery</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Explore moments from our journeys and see the experiences we've created
            </p>
            <button
              onClick={() => navigate('/book')}
              className="px-8 py-3 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg transition-colors"
            >
              Book Your Ride
            </button>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#fb8500] text-white shadow-lg'
                    : 'bg-gray-100 text-[#475569] hover:bg-[#8ecae6]/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#023047] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold text-lg">{image.title}</p>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {image.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#8ecae6]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">What Our Customers Say</h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              Real experiences from happy travelers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-[#fb8500] fill-[#fb8500]' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-[#475569] mb-4 text-sm italic">"{testimonial.comment}"</p>
                <div>
                  <p className="font-bold text-[#023047]">{testimonial.name}</p>
                  <p className="text-xs text-[#475569]">{testimonial.trip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">Ready to Create Your Memory?</h2>
            <p className="text-lg text-[#475569] mb-8">Book your ride now and start your journey</p>
            <button
              onClick={() => navigate('/book')}
              className="px-8 py-3 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg transition-colors"
            >
              Book Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-[#fb8500] transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full rounded-t-2xl"
              />
              <div className="bg-white rounded-b-2xl p-6">
                <h3 className="text-2xl font-bold text-[#023047] mb-2">{selectedImage.title}</h3>
                <p className="text-[#475569] flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#fb8500]" /> {selectedImage.location}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;