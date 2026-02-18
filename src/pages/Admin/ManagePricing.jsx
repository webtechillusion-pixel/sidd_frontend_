// frontend/src/pages/admin/ManagePricing.jsx
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Car,
  Edit,
  Save,
  X,
  BarChart,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const ManagePricing = () => {
  const {
    pricing,
    loadPricing,
    updatePricing
  } = useAdmin();

  const [loading, setLoading] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [editData, setEditData] = useState({});
  const [newPricing, setNewPricing] = useState({
    cabType: '',
    pricePerKm: '',
    baseFare: '',
    adminCommissionPercent: ''
  });

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    setLoading(true);
    await loadPricing();
    setLoading(false);
  };

  const handleEdit = (cabType) => {
    const cab = pricing.find(p => p.cabType === cabType);
    if (cab) {
      setEditingType(cabType);
      setEditData({
        pricePerKm: cab.pricePerKm,
        baseFare: cab.baseFare,
        adminCommissionPercent: cab.adminCommissionPercent
      });
    }
  };

  const handleSave = async (cabType) => {
    if (!editData.pricePerKm || !editData.baseFare || !editData.adminCommissionPercent) {
      toast.error('Please fill all fields');
      return;
    }

    if (await updatePricing(cabType, editData)) {
      setEditingType(null);
      setEditData({});
      toast.success('Pricing updated successfully');
    }
  };

  const handleCancel = () => {
    setEditingType(null);
    setEditData({});
  };

  const handleAddNew = async () => {
    if (!newPricing.cabType || !newPricing.pricePerKm || !newPricing.baseFare || !newPricing.adminCommissionPercent) {
      toast.error('Please fill all fields');
      return;
    }

    if (await updatePricing(newPricing.cabType, {
      pricePerKm: parseFloat(newPricing.pricePerKm),
      baseFare: parseFloat(newPricing.baseFare),
      adminCommissionPercent: parseFloat(newPricing.adminCommissionPercent)
    })) {
      setNewPricing({
        cabType: '',
        pricePerKm: '',
        baseFare: '',
        adminCommissionPercent: ''
      });
      toast.success('New pricing added successfully');
    }
  };

  const calculateFare = (distance, cab) => {
    const price = cab.baseFare + (distance * cab.pricePerKm);
    const commission = price * (cab.adminCommissionPercent / 100);
    const riderEarning = price - commission;
    
    return {
      total: Math.round(price),
      commission: Math.round(commission),
      riderEarning: Math.round(riderEarning)
    };
  };

  const getCabTypeInfo = (type) => {
    const info = {
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
    return info[type] || { name: type, icon: '🚗', color: 'gray', description: '' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Pricing</h1>
        <p className="text-gray-600">Configure fare rates and commission for different cab types</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Average Base Fare</p>
              <p className="text-2xl font-bold truncate">
                ₹{pricing.length > 0 ? Math.round(pricing.reduce((sum, p) => sum + p.baseFare, 0) / pricing.length) : 0}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500 flex-shrink-0 ml-4" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Avg Price per KM</p>
              <p className="text-2xl font-bold truncate">
                ₹{pricing.length > 0 ? (pricing.reduce((sum, p) => sum + p.pricePerKm, 0) / pricing.length).toFixed(2) : 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500 flex-shrink-0 ml-4" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Avg Commission</p>
              <p className="text-2xl font-bold truncate">
                {pricing.length > 0 ? (pricing.reduce((sum, p) => sum + p.adminCommissionPercent, 0) / pricing.length).toFixed(1) : 0}%
              </p>
            </div>
            <BarChart className="h-8 w-8 text-purple-500 flex-shrink-0 ml-4" />
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricing.map((cab) => {
          const info = getCabTypeInfo(cab.cabType);
          const fareExample = calculateFare(10, cab); // Example for 10km
          
          return (
            <div key={cab.cabType} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className={`bg-${info.color}-50 border-b border-${info.color}-100 p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <span className="text-2xl mr-2 flex-shrink-0">{info.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{info.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{info.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(cab.cabType)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {editingType === cab.cabType ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Base Fare (₹)</label>
                      <input
                        type="number"
                        value={editData.baseFare}
                        onChange={(e) => setEditData(prev => ({ ...prev, baseFare: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Base fare"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Price per KM (₹)</label>
                      <input
                        type="number"
                        value={editData.pricePerKm}
                        onChange={(e) => setEditData(prev => ({ ...prev, pricePerKm: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Price per km"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Commission (%)</label>
                      <input
                        type="number"
                        value={editData.adminCommissionPercent}
                        onChange={(e) => setEditData(prev => ({ ...prev, adminCommissionPercent: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Commission %"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleSave(cab.cabType)}
                        className="w-full sm:flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 inline mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full sm:flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-300"
                      >
                        <X className="h-4 w-4 inline mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Base Fare</span>
                        <span className="font-bold text-gray-900">₹{cab.baseFare}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Per KM Rate</span>
                        <span className="font-bold text-gray-900">₹{cab.pricePerKm}/km</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Commission</span>
                        <span className="font-bold text-gray-900">{cab.adminCommissionPercent}%</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-500 mb-2">Example for 10km:</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm">Total Fare:</span>
                            <span className="font-bold">₹{fareExample.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Rider Earnings:</span>
                            <span className="text-green-600">₹{fareExample.riderEarning}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Platform Commission:</span>
                            <span className="text-blue-600">₹{fareExample.commission}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Last updated: {cab.updatedAt ? new Date(cab.updatedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Pricing Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Cab Type Pricing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cab Type</label>
            <select
              value={newPricing.cabType}
              onChange={(e) => setNewPricing(prev => ({ ...prev, cabType: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select Type</option>
              <option value="HATCHBACK">Hatchback</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Fare (₹)</label>
            <input
              type="number"
              value={newPricing.baseFare}
              onChange={(e) => setNewPricing(prev => ({ ...prev, baseFare: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="e.g., 50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per KM (₹)</label>
            <input
              type="number"
              value={newPricing.pricePerKm}
              onChange={(e) => setNewPricing(prev => ({ ...prev, pricePerKm: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="e.g., 12"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
            <input
              type="number"
              value={newPricing.adminCommissionPercent}
              onChange={(e) => setNewPricing(prev => ({ ...prev, adminCommissionPercent: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="e.g., 15"
              step="0.1"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddNew}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Add New Pricing
          </button>
        </div>
      </div>

      {/* Pricing Calculator */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Fare Calculator</h3>
          <RefreshCw className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Cab Type</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Hatchback</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Premium</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distance (KM)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter distance"
              defaultValue="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Fare</label>
            <div className="text-2xl font-bold text-green-600">
              ₹{calculateFare(10, pricing[0] || { baseFare: 50, pricePerKm: 12 }).total}
            </div>
            <p className="text-xs text-gray-500 mt-1">For 10km in Hatchback</p>
          </div>
        </div>
      </div>

      {/* Commission Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Information</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-blue-100 gap-4">
            <div>
              <p className="font-medium text-gray-900">Platform Commission</p>
              <p className="text-sm text-gray-600">Percentage deducted from total fare</p>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {pricing.length > 0 ? Math.max(...pricing.map(p => p.adminCommissionPercent)) : 0}%
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900">Total Revenue from Commission</p>
              <p className="text-2xl font-bold text-green-600 mt-2">₹12,45,680</p>
              <p className="text-xs text-gray-500 mt-1">Current month</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900">Average Commission per Ride</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">₹45</p>
              <p className="text-xs text-gray-500 mt-1">Based on last 100 rides</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePricing;