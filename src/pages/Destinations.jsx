import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const Destinations = () => {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState('all');

  const destinations = [
    { id: 1, name: 'Manali', region: 'north', image: 'https://images.unsplash.com/photo-1581798459218-842e8c8c7e17?auto=format&fit=crop&w=800', rating: 4.8, price: '₹2500', desc: 'Hill station with snow mountains' },
    { id: 2, name: 'Goa', region: 'west', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800', rating: 4.7, price: '₹3000', desc: 'Beach paradise' },
    { id: 3, name: 'Shimla', region: 'north', image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=800', rating: 4.6, price: '₹2200', desc: 'Queen of Hills' },
    { id: 4, name: 'Jaipur', region: 'north', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800', rating: 4.9, price: '₹2800', desc: 'Pink City' },
    { id: 5, name: 'Kerala', region: 'south', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800', rating: 4.8, price: '₹3500', desc: 'Backwaters & beaches' },
    { id: 6, name: 'Delhi', region: 'north', image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800', rating: 4.5, price: '₹1500', desc: 'Capital city' },
    { id: 7, name: 'Mumbai', region: 'west', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=800', rating: 4.6, price: '₹1800', desc: 'City of dreams' },
    { id: 8, name: 'Bangalore', region: 'south', image: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?auto=format&fit=crop&w=800', rating: 4.7, price: '₹2000', desc: 'Silicon Valley of India' },
  ];

  const regions = [
    { id: 'all', label: 'All Destinations' },
    { id: 'north', label: 'North India' },
    { id: 'south', label: 'South India' },
    { id: 'west', label: 'West India' },
  ];

  const filteredDestinations = activeRegion === 'all' ? destinations : destinations.filter(d => d.region === activeRegion);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920")' }}>
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">Popular Destinations</h1>
          <p className="text-gray-300 text-sm md:text-base mb-5">Explore top destinations across India</p>
          <button onClick={() => navigate('/book')} className="px-5 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
            Book Your Trip
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {regions.map((r) => (
            <button key={r.id} onClick={() => setActiveRegion(r.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeRegion === r.id ? 'bg-yellow-500 text-gray-900' : 'bg-white text-gray-700 border border-gray-200'}`}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {filteredDestinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-yellow-400 transition">
              <div className="aspect-video overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {dest.rating}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{dest.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-yellow-600">{dest.price}</span>
                  <button onClick={() => navigate('/book')} className="text-xs text-gray-900 font-medium flex items-center gap-1 hover:text-yellow-600">
                    Book <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Routes */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { from: 'Delhi', to: 'Manali', price: '₹3500' },
              { from: 'Mumbai', to: 'Goa', price: '₹2800' },
              { from: 'Bangalore', to: 'Mysore', price: '₹1800' },
            ].map((route, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-2"><MapPin className="h-4 w-4 text-yellow-500" />{route.from} to {route.to}</p>
                  <p className="text-xs text-gray-500">One-way trip</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{route.price}</p>
                  <button onClick={() => navigate('/book')} className="text-xs text-yellow-600 font-medium">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-xl p-6 text-white text-center">
          <h2 className="text-lg font-bold mb-2">Plan Your Next Adventure</h2>
          <p className="text-gray-400 text-sm mb-4">Book your ride to any destination</p>
          <button onClick={() => navigate('/book')} className="px-6 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
