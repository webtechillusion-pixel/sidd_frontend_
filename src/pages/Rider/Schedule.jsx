import React from 'react';
import { FaToggleOn, FaToggleOff, FaClock } from "react-icons/fa";

export function Schedule({ autoAccept, setAutoAccept, handleBreakStart }) {
  return (
    <div className="space-y-6">
      {/* Auto-Accept Toggle */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Auto-Accept Mode</h3>
          <button
            onClick={() => {
              // API: Update auto-accept preference
              // axios.post('/api/rider/auto-accept', {
              //   enabled: !autoAccept
              // });
              setAutoAccept(!autoAccept);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              autoAccept ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {autoAccept ? <FaToggleOn /> : <FaToggleOff />}
            {autoAccept ? 'ON' : 'OFF'}
          </button>
        </div>
        <p className="text-gray-600">Automatically accept rides during your active hours</p>
      </div>

      {/* Smart Schedule Planner */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Schedule</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold mb-2">{day}</div>
              <div className="text-sm text-gray-600">9AM-6PM</div>
              <button 
                onClick={() => {
                  // API: Update schedule for specific day
                  // axios.put('/api/rider/schedule', {
                  //   day: day,
                  //   startTime: '09:00',
                  //   endTime: '18:00'
                  // });
                }}
                className="mt-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Break Timer */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Break Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleBreakStart(15)}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-teal-500"
          >
            <FaClock className="text-2xl text-gray-400 mx-auto mb-2" />
            <p className="text-sm">15 Min Break</p>
          </button>
          <button 
            onClick={() => handleBreakStart(30)}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-teal-500"
          >
            <FaClock className="text-2xl text-gray-400 mx-auto mb-2" />
            <p className="text-sm">30 Min Break</p>
          </button>
          <button 
            onClick={() => handleBreakStart(60)}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-teal-500"
          >
            <FaClock className="text-2xl text-gray-400 mx-auto mb-2" />
            <p className="text-sm">1 Hour Break</p>
          </button>
        </div>
      </div>

      {/* Destination Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Preferred Areas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Central Delhi', 'Gurgaon', 'Noida', 'Faridabad'].map(area => (
            <label key={area} className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm">{area}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}