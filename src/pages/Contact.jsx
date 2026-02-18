import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-gray-50" data-testid="contact-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#023047] to-[#023047]/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch With Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              We're here to help you 24/7. Reach out through any channel.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact-form"
                className="px-6 py-3 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg transition-colors"
              >
                Send Message
              </a>
              <a
                href="tel:+919876543210"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#023047] transition-colors flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-[#8ecae6] rounded-xl flex items-center justify-center mb-3">
                  <div className="text-[#219ebc]">{info.icon}</div>
                </div>
                <h3 className="font-bold text-[#023047] mb-2">{info.title}</h3>
                <div className="space-y-0.5 mb-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-[#475569]">{detail}</p>
                  ))}
                </div>
                <p className="text-xs text-[#475569]">{info.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form + Right Column */}
      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              id="contact-form"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="h-6 w-6 text-[#219ebc]" />
                  <h2 className="text-2xl font-bold text-[#023047]">Send us a Message</h2>
                </div>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-[#fb8500]/10 border border-[#fb8500] rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#fb8500]" />
                      <span className="text-[#023047] font-medium">Message sent successfully!</span>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#023047] mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#023047] mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#023047] mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent"
                        placeholder="+91-9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#023047] mb-1">Purpose *</label>
                      <select
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent"
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
                    <label className="block text-sm font-medium text-[#023047] mb-1">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent"
                      placeholder="Subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#023047] mb-1">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#fb8500] hover:bg-[#ffb703] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : <><Send className="h-5 w-5" /> Send Message</>}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Right Column: Map + FAQ + Social */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-[#023047] mb-4">Find Us</h3>
                <div className="aspect-video bg-[#8ecae6]/10 rounded-xl flex items-center justify-center mb-3">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-[#fb8500] mx-auto mb-2" />
                    <p className="text-[#475569]">Map View</p>
                  </div>
                </div>
                <p className="text-sm text-[#475569]">Siddharth Tour & Travel, New Delhi, India</p>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className="h-6 w-6 text-[#219ebc]" />
                  <h3 className="text-xl font-bold text-[#023047]">FAQs</h3>
                </div>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <p className="font-medium text-[#023047] mb-1">How to book a ride?</p>
                    <p className="text-sm text-[#475569]">Book through website, app, or call us.</p>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <p className="font-medium text-[#023047] mb-1">Payment methods?</p>
                    <p className="text-sm text-[#475569]">Cards, UPI, Net Banking, Cash.</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#023047] mb-1">Cancellation policy?</p>
                    <p className="text-sm text-[#475569]">Free up to 2 hours before pickup.</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-gradient-to-br from-[#023047] to-[#023047]/90 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <div className="flex gap-3 mb-4">
                  {['FB', 'TW', 'IG', 'LI'].map((platform) => (
                    <button
                      key={platform}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold hover:bg-[#fb8500] hover:text-white transition-colors"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-300">Call for urgent: +91-9876543210</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;