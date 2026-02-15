import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, History, Navigation, Map, Package, Shield } from 'lucide-react';

const QuickActions = ({ userData }) => {
  const navigate = useNavigate();
  
  const quickActions = [
    { id: 'book', title: 'Book New Ride', icon: Car, color: 'bg-blue-500', link: '/book' },
    { id: 'repeat', title: 'Repeat Last Ride', icon: History, color: 'bg-green-500', action: () => {
      const lastRide = localStorage.getItem('lastRide');
      if (lastRide) {
        navigate('/book', { state: JSON.parse(lastRide) });
      } else {
        alert('No recent ride found. Book a new ride.');
      }
    }},
    { id: 'airport', title: 'Airport Transfer', icon: Navigation, color: 'bg-purple-500', link: '/book?type=airport' },
    { id: 'outstation', title: 'Outstation Trip', icon: Map, color: 'bg-orange-500', link: '/book?type=outstation' },
    { id: 'rental', title: 'Car Rental', icon: Package, color: 'bg-indigo-500', link: '/rental' },
    { id: 'emergency', title: 'Emergency Contact', icon: Shield, color: 'bg-red-500', action: () => {
      const emergencyNumber = userData?.emergencyContact?.phone || '+91 9876543210';
      alert(`Emergency Contact: ${emergencyNumber}\n\nIn real app, this would call: ${emergencyNumber}`);
    }}
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action ? action.action : () => action.link && navigate(action.link)}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className={`p-3 rounded-full ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;