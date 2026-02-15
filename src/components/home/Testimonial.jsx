import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Business Executive, Delhi',
      text: 'Excellent service! The driver was punctual and professional. The car was clean and comfortable. Will definitely book again for my business trips.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200'
    },
    {
      name: 'Priya Patel',
      role: 'Family Traveler, Mumbai',
      text: 'Perfect for family trips! Spacious SUV with enough room for luggage. The round-trip package was great value for money. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200'
    },
    {
      name: 'Amit Verma',
      role: 'Corporate Client, Bangalore',
      text: 'Reliable service for our executive travels. The monthly billing system makes it convenient for our corporate accounts. Professional drivers every time.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w-200'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Hear from thousands of satisfied customers who trust us for their travel needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="absolute -top-4 left-8">
                  <Quote className="h-8 w-8 text-blue-200" />
                </div>
                
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-8 italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-blue-600 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;