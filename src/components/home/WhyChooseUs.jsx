import React from 'react';
import { Shield, Clock, DollarSign, Award, Headphones, MapPin } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Safe & Secure',
      description: 'Verified drivers with background checks and insured vehicles for your peace of mind.',
      bgColor: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Service',
      description: 'Book anytime, anywhere with instant confirmation and real-time tracking.',
      bgColor: 'bg-green-100 text-green-600'
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Transparent Pricing',
      description: 'No hidden charges. See the exact fare before booking with multiple payment options.',
      bgColor: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Verified Drivers',
      description: 'Professional, trained drivers with excellent ratings and clean records.',
      bgColor: 'bg-orange-100 text-orange-600'
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: '24/7 Support',
      description: 'Dedicated customer support team available round the clock for assistance.',
      bgColor: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Wide Coverage',
      description: 'Services available in 50+ cities across India with extensive route coverage.',
      bgColor: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Experience Travel Excellence
          </h2>
          <p className="text-lg text-gray-600">
            We go beyond transportation to deliver exceptional travel experiences with unmatched reliability.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start mb-6">
                <div className={`${feature.bgColor} p-3 rounded-lg`}>
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                  Learn more →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
            <div className="text-gray-700">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">4.8/5</div>
            <div className="text-gray-700">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">99%</div>
            <div className="text-gray-700">On-time Service</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;