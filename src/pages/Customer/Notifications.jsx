// Replace the entire component with this simplified version
import React from 'react';
import { ChevronRight, Bell, Check, Mail, Phone } from 'lucide-react';

const Notifications = ({ onBack }) => {
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
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600 text-sm">Your notification center</p>
        </div>
        <Bell className="h-8 w-8 text-blue-600" />
      </div>

      {/* Notification Channels */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Notification Channels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-gray-600">All important notifications</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              All booking and account updates sent to your email
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">SMS</div>
                <div className="text-sm text-gray-600">Critical updates only</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              OTPs and critical alerts via SMS
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold">Push</div>
                <div className="text-sm text-gray-600">Real-time updates</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Real-time ride updates on your device
            </div>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Notification Settings</h4>
            <p className="text-blue-800 text-sm">
              Your notifications are automatically configured based on your account settings.
              You will receive emails for all booking confirmations, updates, and cancellations.
              SMS will be sent for OTP verification and critical alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Notifications Section */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Recent Notifications</h3>
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent notifications</p>
          <p className="text-sm text-gray-500 mt-2">
            Your notifications will appear here when you have active rides
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;