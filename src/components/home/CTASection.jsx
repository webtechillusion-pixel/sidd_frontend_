import React from 'react';
import { Phone, Car, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-blue-100 text-lg">
                Join thousands of satisfied customers who trust Siddharth Tour & Travel
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <button
                onClick={() => navigate('/book')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex flex-col items-center"
              >
                <span className="text-lg mb-2">🚗</span>
                <span>Book Your Ride Now</span>
              </button>
              
              <button
                onClick={() => navigate('/rider/register')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex flex-col items-center"
              >
                <span className="text-lg mb-2">👨‍💼</span>
                <span>Become a Rider</span>
              </button>
              
              <button 
  onClick={() => navigate('/gallery')}
  className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex flex-col items-center"
>
  <span className="text-lg mb-2">📸</span>
  <span>Explore Gallery</span>
</button>
            </div>
            
            <div className="border-t border-blue-500 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Phone className="h-6 w-6 text-blue-300" />
                  </div>
                  <h4 className="font-semibold mb-2">Call Us Anytime</h4>
                  <p className="text-blue-200">+91-9876543210</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Mail className="h-6 w-6 text-blue-300" />
                  </div>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-blue-200">support@siddharthtravel.com</p>
                </div>
                
                 <button 
      onClick={() => navigate('/services')}
      className="text-center focus:outline-none hover:opacity-90 transition-opacity"
    >
      <div className="flex justify-center mb-3">
        <Car className="h-6 w-6 text-blue-300" />
      </div>
      <h4 className="font-semibold mb-2">Our Services</h4>
      <p className="text-blue-200">Explore all services</p>
    </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;