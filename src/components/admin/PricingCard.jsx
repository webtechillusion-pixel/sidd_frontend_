import React, { useState } from 'react';
import { DollarSign, Car, Edit, Save, X, TrendingUp, BarChart } from 'lucide-react';

const PricingCard = ({ cabType, pricing, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(pricing);

  const cabTypeInfo = {
    HATCHBACK: {
      name: 'Hatchback',
      icon: '🚗',
      color: 'blue',
      description: 'Compact cars, fuel efficient'
    },
    SEDAN: {
      name: 'Sedan',
      icon: '🚙',
      color: 'green',
      description: 'Comfortable, spacious'
    },
    SUV: {
      name: 'SUV',
      icon: '🚙',
      color: 'purple',
      description: 'Large, luxury vehicles'
    },
    PREMIUM: {
      name: 'Premium',
      icon: '⭐',
      color: 'yellow',
      description: 'Premium luxury service'
    }
  };

  const info = cabTypeInfo[cabType] || { name: cabType, icon: '🚗', color: 'gray', description: '' };

  const calculateFare = (distance = 10) => {
    const total = editData.baseFare + (distance * editData.pricePerKm);
    const commission = total * (editData.adminCommissionPercent / 100);
    const riderEarning = total - commission;
    
    return {
      total: Math.round(total),
      commission: Math.round(commission),
      riderEarning: Math.round(riderEarning)
    };
  };

  const handleSave = () => {
    onUpdate?.(cabType, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(pricing);
    setIsEditing(false);
  };

  const fareExample = calculateFare();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className={`bg-${info.color}-50 border-b border-${info.color}-100 p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{info.icon}</span>
            <div>
              <h3 className="font-bold text-gray-900">{info.name}</h3>
              <p className="text-xs text-gray-600">{info.description}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Base Fare (₹)</label>
              <input
                type="number"
                value={editData.baseFare}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  baseFare: parseFloat(e.target.value) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Base fare"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Price per KM (₹)</label>
              <input
                type="number"
                value={editData.pricePerKm}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  pricePerKm: parseFloat(e.target.value) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Price per km"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Commission (%)</label>
              <input
                type="number"
                value={editData.adminCommissionPercent}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  adminCommissionPercent: parseFloat(e.target.value) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Commission %"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-300 flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Base Fare</span>
                </div>
                <span className="font-bold text-gray-900">₹{pricing.baseFare}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Price per KM</span>
                </div>
                <span className="font-bold text-gray-900">₹{pricing.pricePerKm}/km</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Commission</span>
                </div>
                <span className="font-bold text-gray-900">{pricing.adminCommissionPercent}%</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-xs text-gray-500 mb-2">Example for 10km:</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Total Fare:</span>
                    <span className="font-bold">₹{fareExample.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rider Earnings:</span>
                    <span className="text-green-600">₹{fareExample.riderEarning}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Commission:</span>
                    <span className="text-blue-600">₹{fareExample.commission}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Last updated: {pricing.updatedAt ? new Date(pricing.updatedAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCard;