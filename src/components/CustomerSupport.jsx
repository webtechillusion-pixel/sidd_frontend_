import React, { useState } from 'react';
import { HelpCircle, Phone, MessageSquare, AlertTriangle, Clock, CheckCircle, MapPin, CreditCard } from 'lucide-react';

const CustomerSupport = ({ onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: 1,
      issue: 'Driver not arrived',
      status: 'resolved',
      time: '2 hours ago',
      response: 'Issue resolved. Driver was stuck in traffic.'
    }
  ]);

  const issueTypes = [
    { id: 'driver_late', label: 'Driver is late', icon: Clock },
    { id: 'driver_not_found', label: 'Cannot find driver', icon: AlertTriangle },
    { id: 'wrong_location', label: 'Wrong pickup location', icon: MapPin },
    { id: 'payment_issue', label: 'Payment problem', icon: CreditCard },
    { id: 'safety_concern', label: 'Safety concern', icon: AlertTriangle },
    { id: 'other', label: 'Other issue', icon: HelpCircle }
  ];

  const handleSubmitTicket = () => {
    if (!selectedIssue || !message) return;
    
    const newTicket = {
      id: Date.now(),
      issue: issueTypes.find(t => t.id === selectedIssue)?.label,
      status: 'pending',
      time: 'Just now',
      message
    };
    
    setTickets([newTicket, ...tickets]);
    setSelectedIssue('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
              Customer Support
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Emergency Contact */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Help
            </h4>
            <p className="text-sm text-red-600 mb-3">
              For immediate assistance or safety concerns
            </p>
            <button
              onClick={() => window.location.href = 'tel:+911234567890'}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700"
            >
              <Phone className="h-4 w-4" />
              Call Emergency: +91 123 456 7890
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Quick Help</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => window.location.href = 'tel:+911800123456'}
                className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50"
              >
                <Phone className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <span className="text-sm">Call Support</span>
              </button>
              <button
                onClick={() => window.open('https://wa.me/911234567890', '_blank')}
                className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50"
              >
                <MessageSquare className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <span className="text-sm">WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Report Issue */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Report an Issue</h4>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's the problem?
              </label>
              <select
                value={selectedIssue}
                onChange={(e) => setSelectedIssue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select an issue</option>
                {issueTypes.map(issue => (
                  <option key={issue.id} value={issue.id}>
                    {issue.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the issue
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide more details..."
                className="w-full p-2 border border-gray-300 rounded-lg h-20 resize-none"
              />
            </div>

            <button
              onClick={handleSubmitTicket}
              disabled={!selectedIssue || !message}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Ticket
            </button>
          </div>

          {/* Previous Tickets */}
          {tickets.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Your Tickets</h4>
              <div className="space-y-3">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{ticket.issue}</span>
                      <div className="flex items-center">
                        {ticket.status === 'resolved' ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          ticket.status === 'resolved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{ticket.time}</p>
                    {ticket.response && (
                      <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                        {ticket.response}
                      </p>
                    )}
                    {ticket.message && (
                      <p className="text-sm text-gray-600 mt-2">
                        "{ticket.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;