import React from 'react';

export function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-gray-100">
          {icon}
        </div>
        {trend && (
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
      <div className="text-3xl text-teal-500 mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

export function EarningCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
      <p className="text-gray-600 mb-2 text-sm sm:text-base">{label}</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{value}</h2>
    </div>
  );
}