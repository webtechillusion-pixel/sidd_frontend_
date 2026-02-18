import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Car, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#023047] text-white" data-testid="cta-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Book your cab now and experience comfortable, affordable travel
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={scrollToBooking}
              className="px-8 py-4 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg transition-colors"
            >
              Book Your Ride Now
            </button>
            <button
              onClick={() => navigate('/rider/register')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#023047] transition-colors"
            >
              Become a Rider
            </button>
            <button
              onClick={() => navigate('/services')}
              className="px-8 py-4 bg-[#219ebc] hover:bg-[#8ecae6] text-white hover:text-[#023047] font-semibold rounded-lg transition-colors"
            >
              Our Services
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5 text-[#fb8500]" />
              <span className="text-sm">+91-9876543210</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-[#fb8500]" />
              <span className="text-sm">support@siddharthtravel.com</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Car className="h-5 w-5 text-[#fb8500]" />
              <span className="text-sm">50+ Cities</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;