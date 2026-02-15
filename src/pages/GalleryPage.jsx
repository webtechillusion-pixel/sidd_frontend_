import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Car,
  Calendar,
  X
} from 'lucide-react';

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample gallery data - replace with your actual images
  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1581798459218-842e8c8c7e17?auto=format&fit=crop&w=800',
      category: 'destinations',
      title: 'Mountain Getaway',
      description: 'Beautiful mountain resort reached by our comfortable SUVs',
      location: 'Manali, Himachal',
      tags: ['mountain', 'family', 'suv']
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&fit=crop&w=800',
      category: 'vehicles',
      title: 'Luxury Sedan Fleet',
      description: 'Our premium luxury cars for special occasions',
      location: 'Delhi',
      tags: ['luxury', 'sedan', 'business']
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800',
      category: 'customers',
      title: 'Happy Family Tour',
      description: 'Family enjoying their vacation with our reliable service',
      location: 'Goa',
      tags: ['family', 'beach', 'tempo-traveller']
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=800',
      category: 'destinations',
      title: 'Desert Adventure',
      description: 'Exploring the Thar Desert with our 4x4 vehicles',
      location: 'Jaisalmer, Rajasthan',
      tags: ['desert', 'adventure', 'suv']
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800',
      category: 'vehicles',
      title: 'SUV for Group Travel',
      description: 'Spacious SUV perfect for group trips and family outings',
      location: 'Mumbai',
      tags: ['suv', 'group', 'family']
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800',
      category: 'customers',
      title: 'Wedding Transportation',
      description: 'Beautifully decorated cars for wedding celebrations',
      location: 'Jaipur',
      tags: ['wedding', 'luxury', 'special']
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800',
      category: 'destinations',
      title: 'Coastal Drive',
      description: 'Scenic coastal routes covered by our comfortable cars',
      location: 'Kerala Backwaters',
      tags: ['coastal', 'scenic', 'sedan']
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800',
      category: 'vehicles',
      title: 'Corporate Fleet',
      description: 'Professional vehicles for business travel',
      location: 'Bangalore',
      tags: ['corporate', 'business', 'professional']
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=800',
      category: 'customers',
      title: 'Airport Transfer',
      description: 'Happy customer with timely airport pickup',
      location: 'Delhi Airport',
      tags: ['airport', 'transfer', 'punctual']
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?auto=format&fit=crop&w=800',
      category: 'destinations',
      title: 'Hill Station Tour',
      description: 'Exploring beautiful hill stations with our reliable vehicles',
      location: 'Shimla',
      tags: ['hill-station', 'tour', 'group']
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800',
      category: 'vehicles',
      title: 'Mini Bus for Groups',
      description: 'Comfortable mini buses for large group travel',
      location: 'Hyderabad',
      tags: ['minibus', 'group', 'comfort']
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800',
      category: 'customers',
      title: 'Business Travel',
      description: 'Executive traveling for important business meetings',
      location: 'Gurgaon',
      tags: ['business', 'executive', 'luxury']
    },
  ];

  const categories = [
    { id: 'all', label: 'All Photos', count: galleryImages.length },
    { id: 'destinations', label: 'Destinations', count: galleryImages.filter(img => img.category === 'destinations').length },
    { id: 'vehicles', label: 'Our Vehicles', count: galleryImages.filter(img => img.category === 'vehicles').length },
    { id: 'customers', label: 'Happy Customers', count: galleryImages.filter(img => img.category === 'customers').length },
  ];

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  // Featured Testimonials
  const testimonials = [
    {
      name: 'Rahul Sharma',
      trip: 'Delhi to Manali Family Tour',
      rating: 5,
      comment: 'Excellent service! Comfortable journey with professional driver. Highly recommended!',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Priya Patel',
      trip: 'Wedding Transportation',
      rating: 5,
      comment: 'Beautifully decorated cars and punctual service made our wedding day perfect!',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Amit Verma',
      trip: 'Corporate Airport Transfers',
      rating: 4,
      comment: 'Reliable service for our executive travels. Professional drivers and clean vehicles.',
      image: 'https://randomuser.me/api/portraits/men/67.jpg'
    }
  ];

  const stats = [
    { label: 'Destinations Covered', value: '50+', icon: <MapPin className="h-6 w-6" /> },
    { label: 'Happy Customers', value: '10K+', icon: <Users className="h-6 w-6" /> },
    { label: 'Vehicles in Fleet', value: '500+', icon: <Car className="h-6 w-6" /> },
    { label: 'Trips Completed', value: '25K+', icon: <Calendar className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920")'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Travel Gallery
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Explore moments captured from our journeys, happy customers, and beautiful destinations we serve.
            </p>
            
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search destinations or experiences..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-blue-600 mr-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Browse Our Collection
            </h2>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Filter by:</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-4 py-2 rounded-full font-medium transition-colors
                  ${activeCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category.label}
                <span className="ml-2 text-xs opacity-80">
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredImages.map((image) => (
            <div 
              key={image.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                  <div className="flex items-center text-sm opacity-90 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {image.location}
                  </div>
                  <p className="text-sm opacity-80">{image.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {image.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  {image.category}
                </span>
              </div>
              
              {/* Favorite Button */}
              <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition">
                <Heart className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            What Our Customers Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.trip}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Section for Customers */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">
      Be Featured in Our Gallery!
    </h2>
    <p className="text-gray-600 mb-6">
      Share your travel photos from trips with us for a chance to be featured
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="text-center p-4">
        <div className="text-blue-600 font-bold text-2xl mb-2">1</div>
        <h4 className="font-semibold mb-1">Share on Social Media</h4>
        <p className="text-sm text-gray-600">Post your photos with #MyTravelRide</p>
      </div>
      <div className="text-center p-4">
        <div className="text-blue-600 font-bold text-2xl mb-2">2</div>
        <h4 className="font-semibold mb-1">Submit for Review</h4>
        <p className="text-sm text-gray-600">Fill our simple submission form</p>
      </div>
      <div className="text-center p-4">
        <div className="text-blue-600 font-bold text-2xl mb-2">3</div>
        <h4 className="font-semibold mb-1">Get Featured</h4>
        <p className="text-sm text-gray-600">Best photos appear in our gallery</p>
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        onClick={() => setShowSubmitForm(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Submit Your Photos
      </button>
      <button 
        onClick={() => setActiveCategory('community')}
        className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
      >
        View Community Gallery
      </button>
    </div>
  </div>
</div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            
            <div className="bg-white rounded-lg mt-4 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    {selectedImage.location}
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                  {selectedImage.category}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedImage.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {selectedImage.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 flex justify-between">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition">
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition">
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;