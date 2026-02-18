import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Car,
  Shield,
  Users,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Book Your Ride', path: '/book' },
  ];

  const services = [
    { label: 'One-Way Trips', path: '/services#one-way' },
    { label: 'Round Trips', path: '/services#round-trip' },
    { label: 'Corporate Travel', path: '/services#corporate' },
    { label: 'Airport Transfers', path: '/services#airport' },
    { label: 'Wedding Transportation', path: '/services#wedding' },
    { label: 'Outstation Tours', path: '/services#outstation' },
  ];

  const legal = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Refund Policy', path: '/refund' },
    { label: 'Rider Agreement', path: '/rider-agreement' },
    { label: 'Safety Guidelines', path: '/safety' },
    { label: 'FAQ', path: '/faq' },
  ];

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Call Us',
      value: '+91-9876543210',
      link: 'tel:+919876543210'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: 'support@siddharthtravel.com',
      link: 'mailto:support@siddharthtravel.com'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Office',
      value: '123 Travel Street, Delhi - 110001',
      link: 'https://maps.google.com'
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Hours',
      value: '24/7 Customer Support',
      link: null
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, label: 'Facebook', url: 'https://facebook.com' },
    { icon: <Twitter className="h-5 w-5" />, label: 'Twitter', url: 'https://twitter.com' },
    { icon: <Instagram className="h-5 w-5" />, label: 'Instagram', url: 'https://instagram.com' },
    { icon: <Linkedin className="h-5 w-5" />, label: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pariyatan</h2>
                <p className="text-sm text-gray-400">Since 2015</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Providing premium travel services across India with verified drivers, 
              comfortable vehicles, and transparent pricing.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-300 hover:text-white hover:translate-x-1 transition-all group"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700 inline-block">
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.path}
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start">
                  <div className="text-blue-400 mt-0.5 mr-3">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-medium">{info.label}</p>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-300">{info.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Newsletter Subscription */}
            {/* <div className="mt-8">
              <p className="font-medium mb-3">Subscribe to Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-lg font-semibold">Safe & Secure</div>
                <div className="text-sm text-gray-400">Verified Drivers</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-lg font-semibold">10,000+</div>
                <div className="text-sm text-gray-400">Happy Customers</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-orange-400" />
              <div>
                <div className="text-lg font-semibold">500+</div>
                <div className="text-sm text-gray-400">Verified Vehicles</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-lg font-semibold">24/7</div>
                <div className="text-sm text-gray-400">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Siddharth Tour & Travel Pvt. Ltd. All rights reserved.
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {legal.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm mr-2">We accept:</span>
              <div className="flex space-x-1">
                <div className="w-8 h-6 bg-gray-700 rounded-sm flex items-center justify-center text-xs font-bold">
                  💳
                </div>
                <div className="w-8 h-6 bg-gray-700 rounded-sm flex items-center justify-center text-xs font-bold">
                  UPI
                </div>
                <div className="w-8 h-6 bg-gray-700 rounded-sm flex items-center justify-center text-xs font-bold">
                  ₹
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg z-50 transition-all hover:scale-105"
        aria-label="Back to top"
      >
        <ArrowRight className="h-6 w-6 transform -rotate-90" />
      </button>
    </footer>
  );
};

export default Footer;