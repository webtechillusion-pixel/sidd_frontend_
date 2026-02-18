import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Business Executive, Delhi',
      text: 'Excellent service! The driver was punctual and professional. The car was clean and comfortable. Will definitely book again.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200'
    },
    {
      name: 'Priya Patel',
      role: 'Family Traveler, Mumbai',
      text: 'Perfect for family trips! Spacious SUV with enough room for luggage. The round-trip package was great value. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200'
    },
    {
      name: 'Amit Verma',
      role: 'Corporate Client, Bangalore',
      text: 'Reliable service for our executive travels. The monthly billing system makes it convenient. Professional drivers every time.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w-200'
    }
  ];

  return (
    <section className="py-10 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold mb-3">
            TESTIMONIALS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-3.5 w-3.5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              
              <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;