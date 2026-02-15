import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare,
  Headphones,
  Building,
  Globe
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
      icon: <Phone className="h-8 w-8" />,
      title: 'Phone Numbers',
      details: [
        'Customer Support: +91-9876543210',
        'Vendor Support: +91-9876543211',
        'Emergency: +91-9876543212'
      ],
      description: 'Available 24/7 for your convenience'
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: 'Email Addresses',
      details: [
        'Support: support@siddharthtravel.com',
        'Bookings: bookings@siddharthtravel.com',
        'Vendors: vendor@siddharthtravel.com',
        'Corporate: corporate@siddharthtravel.com'
      ],
      description: 'Response within 2 hours'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Office Address',
      details: [
        'Siddharth Tour & Travel Pvt. Ltd.',
        '123 Travel Street, Connaught Place',
        'New Delhi - 110001',
        'India'
      ],
      description: 'Visit us between 9 AM - 7 PM'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Working Hours',
      details: [
        'Customer Support: 24/7',
        'Office Hours: 9:00 AM - 7:00 PM',
        'Weekends: 10:00 AM - 6:00 PM'
      ],
      description: 'Available for all your queries'
    }
  ];

  const faqs = [
    {
      question: 'How can I book a ride?',
      answer: 'You can book through our website, mobile app, or by calling our customer support number. Online booking is available 24/7.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and cash payments. Corporate accounts can avail monthly billing.'
    },
    {
      question: 'How can I become a vendor partner?',
      answer: 'Visit our "Become a Vendor" page or call our vendor support number. We have a simple registration and verification process.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellations are free up to 2 hours before scheduled pickup. Later cancellations may incur charges based on vehicle type.'
    }
  ];

  const purposes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking Assistance' },
    { value: 'vendor', label: 'Vendor Partnership' },
    { value: 'corporate', label: 'Corporate Services' },
    { value: 'complaint', label: 'Complaint/Feedback' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        purpose: 'general'
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch With Us
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Have questions, need assistance, or want to partner with us? We're here to help you 
              24/7. Reach out through any channel convenient for you.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact-form" 
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Send Message
              </a>
              <a 
                href="tel:+919876543210" 
                className="px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition flex items-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Contact Information */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose your preferred method of communication. We're always ready to assist you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{info.title}</h3>
                <div className="space-y-2 mb-4">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{info.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div id="contact-form">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Send us a Message
                </h2>
              </div>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">
                      Thank you! Your message has been sent successfully. We'll get back to you within 2 hours.
                    </span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91-9876543210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose *
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {purposes.map((purpose) => (
                        <option key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief subject of your query"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Building className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Find Us Here</h3>
                </div>
                
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                  {/* Replace with actual Google Maps embed */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <p className="text-blue-600 font-medium">Map View</p>
                      <p className="text-sm text-blue-500">123 Travel Street, Connaught Place</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">📍 <strong>Landmark:</strong> Near Central Park, Connaught Place</p>
                  <p className="mb-2">🚗 <strong>Parking:</strong> Available in basement parking</p>
                  <p>🚇 <strong>Nearest Metro:</strong> Rajiv Chowk Metro Station (5 min walk)</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center mb-6">
                <Headphones className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> For urgent matters, please call our 24/7 support line at{' '}
                  <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                    +91-9876543210
                  </a>
                </p>
              </div>
            </div>

            {/* Social & Other Contacts */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Globe className="h-8 w-8 text-white mr-3" />
                <h3 className="text-xl font-bold">Connect With Us</h3>
              </div>
              
              <p className="mb-6 text-blue-100">
                Follow us on social media for updates, offers, and travel tips
              </p>
              
              <div className="flex space-x-4 mb-6">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
                  <button
                    key={platform}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                  >
                    <span className="font-bold text-sm">{platform[0]}</span>
                  </button>
                ))}
              </div>
              
              <div className="text-sm text-blue-100">
                <p className="mb-2">📱 <strong>Mobile App:</strong> Available on iOS & Android</p>
                <p className="mb-2">📧 <strong>WhatsApp Business:</strong> +91-9876543213</p>
                <p>💬 <strong>Live Chat:</strong> Available on website during business hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Promise */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Response</h3>
              <p className="text-gray-600">We respond within 2 hours</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">We ensure your queries are resolved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;