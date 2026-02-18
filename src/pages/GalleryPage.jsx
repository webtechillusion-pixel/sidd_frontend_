import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Heart,
  X
} from 'lucide-react';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1581798459218-842e8c8c7e17?auto=format&fit=crop&w=800', category: 'destinations', title: 'Mountain Getaway', location: 'Manali' },
    { id: 2, src: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&fit=crop&w=800', category: 'vehicles', title: 'Luxury Sedan', location: 'Delhi' },
    { id: 3, src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800', category: 'customers', title: 'Family Tour', location: 'Goa' },
    { id: 4, src: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=800', category: 'destinations', title: 'Desert Adventure', location: 'Jaisalmer' },
    { id: 5, src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800', category: 'vehicles', title: 'SUV Group Travel', location: 'Mumbai' },
    { id: 6, src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800', category: 'customers', title: 'Wedding Transport', location: 'Jaipur' },
    { id: 7, src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800', category: 'destinations', title: 'Coastal Drive', location: 'Kerala' },
    { id: 8, src: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800', category: 'vehicles', title: 'Corporate Fleet', location: 'Bangalore' },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'customers', label: 'Customers' },
  ];

  const filteredImages = activeCategory === 'all' ? galleryImages : galleryImages.filter(img => img.category === activeCategory);

  const testimonials = [
    { name: 'Rahul Sharma', trip: 'Delhi to Manali', rating: 5, comment: 'Excellent service! Comfortable journey.' },
    { name: 'Priya Patel', trip: 'Wedding Trip', rating: 5, comment: 'Beautiful cars and punctual service!' },
    { name: 'Amit Verma', trip: 'Corporate Travel', rating: 4, comment: 'Professional drivers and clean vehicles.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920")' }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            Travel Gallery
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-5">
            Explore moments from our journeys.
          </p>
          <button onClick={() => navigate('/book')} className="px-5 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
            Book Your Ride
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat.id ? 'bg-yellow-500 text-gray-900' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {filteredImages.map((image) => (
            <div 
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.src} alt={image.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <div className="text-white">
                  <p className="font-bold text-sm">{image.title}</p>
                  <p className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{image.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`h-3.5 w-3.5 ${j < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mb-2">"{t.comment}"</p>
                <p className="font-bold text-sm text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.trip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-xl p-6 text-white text-center">
          <h2 className="text-lg font-bold mb-2">Ready to Create Your Memory?</h2>
          <p className="text-gray-400 text-sm mb-4">Book your ride now</p>
          <button onClick={() => navigate('/book')} className="px-6 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
            Book Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-10 right-0 text-white"><X className="h-6 w-6" /></button>
            <img src={selectedImage.src} alt={selectedImage.title} className="w-full rounded-lg" />
            <div className="bg-white rounded-b-lg p-4 mt-0">
              <h3 className="font-bold text-gray-900">{selectedImage.title}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{selectedImage.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
