import React from 'react';

export function WeeklyChart({ data }) {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="h-48 sm:h-64">
      <div className="flex items-end justify-between h-32 sm:h-48 gap-1 sm:gap-2">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="bg-gradient-to-t from-green-500 to-green-400 rounded-t w-full transition-all duration-500 hover:from-green-600 hover:to-green-500"
              style={{ height: `${(value / maxValue) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-xs text-gray-500 mt-1 sm:mt-2">{days[index]}</span>
            <span className="text-xs font-semibold text-gray-700 hidden sm:block">₹{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HourlyChart({ data }) {
  const maxValue = Math.max(...data);
  const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'];
  
  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-48 gap-1">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-full transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
              style={{ height: `${(value / maxValue) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-xs text-gray-500 mt-2 transform -rotate-45">{hours[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthlyChart({ data }) {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data);
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  
  return (
    <div className="h-48 sm:h-64">
      <div className="flex items-end justify-between h-32 sm:h-48 gap-2 sm:gap-3">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="bg-gradient-to-t from-teal-500 to-teal-400 rounded-t w-full transition-all duration-500 hover:from-teal-600 hover:to-teal-500"
              style={{ height: `${(value / maxValue) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-xs text-gray-500 mt-1 sm:mt-2">{months[index]}</span>
            <span className="text-xs font-semibold text-gray-700 hidden sm:block">₹{(value/1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PeakHoursChart({ data, peakHours }) {
  const maxValue = Math.max(...data);
  const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'];
  
  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-48 gap-1">
        {data.map((value, index) => {
          const isPeak = peakHours.includes(index + 6);
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`rounded-t w-full transition-all duration-500 ${
                  isPeak 
                    ? 'bg-gradient-to-t from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500'
                    : 'bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500'
                }`}
                style={{ height: `${(value / maxValue) * 100}%`, minHeight: '4px' }}
              />
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45">{hours[index]}</span>
              {isPeak && <span className="text-xs text-yellow-600 font-bold">Peak</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PerformanceChart() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center text-gray-500">
        <p>Performance chart will be implemented</p>
      </div>
    </div>
  );
}