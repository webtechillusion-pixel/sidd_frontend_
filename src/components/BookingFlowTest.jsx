import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import bookingService from '../services/bookingService';
import riderService from '../services/riderService';
import { toast } from 'react-toastify';

const BookingFlowTest = () => {
  const { socket, isConnected } = useSocket();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
  };

  const testBookingFlow = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Socket Connection
      addResult('Socket Connection', isConnected ? 'PASS' : 'FAIL', 
        isConnected ? 'Socket is connected' : 'Socket is not connected');

      // Test 2: Create Mock Booking (disabled for production)
      addResult('Booking Creation', 'SKIP', 'Mock booking creation disabled in production build');

      // Test 4: Nearby Riders
      addResult('Nearby Riders', 'RUNNING', 'Fetching nearby riders...');
      try {
        const ridersResponse = await riderService.getAvailableBookings({
          lat: 19.0760,
          lng: 72.8777
        });
        
        if (ridersResponse.success) {
          const riderCount = ridersResponse.data?.length || 0;
          addResult('Nearby Riders', 'PASS', `Found ${riderCount} available riders`);
        } else {
          addResult('Nearby Riders', 'FAIL', 'No riders available or API error');
        }
      } catch (error) {
        addResult('Nearby Riders', 'FAIL', error.message);
      }

      // Test 5: Fare Calculation
      addResult('Fare Calculation', 'RUNNING', 'Calculating fare...');
      try {
        const fareResponse = await bookingService.calculateFare({
          pickupLat: 19.0760,
          pickupLng: 72.8777,
          dropLat: 19.1136,
          dropLng: 72.8697,
          vehicleType: 'SEDAN'
        });
        
        if (fareResponse.success) {
          addResult('Fare Calculation', 'PASS', `Estimated fare: ₹${fareResponse.data.estimatedFare}`);
        } else {
          addResult('Fare Calculation', 'FAIL', 'Fare calculation failed');
        }
      } catch (error) {
        addResult('Fare Calculation', 'FAIL', error.message);
      }

    } catch (error) {
      addResult('General Error', 'FAIL', error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Flow Test Dashboard</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={testBookingFlow}
          disabled={isRunning}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Tests...' : 'Run Booking Flow Test'}
        </button>
        
        <button
          onClick={clearResults}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Connection Status</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            Socket {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Test Results</h3>
        
        {testResults.length === 0 ? (
          <p className="text-gray-500 italic">No tests run yet. Click "Run Booking Flow Test" to start.</p>
        ) : (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.status === 'PASS' ? 'border-green-500 bg-green-50' :
                  result.status === 'FAIL' ? 'border-red-500 bg-red-50' :
                  'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{result.test}</h4>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      result.status === 'PASS' ? 'bg-green-100 text-green-800' :
                      result.status === 'FAIL' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2 text-blue-800">How to Test Complete Flow:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
          <li>Run this test to check basic connectivity and API endpoints</li>
          <li>Open rider dashboard in another tab/window</li>
          <li>Make sure rider is online and approved</li>
          <li>Create a booking from customer side</li>
          <li>Check if booking appears on rider dashboard</li>
          <li>Accept booking from rider side</li>
          <li>Verify customer receives acceptance notification</li>
        </ol>
      </div>
    </div>
  );
};

export default BookingFlowTest;