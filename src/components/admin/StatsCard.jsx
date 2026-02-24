// frontend/src/components/admin/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, change, changeText, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    purple: 'bg-purple-500 text-purple-600',
    orange: 'bg-orange-500 text-orange-600',
    red: 'bg-red-500 text-red-600',
  };

  // Ensure values are primitive (number or string)
  const safeValue = typeof value === 'object' ? JSON.stringify(value) : value;
  const safeChange = typeof change === 'object' ? 0 : Number(change) || 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{safeValue}</p>
          <p className="text-sm text-gray-500 mt-2 truncate">
            <span className="text-green-600 font-medium">+{safeChange}</span> {changeText}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].split(' ')[0]} bg-opacity-10 flex-shrink-0 ml-4`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;