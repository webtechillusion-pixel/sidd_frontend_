import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Users, 
  Shield, 
  CreditCard, 
  Clock,
  CheckCircle,
  Globe,
  PhoneCall
} from 'lucide-react';

const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'one-way',
      title: 'One-Way Trips',
      description: 'Point-to-point travel between cities with transparent pricing.',
      features: ['Any city pickup & drop', 'Transparent pricing', 'Instant booking', 'Multiple vehicles'],
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-700',
      popular: true
    },
    {
      id: 'round-trip',
      title: 'Round-Trip Services',
      description: 'Complete packages with return journey included.',
      features: ['Return journey included', 'Multi-day packages', 'Driver accommodation', 'Custom itinerary'],
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-700',
      popular: true
    },
    {
      id: 'airport-transfer',
      title: 'Airport Transfers',
      description: 'Reliable airport pickups with flight tracking.',
      features: ['Flight tracking', 'Meet & greet', 'Free wait time', 'Luggage assistance'],
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'corporate-travel',
      title: 'Corporate Travel',
      description: 'Professional solutions for businesses.',
      features: ['Monthly billing', 'Priority support', 'Dedicated manager', 'Usage reports'],
      icon: <Car className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'wedding-transport',
      title: 'Wedding & Events',
      description: 'Special transport for weddings & parties.',
      features: ['Decorated vehicles', 'Multiple booking', 'Flexible hours', 'Professional drivers'],
      icon: <Users className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'outstation-tours',
      title: 'Outstation Tours',
      description: 'Multi-day tours with accommodation.',
      features: ['Accommodation booking', 'Sightseeing planning', 'Local guide', 'Meal arrangements'],
      icon: <Car className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-700'
    },
  ];

  const vehicleTypes = [
    { type: 'Sedan', capacity: '4 passengers', price: '₹12-15/km', popular: true },
    { type: 'SUV', capacity: '6-7 passengers', price: '₹18-22/km', popular: true },
    { type: 'Luxury', capacity: '4 passengers', price: '₹25-35/km', popular: false },
    { type: 'Hatchback', capacity: '4 passengers', price: '₹10-12/km', popular: false },
    { type: 'Mini Bus', capacity: '12-15 passengers', price: '₹30-40/km', popular: false },
    { type: 'Tempo Traveller', capacity: '12-18 passengers', price: '₹35-45/km', popular: false },
  ];

  const processSteps = [
    { step: 1, title: 'Search', description: 'Choose locations & date', icon: <MapPin className="h-5 w-5" /> },
    { step: 2, title: 'Book & Pay', description: 'Confirm with payment', icon: <CreditCard className="h-5 w-5" /> },
    { step: 3, title: 'Driver Assigned', description: 'Verified driver details', icon: <Shield className="h-5 w-5" /> },
    { step: 4, title: 'Enjoy Ride', description: 'Track & travel safely', icon: <Car className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              Premium Travel Services
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-5">
              Comprehensive transportation services for every need.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/book')} className="px-5 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
                Book Now
              </button>
              <a href="#vehicles" className="px-5 py-2.5 border-2 border-yellow-500 text-yellow-500 rounded-lg font-medium text-sm hover:bg-yellow-500 hover:text-gray-900 transition">
                View Vehicles
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-yellow-400 transition">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${service.color}`}>
                  {service.icon}
                </div>
                {service.popular && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                {service.title}
              </h3>
              
              <p className="text-xs text-gray-600 mb-3">
                {service.description}
              </p>
              
              <ul className="space-y-1 mb-3">
                {service.features.slice(2).map((feature, index) => (
                  <li key={index} className="flex items-center text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-yellow-500 mr-1" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button onClick={() => navigate('/book')} className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-yellow-500 hover:text-gray-900 transition">
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Features Highlight */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Shield className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-xs text-white font-medium">Safe & Secure</p>
            </div>
            <div className="text-center">
              <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-xs text-white font-medium">24/7 Available</p>
            </div>
            <div className="text-center">
              <CreditCard className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-xs text-white font-medium">Transparent Pricing</p>
            </div>
          </div>
        </div>

        {/* Vehicle Types */}
        <div id="vehicles" className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
            Our Vehicle Fleet
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicleTypes.map((vehicle, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{vehicle.type}</h3>
                    <p className="text-xs text-gray-500">{vehicle.capacity}</p>
                  </div>
                  {vehicle.popular && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-gray-900">{vehicle.price}</span>
                  <button onClick={() => navigate('/book')} className="px-3 py-1.5 bg-gray-900 text-white rounded text-xs font-medium hover:bg-yellow-500 hover:text-gray-900 transition">
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Process */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-gray-900">{step.step}</span>
                </div>
                <p className="text-xs font-bold text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 rounded-xl p-6 text-white">
          <h2 className="text-lg font-bold mb-3 text-center">
            Ready to Travel?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('/book')} className="px-5 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
              Book Now
            </button>
            <a href="tel:+919876543210" className="px-5 py-2 border-2 border-yellow-500 text-yellow-500 rounded-lg font-medium text-sm hover:bg-yellow-500 hover:text-gray-900 transition flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              Call Now
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-400">
            <span>10K+ Customers</span>
            <span>500+ Vehicles</span>
            <span>50+ Cities</span>
            <span>4.8 Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
