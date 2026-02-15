// frontend/src/components/customer/HelpSupport.jsx - FINAL SIMPLE VERSION
import React from 'react';
import { ChevronRight, HelpCircle, Phone, BookOpen, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpSupport = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <ChevronRight className="h-5 w-5 rotate-180 mr-2" />
            Back to Dashboard
          </button>
          <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
          <p className="text-gray-600 text-sm">Get help with your rides and account</p>
        </div>
        <HelpCircle className="h-8 w-8 text-blue-600" />
      </div>

      {/* Contact Support */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-blue-600" />
            Contact Support
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">24/7 Customer Support</p>
              <p className="text-lg font-semibold text-gray-900">+91 1800 123 4567</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Support</p>
              <p className="text-lg font-semibold text-gray-900">support@mytravelride.com</p>
            </div>
            <p className="text-sm text-gray-600 pt-2 border-t border-blue-100">
              For account, booking, or payment issues, please contact us directly.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-8 border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <HelpCircle className="h-5 w-5 mr-2 text-green-600" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="font-medium text-gray-900 mb-2">How do I cancel a ride?</p>
            <p className="text-sm text-gray-600">Go to My Rides → Upcoming Rides → Select ride → Cancel. Free cancellation up to 30 minutes before pickup.</p>
          </div>
          <div className="border-b pb-4">
            <p className="font-medium text-gray-900 mb-2">How do I update my profile?</p>
            <p className="text-sm text-gray-600">Go to Settings → Personal Information → Update details → Save Changes.</p>
          </div>
          <div className="pb-4">
            <p className="font-medium text-gray-900 mb-2">What payment methods are accepted?</p>
            <p className="text-sm text-gray-600">We accept credit/debit cards, UPI, and cash payments. Wallet feature coming soon.</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => window.open('/safety', '_blank')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <BookOpen className="h-5 w-5 text-blue-600 mb-2" />
            <div className="font-medium">Safety Guidelines</div>
            <p className="text-sm text-gray-600">Learn about our safety measures</p>
          </button>
          
          <button 
            onClick={() => window.open('/terms', '_blank')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <FileText className="h-5 w-5 text-green-600 mb-2" />
            <div className="font-medium">Terms & Conditions</div>
            <p className="text-sm text-gray-600">Read our terms of service</p>
          </button>
          
          <button 
            onClick={() => window.open('/privacy', '_blank')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <Shield className="h-5 w-5 text-purple-600 mb-2" />
            <div className="font-medium">Privacy Policy</div>
            <p className="text-sm text-gray-600">How we protect your data</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;