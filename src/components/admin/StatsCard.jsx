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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-2">
            <span className="text-green-600 font-medium">+{change}</span> {changeText}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].split(' ')[0]} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;