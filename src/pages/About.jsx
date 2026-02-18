import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Clock,
  Star,
  MapPin,
  Car,
  Globe,
  Award
} from 'lucide-react';

// Enhanced Counter that handles decimals and non-numeric strings
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

    const stringValue = String(value || '0');
    
    // Check if the string contains any non-numeric character (except '.')
    // If it does, treat as a static string (no animation)
    if (/[^0-9.]/.test(stringValue)) {
      setCount(stringValue);
      return;
    }

    // Parse numeric value (including decimals)
    const numValue = parseFloat(stringValue) || 0;
    if (numValue === 0) {
      setCount('0');
      return;
    }

    const duration = 2000;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const formatNumber = (num) => {
    // If it's a string (non-numeric), return as-is
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

const AboutUsPage = () => {
  const navigate = useNavigate();

  const coreValues = [
    {
      title: 'Safety First',
      description: 'All our drivers are verified with background checks and regular training on safety protocols.'
    },
    {
      title: 'Customer Satisfaction',
      description: 'We go above and beyond to ensure every journey is comfortable and meets your expectations.'
    },
    {
      title: 'Transparency',
      description: 'No hidden charges. What you see is what you pay. Simple and straightforward pricing.'
    }
  ];

  const milestones = [
    { year: '2015', title: 'Founded', description: 'Started with 5 vehicles' },
    { year: '2017', title: 'Expansion', description: 'Expanded to 3 cities' },
    { year: '2019', title: 'Digital', description: 'Launched website & app' },
    { year: '2021', title: 'Nationwide', description: '50+ cities covered' },
  ];

  const achievements = [
    { number: '10000', label: 'Customers', suffix: '+', icon: <Users className="h-6 w-6" /> },
    { number: '500', label: 'Vehicles', suffix: '+', icon: <Car className="h-6 w-6" /> },
    { number: '50', label: 'Cities', suffix: '+', icon: <MapPin className="h-6 w-6" /> },
    { number: '25000', label: 'Trips', suffix: '+', icon: <Globe className="h-6 w-6" /> },
    { number: '4.8', label: 'Rating', suffix: '', icon: <Star className="h-6 w-6" /> },
    { number: '24/7', label: 'Support', suffix: '', icon: <Clock className="h-6 w-6" /> }, // Fixed
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="about-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#023047] text-white py-20 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920")',
            opacity: 0.2
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center px-3 py-1.5 bg-[#fb8500] rounded-full mb-4">
              <span className="text-[#023047] text-xs font-semibold">Since 2015</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Our Journey of <span className="text-[#fb8500]">Trust & Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Siddharth Tour & Travel – Redefining travel experiences across India.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/services"
                className="px-6 py-3 bg-[#219ebc] text-white font-semibold rounded-lg hover:bg-[#8ecae6] hover:text-[#023047] transition-colors"
              >
                Our Services
              </Link>
              <button
                onClick={() => navigate("/contact")}
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#023047] transition-colors"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#023047] mb-6">Our Story</h2>
              <div className="space-y-4 text-[#475569]">
                <p>
                  Founded in 2015, Siddharth Tour & Travel began with a vision to make travel safe, reliable, and accessible. Starting with just 5 vehicles in Delhi.
                </p>
                <p>
                  Today, we serve thousands of customers across 50+ cities in India with verified drivers, transparent pricing, and exceptional service.
                </p>
                <p>
                  We believe in building long-term relationships with our customers by providing exceptional service, verified drivers, and well-maintained vehicles. Our commitment to safety and customer satisfaction has earned us a 4.8-star rating and over 10,000 happy customers.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800"
                alt="Our Journey"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-20 bg-[#8ecae6]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#023047] mb-4">Our Values</h2>
            <p className="text-lg text-[#475569]">What drives us every day</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all text-center"
              >
                <h3 className="text-2xl font-bold text-[#023047] mb-4">{value.title}</h3>
                <p className="text-[#475569]">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section - Light & Modern */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#023047] mb-4">Our Achievements</h2>
            <p className="text-lg text-[#475569]">Numbers that speak for themselves</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="w-14 h-14 bg-[#8ecae6]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <div className="text-[#219ebc]">{achievement.icon}</div>
                </div>
                <div className="text-xl md:text-2xl font-bold text-[#023047]">
                  <Counter value={achievement.number} suffix={achievement.suffix} />
                </div>
                <div className="text-xs md:text-sm text-[#475569] mt-1">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-16 md:py-20 bg-[#8ecae6]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#023047] mb-4">Our Journey</h2>
            <p className="text-lg text-[#475569]">Milestones along the way</p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#219ebc] -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-[#fb8500] rounded-full flex items-center justify-center mb-4 shadow-lg z-10 border-4 border-white">
                    <span className="text-white font-bold text-lg">{milestone.year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#023047] mb-1">{milestone.title}</h3>
                  <p className="text-sm text-[#475569]">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#023047] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Travel?</h2>
            <p className="text-lg text-gray-300 mb-8">Book your ride now and experience hassle-free travel</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate("/book")}
                className="px-8 py-3 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg transition-colors"
              >
                Book Now
              </button>
              <Link
                to="/contact"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#023047] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;