import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul Sharma',
    location: 'Business Executive, Delhi',
    comment: 'Excellent service! The driver was punctual and professional. The car was clean and comfortable. Will definitely book again.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200'
  },
  {
    name: 'Priya Patel',
    location: 'Family Traveler, Mumbai',
    comment: 'Perfect for family trips! Spacious SUV with enough room for luggage. The round-trip package was great value. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200'
  },
  {
    name: 'Amit Verma',
    location: 'Corporate Client, Bangalore',
    comment: 'Reliable service for our executive travels. The monthly billing system makes it convenient. Professional drivers every time.',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200'
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-[#8ecae6]/10" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">What Our Customers Say</h2>
          <p className="text-lg text-[#475569]">Trusted by thousands of happy travelers</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-[#023047]">{testimonial.name}</h4>
                  <p className="text-sm text-[#475569]">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`${i < testimonial.rating ? 'text-[#fb8500] fill-[#fb8500]' : 'text-gray-300'}`}
                    size={16}
                  />
                ))}
              </div>
              <p className="text-[#475569] text-sm">{testimonial.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;