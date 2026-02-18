import React from 'react';
import { Shield, Clock, DollarSign, Award, Headphones, MapPin } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 md:h-7 md:w-7" />,
      title: 'Safe & Secure',
      description: 'Verified drivers with background checks and insured vehicles.',
      bgColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      icon: <Clock className="h-6 w-6 md:h-7 md:w-7" />,
      title: '24/7 Service',
      description: 'Book anytime with instant confirmation and tracking.',
      bgColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      icon: <DollarSign className="h-6 w-6 md:h-7 md:w-7" />,
      title: 'Transparent Pricing',
      description: 'No hidden charges. See exact fare before booking.',
      bgColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      icon: <Award className="h-6 w-6 md:h-7 md:w-7" />,
      title: 'Verified Drivers',
      description: 'Professional drivers with excellent ratings.',
      bgColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      icon: <Headphones className="h-6 w-6 md:h-7 md:w-7" />,
      title: '24/7 Support',
      description: 'Dedicated support team available round the clock.',
      bgColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      icon: <MapPin className="h-6 w-6 md:h-7 md:w-7" />,
      title: 'Wide Coverage',
      description: 'Services in 50+ cities across India.',
      bgColor: 'bg-yellow-100 text-yellow-700'
    }
  ];

  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold mb-3">
            WHY CHOOSE US
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Experience Travel Excellence
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:border-yellow-400 transition-all duration-200"
            >
              <div className={`${feature.bgColor} p-2 rounded-lg w-fit mb-3`}>
                {feature.icon}
              </div>
              
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">
                {feature.title}
              </h3>
              
              <p className="text-xs text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-gray-900">10K+</div>
            <div className="text-xs text-gray-600">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-gray-900">99%</div>
            <div className="text-xs text-gray-600">On-time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;