import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare,
  Headphones
} from 'lucide-react';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    purpose: 'general'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Phone',
      details: ['+91-9876543210', '+91-9876543211'],
      description: '24/7 Available'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email',
      details: ['support@siddharthtravel.com', 'bookings@siddharthtravel.com'],
      description: 'Reply in 2 hours'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Address',
      details: ['Siddharth Tour & Travel', 'New Delhi, India'],
      description: '9 AM - 7 PM'
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Hours',
      details: ['Support: 24/7', 'Office: 9AM-7PM'],
      description: 'Always here for you'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', purpose: 'general' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              Get in Touch With Us
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-5">
              We're here to help you 24/7. Reach out through any channel.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <a href="#contact-form" className="px-5 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-400 transition">
                Send Message
              </a>
              <a href="tel:+919876543210" className="px-5 py-2.5 border-2 border-yellow-500 text-yellow-500 rounded-lg font-medium text-sm hover:bg-yellow-500 hover:text-gray-900 transition flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Contact Information */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-yellow-400 transition">
                <div className="text-yellow-500 mb-2">
                  {info.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{info.title}</h3>
                <div className="space-y-0.5 mb-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-xs text-gray-700">{detail}</p>
                  ))}
                </div>
                <p className="text-xs text-gray-500">{info.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Contact Form */}
          <div id="contact-form">
            <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-lg font-bold text-gray-900">
                  Send us a Message
                </h2>
              </div>
              
              {submitted && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-yellow-700 text-sm">
                      Message sent successfully!
                    </span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="+91-9876543210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Purpose *</label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Assistance</option>
                      <option value="vendor">Vendor Partnership</option>
                      <option value="corporate">Corporate Services</option>
                      <option value="complaint">Complaint/Feedback</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Subject"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Your message..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-yellow-500 hover:text-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : <><Send className="h-4 w-4" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Find Us</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Map View</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Siddharth Tour & Travel, New Delhi, India</p>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center mb-3">
                <Headphones className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="font-bold text-gray-900 text-sm">FAQs</h3>
              </div>
              
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-2">
                  <p className="font-medium text-xs text-gray-900">How to book a ride?</p>
                  <p className="text-xs text-gray-600">Book through website, app, or call us.</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="font-medium text-xs text-gray-900">Payment methods?</p>
                  <p className="text-xs text-gray-600">Cards, UPI, Net Banking, Cash.</p>
                </div>
                <div>
                  <p className="font-medium text-xs text-gray-900">Cancellation policy?</p>
                  <p className="text-xs text-gray-600">Free up to 2 hours before pickup.</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-gray-900 rounded-xl p-4 text-white">
              <h3 className="font-bold text-sm mb-3">Connect With Us</h3>
              <div className="flex gap-2 mb-3">
                {['FB', 'TW', 'IG', 'LI'].map((platform) => (
                  <button key={platform} className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold hover:bg-yellow-500 hover:text-gray-900 transition">
                    {platform[0]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">Call for urgent: +91-9876543210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
