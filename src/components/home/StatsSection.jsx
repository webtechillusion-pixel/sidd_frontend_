import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, MapPin, Award, Clock, Star } from 'lucide-react';

// Enhanced Counter that handles decimals and non-numeric values
const Counter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Handle non-numeric values (like '24/7')
    if (isNaN(parseFloat(value)) || value.includes('/')) {
      setCount(value);
      return;
    }

    // Parse numeric value including decimals
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  // Format the displayed number
  const formatNumber = (num) => {
    // If it's not a number (like '24/7'), return as is
    if (typeof num === 'string') return num;

    // Check if original value had decimals
    const originalString = String(value);
    if (originalString.includes('.')) {
      const decimals = originalString.split('.')[1].length;
      return num.toFixed(decimals);
    }

    // For integers over 1000, format with K
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }

    return Math.floor(num).toString();
  };

  return <span ref={ref}>{formatNumber(count)}{suffix}</span>;
};

const stats = [
  { icon: <Users className="h-5 w-5 md:h-6 md:w-6" />, value: '10000+', label: 'Happy Customers', suffix: '+' },
  { icon: <Car className="h-5 w-5 md:h-6 md:w-6" />, value: '500+', label: 'Verified Vehicles', suffix: '+' },
  { icon: <MapPin className="h-5 w-5 md:h-6 md:w-6" />, value: '50+', label: 'Cities Covered', suffix: '+' },
  { icon: <Award className="h-5 w-5 md:h-6 md:w-6" />, value: '25000+', label: 'Trips Completed', suffix: '+' },
  { icon: <Clock className="h-5 w-5 md:h-6 md:w-6" />, value: '24/7', label: 'Service Availability', suffix: '' },
  { icon: <Star className="h-5 w-5 md:h-6 md:w-6" />, value: '4.8', label: 'Average Rating', suffix: '' }
];

const StatsSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-16 md:py-20 bg-[#023047]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className="flex justify-center mb-3">
                <div className="bg-[#fb8500] p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold mb-1">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs md:text-sm font-medium text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default StatsSection;