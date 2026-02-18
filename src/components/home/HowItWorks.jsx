import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, CreditCard, UserCheck, Car, ChevronRight } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: <Search className="h-6 w-6 md:h-7 md:w-7" />,
    title: "Search & Select",
    description: "Choose pickup, drop locations, date, and vehicle type.",
  },
  {
    number: "02",
    icon: <CreditCard className="h-6 w-6 md:h-7 md:w-7" />,
    title: "Book & Pay",
    description: "Confirm booking with secure payment or pay later.",
  },
  {
    number: "03",
    icon: <UserCheck className="h-6 w-6 md:h-7 md:w-7" />,
    title: "Driver Assigned",
    description: "Verified driver assigned with vehicle details.",
  },
  {
    number: "04",
    icon: <Car className="h-6 w-6 md:h-7 md:w-7" />,
    title: "Enjoy Ride",
    description: "Track your ride in real-time and travel safely.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#023047] mb-4">How It Works</h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Book your ride in four simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#8ecae6] -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-all z-10"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-[#8ecae6] rounded-xl flex items-center justify-center">
                    <div className="text-[#219ebc]">{step.icon}</div>
                  </div>
                </div>
                <div className="text-5xl font-bold text-[#fb8500] mb-3">{step.number}</div>
                <h3 className="text-xl font-bold text-[#023047] mb-2">{step.title}</h3>
                <p className="text-sm text-[#475569]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA - softened */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-[#8ecae6] rounded-2xl p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#023047] mb-3">Ready to Travel?</h3>
          <p className="text-[#023047]/80 mb-6">Book your ride now and experience hassle-free travel</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/book')}
              className="px-8 py-3 bg-[#fb8500] text-white font-semibold rounded-lg hover:bg-[#ffb703] transition-colors"
            >
              Book Now
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 border-2 border-[#023047] text-[#023047] font-semibold rounded-lg hover:bg-[#023047] hover:text-white transition-colors"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;