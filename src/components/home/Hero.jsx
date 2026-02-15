import React from 'react';
import { ChevronRight, Star, MapPin, Users, Car, Shield, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe & Secure",
      description: "Verified drivers and insured vehicles"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Available",
      description: "Book anytime, anywhere"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Transparent Pricing",
      description: "No hidden charges"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Wide Coverage",
      description: "50+ cities across India"
    }
  ];

  const handleBookRide = () => {
    navigate('/book'); // Redirect to booking page
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero_img.png"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-purple-900/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Main Content */}
          <div className="text-white">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <span className="text-sm font-semibold">SINCE 2015</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Your Journey, 
                <span className="block text-blue-300 mt-2">Our Responsibility</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-xl">
                Experience hassle-free travel with our premium cab services. 
                From city rides to outstation tours, we ensure comfort, safety, 
                and punctuality in every journey.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-10">
              <button 
                onClick={handleBookRide}
                className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full flex items-center space-x-3 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <span className="text-lg">Book Your Ride</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </button>
              <p className="text-sm text-gray-300 mt-4">
                Instant confirmation • Secure payment • 24/7 support
              </p>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">10K+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">4.8</div>
                <div className="text-sm text-gray-300">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">99%</div>
                <div className="text-sm text-gray-300">On-time Service</div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="text-blue-300 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Services Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-600/30 to-blue-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">One-Way Trips</h3>
            <p className="text-gray-300 mb-4">Travel between any two cities with fixed pricing</p>
            <button onClick={handleBookRide} className="text-blue-300 text-sm font-medium hover:text-blue-200">
              Book now →
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/30 to-purple-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">Round Trips</h3>
            <p className="text-gray-300 mb-4">Complete packages with return journey included</p>
            <button onClick={handleBookRide} className="text-purple-300 text-sm font-medium hover:text-purple-200">
              Book now →
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-600/30 to-indigo-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">Corporate Travel</h3>
            <p className="text-gray-300 mb-4">Business travel solutions with billing support</p>
            <button onClick={handleBookRide} className="text-indigo-300 text-sm font-medium hover:text-indigo-200">
              Book now →
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronRight className="h-8 w-8 text-white rotate-90" />
      </div>
    </section>
  );
};

export default Hero;