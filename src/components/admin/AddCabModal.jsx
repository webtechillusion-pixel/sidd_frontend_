import React, { useState } from 'react';
import { X, Car } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AddCabModal = ({ riders, onClose, onSuccess }) => {
  const { createCab } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    riderId: '',
    cabType: 'SEDAN',
    cabNumber: '',
    cabModel: '',
    seatingCapacity: 5,
    acAvailable: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.riderId || !formData.cabNumber || !formData.cabModel) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const result = await createCab(formData);
    setLoading(false);

    if (result) {
      onSuccess();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Car className="h-5 w-5" />
            Add New Cab
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Rider *
            </label>
            <select
              name="riderId"
              value={formData.riderId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a rider</option>
              {riders?.map(rider => (
                <option key={rider._id} value={rider._id}>
                  {rider.name} - {rider.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cab Type *
            </label>
            <select
              name="cabType"
              value={formData.cabType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="HATCHBACK">Hatchback</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cab Number *
            </label>
            <input
              type="text"
              name="cabNumber"
              value={formData.cabNumber}
              onChange={handleChange}
              placeholder="e.g., DL01AB1234"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cab Model *
            </label>
            <input
              type="text"
              name="cabModel"
              value={formData.cabModel}
              onChange={handleChange}
              placeholder="e.g., Honda City 2023"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seating Capacity
            </label>
            <input
              type="number"
              name="seatingCapacity"
              value={formData.seatingCapacity}
              onChange={handleChange}
              min="2"
              max="8"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="acAvailable"
              id="acAvailable"
              checked={formData.acAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="acAvailable" className="text-sm text-gray-700">
              AC Available
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 order-1 sm:order-2"
            >
              {loading ? 'Creating...' : 'Create Cab'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCabModal;