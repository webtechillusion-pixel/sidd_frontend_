import React from 'react';
import { Car, Users, MapPin, Award, Clock, Star } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: '10,000+',
      label: 'Happy Customers',
      description: 'Trusted by travelers across India'
    },
    {
      icon: <Car className="h-8 w-8" />,
      value: '500+',
      label: 'Verified Vehicles',
      description: 'Well-maintained fleet'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      value: '50+',
      label: 'Cities Covered',
      description: 'Nationwide service network'
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: '25,000+',
      label: 'Trips Completed',
      description: 'Successful journeys'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      value: '24/7',
      label: 'Service Availability',
      description: 'Round-the-clock support'
    },
    {
      icon: <Star className="h-8 w-8" />,
      value: '4.8',
      label: 'Average Rating',
      description: 'Customer satisfaction'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm font-semibold mb-1">{stat.label}</div>
              <div className="text-xs text-blue-100">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;