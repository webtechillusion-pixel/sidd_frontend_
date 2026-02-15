import React, { useState } from 'react';
import bookingService from '../services/bookingService';
import api from '../services/api';

const BookingDebug = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
    console.log(`[${timestamp}] ${message}`);
  };

  const testNearbyRiders = async () => {
    setLoading(true);
    addLog('🔍 Testing nearby riders API...');
    
    try {
      const response = await api.get('/api/riders/nearby-riders', {
        params: {
          lat: 19.0760,
          lng: 72.8777,
          vehicleType: 'SEDAN',
          radius: 10
        }
      });
      
      addLog(`✅ API Response: ${JSON.stringify(response.data)}`, 'success');
      addLog(`📊 Found ${response.data.data?.length || 0} riders`, 'info');
      
    } catch (error) {
      addLog(`❌ API Error: ${error.message}`, 'error');
      addLog(`📋 Error Details: ${JSON.stringify(error.response?.data)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testBookingCreation = async () => {
    setLoading(true);
    addLog('🚀 Testing booking creation...');
    
    try {
      const bookingData = {
        pickup: {
          addressText: 'Test Pickup Location',
          lat: 19.0760,
          lng: 72.8777,
          contactName: 'Test User',
          contactPhone: '+919999999999'
        },
        drop: {
          addressText: 'Test Drop Location',
          lat: 19.0860,
          lng: 72.8877
        },
        vehicleType: 'SEDAN',
        paymentMethod: 'CASH',
        passengers: 1,
        tripType: 'ONE_WAY',
        bookingType: 'IMMEDIATE'
      };
      
      addLog(`📦 Booking Data: ${JSON.stringify(bookingData)}`);
      
      const response = await bookingService.createBooking(bookingData);
      addLog(`✅ Booking Created: ${JSON.stringify(response)}`, 'success');
      
    } catch (error) {
      addLog(`❌ Booking Error: ${error.message}`, 'error');
      addLog(`📋 Error Details: ${JSON.stringify(error.response?.data)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🔧 Booking System Debug</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={testNearbyRiders}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Nearby Riders
        </button>
        
        <button
          onClick={testBookingCreation}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Booking Creation
        </button>
        
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Clear Logs
        </button>
      </div>

      {loading && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            <span>Testing in progress...</span>
          </div>
        </div>
      )}

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        <div className="mb-2 text-gray-400">Debug Console:</div>
        {logs.length === 0 ? (
          <div className="text-gray-500">No logs yet. Click a test button to start.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`mb-1 ${
              log.type === 'error' ? 'text-red-400' : 
              log.type === 'success' ? 'text-green-400' : 
              'text-blue-400'
            }`}>
              <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingDebug;