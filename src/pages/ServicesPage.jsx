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
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  PhoneCall,
  Headphones
} from 'lucide-react';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState('all');

  const services = [
    {
      id: 'one-way',
      title: 'One-Way Trips',
      description: 'Point-to-point travel services between any two cities with transparent pricing.',
      features: ['Any city pickup & drop', 'Transparent pricing', 'Instant booking', 'Multiple vehicle options'],
      icon: <MapPin className="h-10 w-10" />,
      color: 'bg-blue-100 text-blue-600',
      popular: true
    },
    {
      id: 'round-trip',
      title: 'Round-Trip Services',
      description: 'Complete travel packages with return journey included. Perfect for weekend getaways.',
      features: ['Return journey included', 'Multi-day packages', 'Driver accommodation', 'Customizable itinerary'],
      icon: <Calendar className="h-10 w-10" />,
      color: 'bg-green-100 text-green-600',
      popular: true
    },
    {
      id: 'airport-transfer',
      title: 'Airport Transfers',
      description: 'Reliable airport pickups and drops with flight tracking and wait time included.',
      features: ['Flight tracking', 'Meet & greet', 'Free wait time', 'Luggage assistance'],
      icon: <Globe className="h-10 w-10" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'corporate-travel',
      title: 'Corporate Travel',
      description: 'Professional travel solutions for businesses with billing and reporting features.',
      features: ['Monthly billing', 'Priority support', 'Dedicated account manager', 'Usage reports'],
      icon: <TrendingUp className="h-10 w-10" />,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'wedding-transport',
      title: 'Wedding & Events',
      description: 'Special transportation services for weddings, parties, and corporate events.',
      features: ['Decorated vehicles', 'Multiple vehicle booking', 'Flexible hours', 'Professional drivers'],
      icon: <Users className="h-10 w-10" />,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'outstation-trips',
      title: 'Outstation Tours',
      description: 'Multi-day tours with accommodation planning and sightseeing arrangements.',
      features: ['Accommodation booking', 'Sightseeing planning', 'Local guide services', 'Meal arrangements'],
      icon: <Car className="h-10 w-10" />,
      color: 'bg-orange-100 text-orange-600'
    },
  ];

  const vehicleTypes = [
    {
      type: 'Sedan',
      capacity: '4 passengers',
      description: 'Comfortable cars for small families or business trips',
      price: '₹12-15/km',
      popular: true
    },
    {
      type: 'SUV',
      capacity: '6-7 passengers',
      description: 'Spacious vehicles for groups or extra luggage',
      price: '₹18-22/km',
      popular: true
    },
    {
      type: 'Luxury',
      capacity: '4 passengers',
      description: 'Premium cars for special occasions or business travel',
      price: '₹25-35/km',
      popular: false
    },
    {
      type: 'Hatchback',
      capacity: '4 passengers',
      description: 'Economical option for city travel',
      price: '₹10-12/km',
      popular: false
    },
    {
      type: 'Mini Bus',
      capacity: '12-15 passengers',
      description: 'Ideal for large families or small groups',
      price: '₹30-40/km',
      popular: false
    },
    {
      type: 'Tempo Traveller',
      capacity: '12-18 passengers',
      description: 'Perfect for tours and group outings',
      price: '₹35-45/km',
      popular: false
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Search & Select',
      description: 'Choose your pickup, drop locations, date, and vehicle type',
      icon: <MapPin className="h-8 w-8" />
    },
    {
      step: 2,
      title: 'Book & Pay',
      description: 'Confirm booking with secure online payment',
      icon: <CreditCard className="h-8 w-8" />
    },
    {
      step: 3,
      title: 'Driver Assigned',
      description: 'Verified driver assigned with vehicle details',
      icon: <Shield className="h-8 w-8" />
    },
    {
      step: 4,
      title: 'Enjoy Your Ride',
      description: 'Track your ride and reach destination safely',
      icon: <Car className="h-8 w-8" />
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Premium Travel Services
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Experience seamless travel with our comprehensive range of transportation services. 
              From city rides to outstation tours, we've got you covered.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#booking-process" 
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                How It Works
              </a>
              <a 
                href="#vehicles" 
                className="px-6 py-3 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition"
              >
                View Vehicles
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from a wide range of travel services designed for every need and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border ${
                service.popular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${service.color}`}>
                  {service.icon}
                </div>
                {service.popular && (
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Features Highlight */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">Verified drivers and vehicles with insurance coverage</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
              <p className="text-gray-600">Book anytime, anywhere with instant confirmation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">No hidden charges with multiple payment options</p>
            </div>
          </div>
        </div>

        {/* Vehicle Types */}
        <div id="vehicles" className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Vehicle Fleet
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from a variety of well-maintained vehicles to suit your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicleTypes.map((vehicle, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {vehicle.type}
                    </h3>
                    <p className="text-gray-600 text-sm">{vehicle.capacity}</p>
                  </div>
                  {vehicle.popular && (
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4">
                  {vehicle.description}
                </p>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-blue-600">
                    {vehicle.price}
                  </span>
                  <button onClick={() => navigate("/book")}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

           <div className="text-center mt-12">
  <button 
    onClick={() => navigate('/fleet')}
    className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
  >
    View Complete Fleet
  </button>
</div>
        </div>

        {/* Booking Process */}
        <div id="booking-process" className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Book your ride in just 4 simple steps
            </p>
          </div>

          <div className="relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gray-200"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {processSteps.map((step) => (
                <div key={step.step} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center mb-4 relative z-10">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="text-blue-600">
                          {step.icon}
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Travel with Us?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of satisfied customers who trust Siddharth Tour & Travel for their journeys
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to = "/book" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                Book Your Ride Now
              </Link>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
                <PhoneCall className="inline-block h-5 w-5 mr-2" />
                Call: +91-9876543210
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-blue-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-200">Verified Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-200">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-blue-200">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "How do I book a ride?",
                a: "You can book through our website, mobile app, or by calling our customer support. Simply select your pickup and drop locations, choose vehicle type, and confirm booking."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards, UPI, net banking, and cash payments. Online payments are secured with SSL encryption."
              },
              {
                q: "Can I cancel my booking?",
                a: "Yes, you can cancel your booking up to 2 hours before the scheduled pickup time. Cancellation charges may apply based on timing."
              },
              {
                q: "Are your drivers verified?",
                a: "All our drivers undergo thorough background checks, document verification, and training before joining our platform."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;