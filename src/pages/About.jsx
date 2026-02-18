import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  Shield,
  Clock,
  Star,
  MapPin,
  Car,
  Globe,
  Award
} from 'lucide-react';

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
    const numValue = parseInt(stringValue.replace(/[^0-9]/g, '')) || 0;
    if (numValue === 0) {
      setCount(0);
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
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const formatNumber = (num, suffix) => {
    if (!suffix || suffix === '24/7') {
      return suffix || '';
    }
    if (suffix === '+') {
      if (num >= 1000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K+';
      }
      return num + '+';
    }
    return num ? num.toString() : '0';
  };

  return <span ref={ref}>{formatNumber(count, suffix)}</span>;
};

const AboutUsPage = () => {
  const navigate = useNavigate();
  const values = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Safety First',
      description: 'Verified drivers and insured vehicles for secure journeys.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Customer Focus',
      description: '24/7 support and transparent pricing.'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Reliability',
      description: 'Punctual services you can count on.'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Excellence',
      description: 'Best-in-class travel experience.'
    }
  ];

  const milestones = [
    { year: '2015', title: 'Founded', description: 'Started with 5 vehicles' },
    { year: '2017', title: 'Expansion', description: 'Expanded to 3 cities' },
    { year: '2019', title: 'Digital', description: 'Launched website & app' },
    { year: '2021', title: 'Nationwide', description: '50+ cities covered' },
  ];

  const achievements = [
    { number: '10000', label: 'Customers', suffix: '+', icon: <Users className="h-5 w-5" /> },
    { number: '500', label: 'Vehicles', suffix: '+', icon: <Car className="h-5 w-5" /> },
    { number: '50', label: 'Cities', suffix: '+', icon: <MapPin className="h-5 w-5" /> },
    { number: '25000', label: 'Trips', suffix: '+', icon: <Globe className="h-5 w-5" /> },
    { number: '48', label: 'Rating', suffix: '', icon: <Star className="h-5 w-5" /> },
    { number: '0', label: 'Support', suffix: '24/7', icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920")'
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1.5 bg-yellow-500 rounded-full mb-4">
              <span className="text-gray-900 text-xs font-semibold">Since 2015</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Journey of <span className="text-yellow-400"> Trust & Excellence</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 mb-6">
              Siddharth Tour & Travel - Redefining travel experiences across India.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/services" className="px-5 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
                Our Services
              </Link>
              <button onClick={() => navigate("/contact")} className="px-5 py-2.5 border-2 border-yellow-500 text-yellow-500 rounded-lg font-medium text-sm hover:bg-yellow-500 hover:text-gray-900 transition">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            
            <div className="space-y-3 text-gray-600 text-sm md:text-base">
              <p>
                Founded in 2015, Siddharth Tour & Travel began with a vision to make travel safe, reliable, and accessible. Starting with just 5 vehicles in Delhi.
              </p>
              <p>
                Today, we serve thousands of customers across 50+ cities in India with verified drivers, transparent pricing, and exceptional service.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800"
                alt="Our Journey"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="font-bold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600">
              To provide safe, reliable, and comfortable transportation that exceeds customer expectations.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Us
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-yellow-400 transition">
                <div className="text-yellow-500 mb-2">
                  {value.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{value.title}</h3>
                <p className="text-xs text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements with Counter */}
        <div className="mb-10">
          <div className="bg-gray-900 rounded-xl p-6 md:p-8">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="text-gray-900">
                      {achievement.icon}
                    </div>
                  </div>
                  <div className="text-lg md:text-xl font-bold text-white">
                    <Counter value={achievement.value} suffix={achievement.suffix} />
                  </div>
                  <div className="text-xs text-gray-400">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Journey
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <div className="text-center">
                    <div className="text-sm md:text-base font-bold text-gray-900">{milestone.year}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900">{milestone.title}</div>
                <div className="text-xs text-gray-600">{milestone.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Ready to Travel?
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Book your ride now
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate("/book")} className="px-6 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
              Book Now
            </button>
            <Link to="/contact" className="px-6 py-2.5 border-2 border-gray-900 text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-900 hover:text-yellow-500 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
