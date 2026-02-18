import React from 'react';
import { Phone, Car, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-5 md:p-8 text-white">
            <div className="text-center mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-400 text-sm">
                Book your ride now
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-5 md:mb-6">
              <button
                onClick={() => navigate('/book')}
                className="px-4 md:px-5 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition-colors"
              >
                Book Now
              </button>
              
              <button
                onClick={() => navigate('/rider/register')}
                className="px-4 md:px-5 py-2.5 border-2 border-yellow-500 text-yellow-500 rounded-lg font-medium text-sm hover:bg-yellow-500 hover:text-gray-900 transition-colors"
              >
                Become a Rider
              </button>
              
              <button 
                onClick={() => navigate('/services')}
                className="px-4 md:px-5 py-2.5 bg-gray-700 text-white rounded-lg font-medium text-sm hover:bg-gray-600 transition-colors"
              >
                Our Services
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <Phone className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                <p className="text-xs text-gray-400">+91-9876543210</p>
              </div>
              
              <div className="text-center">
                <Mail className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                <p className="text-xs text-gray-400">support@siddharthtravel.com</p>
              </div>
              
              <div className="text-center">
                <Car className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                <p className="text-xs text-gray-400">50+ Cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;