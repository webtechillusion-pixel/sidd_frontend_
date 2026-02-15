import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  Shield, 
  Award, 
  MapPin, 
  Car, 
  Globe, 
  Clock,
  TrendingUp,
  Heart,
  Star,
  Target
} from 'lucide-react';

const AboutUsPage = () => {
  const navigate = useNavigate();
  const values = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Safety First',
      description: 'Verified drivers, insured vehicles, and strict safety protocols ensure secure journeys for all our customers.'
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: 'Customer Focus',
      description: 'We prioritize customer satisfaction with 24/7 support, transparent pricing, and personalized services.'
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: 'Reliability',
      description: 'Punctual services, well-maintained vehicles, and dependable drivers you can count on every time.'
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: 'Excellence',
      description: 'Continuous improvement in services, technology, and customer experience drives everything we do.'
    }
  ];

  const milestones = [
    { year: '2015', title: 'Founded', description: 'Started with 5 vehicles in Delhi' },
    { year: '2017', title: 'Expansion', description: 'Expanded to 3 cities with 50+ vehicles' },
    { year: '2019', title: 'Digital Platform', description: 'Launched website and mobile app' },
    { year: '2021', title: 'Nationwide', description: 'Covered 50+ cities across India' },
    { year: '2023', title: '10K+ Customers', description: 'Served over 10,000 happy customers' },
  ];

  const team = [
    {
      name: 'Rahul Verma',
      role: 'Founder & CEO',
      experience: '15+ years in travel industry',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400',
      bio: 'Visionary leader with passion for revolutionizing travel experiences.'
    },
    {
      name: 'Priya Sharma',
      role: 'Operations Head',
      experience: '12+ years in logistics',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400',
      bio: 'Ensures seamless operations and customer satisfaction across all services.'
    },
    {
      name: 'Arjun Patel',
      role: 'Technology Director',
      experience: '10+ years in tech',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400',
      bio: 'Leads digital transformation and platform development.'
    },
    {
      name: 'Meera Reddy',
      role: 'Customer Success',
      experience: '8+ years in hospitality',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=400',
      bio: 'Dedicated to building lasting relationships with our customers.'
    }
  ];

  const achievements = [
    { number: '10,000+', label: 'Happy Customers', icon: <Users className="h-8 w-8" /> },
    { number: '500+', label: 'Verified Vehicles', icon: <Car className="h-8 w-8" /> },
    { number: '50+', label: 'Cities Covered', icon: <MapPin className="h-8 w-8" /> },
    { number: '25,000+', label: 'Successful Trips', icon: <Globe className="h-8 w-8" /> },
    { number: '4.8', label: 'Average Rating', icon: <Star className="h-8 w-8" /> },
    { number: '24/7', label: 'Customer Support', icon: <Clock className="h-8 w-8" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920")'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <span className="text-white text-sm font-medium">Since 2015</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our Journey of <span className="text-blue-300">Trust & Excellence</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              For nearly a decade, Siddharth Tour & Travel has been redefining travel experiences 
              across India with reliability, safety, and unmatched customer service.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to = "/services" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                Our Services
              </Link>
              <button onClick={() => navigate("/contact")}
               className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
                Meet Our Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2015 by Rahul Verma, Siddharth Tour & Travel began with a simple vision: 
                to make travel safe, reliable, and accessible for everyone. Starting with just 5 vehicles 
                in Delhi, we understood the challenges faced by travelers in finding trustworthy 
                transportation.
              </p>
              
              <p>
                Today, we've grown into one of the most trusted travel service providers in India, 
                serving thousands of customers across 50+ cities. Our journey has been fueled by 
                unwavering commitment to customer satisfaction and continuous innovation.
              </p>
              
              <p>
                We believe that every journey should be memorable for the right reasons. That's why 
                we've built a platform that connects travelers with verified drivers, transparent 
                pricing, and exceptional service.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-blue-100 rounded-2xl p-8 shadow-lg">
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800"
                  alt="Our Team"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-4">
                  To revolutionize travel experiences by providing safe, reliable, and comfortable 
                  transportation solutions that exceed customer expectations.
                </p>
                
                <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To become India's most trusted travel partner, setting new standards in customer 
                  service and technological innovation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every service we provide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Achievements
              </h2>
              <p className="text-blue-100">
                Numbers that reflect our commitment to excellence
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="text-white">
                      {achievement.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{achievement.number}</div>
                  <div className="text-blue-200 text-sm">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Milestones that mark our growth and success
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-blue-200"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{milestone.year}</div>
                        <div className="text-xs font-semibold text-gray-600 mt-1">{milestone.title}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <p className="text-gray-700">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals who drive our vision forward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <div className="text-blue-600 font-medium mb-2">{member.role}</div>
                  <div className="text-sm text-gray-500 mb-3">{member.experience}</div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200">
                        <span className="text-xs font-semibold">L</span>
                      </button>
                      <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200">
                        <span className="text-xs font-semibold">T</span>
                      </button>
                      <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200">
                        <span className="text-xs font-semibold">M</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Siddharth Tour & Travel?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what sets us apart from the competition
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                'Verified drivers with background checks',
                'Well-maintained and insured vehicles',
                'Transparent pricing with no hidden charges',
                '24/7 customer support',
                'Real-time booking and tracking',
                'Multiple vehicle options for every need'
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              {[
                'Instant booking confirmation',
                'Flexible cancellation policy',
                'Professional and trained drivers',
                'Clean and hygienic vehicles',
                'Corporate travel solutions',
                'Special packages for events and tours'
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Experience Premium Travel Services?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their travel needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/book")}
             className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Book Your Ride Now
            </button>
            <Link to = "/contact" className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;