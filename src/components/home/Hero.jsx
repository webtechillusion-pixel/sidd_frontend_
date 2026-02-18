import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import BookingWidget from './BookingWidget';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/30"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1498994014744-ad5b02e7bbed?auto=format&fit=crop&w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
      data-testid="hero-section"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#023047]/90 via-[#023047]/70 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight" data-testid="hero-title">
              Your Trusted
              <span className="text-[#fb8500] block">Travel Partner</span>
            </h1>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              Book comfortable and affordable cabs for outstation trips, airport transfers, and local rentals across India.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-[#fb8500]">10,000+</div>
                <div className="text-sm text-slate-200">Happy Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-[#fb8500]">4.8</div>
                <div className="text-sm text-slate-200">Average Rating</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToBooking}
                className="px-6 py-3 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg transition-colors"
              >
                Book Now
              </button>
              <Link
                to="/services"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#023047] transition-colors"
              >
                Our Services
              </Link>
            </div>
          </motion.div>

          {/* Booking Widget */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="booking"
          >
            <BookingWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;