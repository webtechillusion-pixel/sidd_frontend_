import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, DollarSign, Award, Headphones, MapPin } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 md:h-7 md:w-7" />,
      title: 'Safe & Secure',
      description: 'Verified drivers with background checks and insured vehicles.'
    },
    {
      icon: <Clock className="h-6 w-6 md:h-7 md:w-7" />,
      title: '24/7 Service',
      description: 'Book anytime with instant confirmation and tracking.'
    },
    {
      icon: <DollarSign className="h-6 w-6 md:h-7 md:w-7" />,
      title: 'Transparent Pricing',
      description: 'No hidden charges. See exact fare before booking.'
    },
    {
      icon: <Award className="h-6 w-6 md:h-7 md:w-7" />,
      title: 'Verified Drivers',
      description: 'Professional drivers with excellent ratings.'
    },
    {
      icon: <Headphones className="h-6 w-6 md:h-7 md:w-7" />,
      title: '24/7 Support',
      description: 'Dedicated support team available round the clock.'
    },
    {
      icon: <MapPin className="h-6 w-6 md:h-7 md:w-7" />,
      title: 'Wide Coverage',
      description: 'Services in 50+ cities across India.'
    }
  ];

  return (
    <section className="py-20 bg-[#8ecae6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">Why Choose Us?</h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Experience travel excellence with our commitment to quality and service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#8ecae6] rounded-lg flex items-center justify-center mb-4">
                <div className="text-[#219ebc]">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-[#023047] mb-3">{feature.title}</h3>
              <p className="text-[#475569] mb-4">{feature.description}</p>
              <div className="pt-4 border-t border-gray-200">
                <a href="#" className="text-sm text-[#219ebc] hover:text-[#8ecae6] transition-colors font-medium">
                  Learn more →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;