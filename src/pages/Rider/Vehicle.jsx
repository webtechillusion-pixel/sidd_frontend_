import React, { useState, useEffect } from 'react';
import { FaCar, FaWrench, FaFileAlt, FaUpload } from "react-icons/fa";
import riderService from '../../services/riderService';

export function Vehicle({ 
  expenses = [], 
  handleAddExpense, 
  newExpense = { type: 'Fuel', amount: '' }, 
  setNewExpense, 
  cab, 
  showToast = (msg, type) => console.log(msg, type) 
}) {
  const [updatingCab, setUpdatingCab] = useState(false);
  const [cabForm, setCabForm] = useState({
    cabNumber: cab?.cabNumber || '',
    cabModel: cab?.cabModel || '',
    cabType: cab?.cabType || 'SEDAN',
    seatingCapacity: cab?.seatingCapacity || 4,
    acAvailable: cab?.acAvailable || true,
  });

  const [documents, setDocuments] = useState([
    { id: 1, name: 'RC Front', status: 'Required', type: 'rcFront' },
    { id: 2, name: 'RC Back', status: 'Required', type: 'rcBack' },
    { id: 3, name: 'Insurance', status: 'Required', type: 'insurance' },
    { id: 4, name: 'PUC', status: 'Required', type: 'puc' }
  ]);

  // Load cab data from profile if not passed
  useEffect(() => {
    if (!cab) {
      // Try to get cab data from localStorage or default
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.cab) {
            setCabForm({
              cabNumber: user.cab.cabNumber || '',
              cabModel: user.cab.cabModel || '',
              cabType: user.cab.cabType || 'SEDAN',
              seatingCapacity: user.cab.seatingCapacity || 4,
              acAvailable: user.cab.acAvailable || true,
            });
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, [cab]);

  const handleCabUpdate = async (e) => {
    e.preventDefault();
    setUpdatingCab(true);
    try {
      // Check if API is available
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please login to update vehicle details', 'error');
        return;
      }

      // Create FormData
      const formData = new FormData();
      Object.keys(cabForm).forEach(key => {
        if (cabForm[key] !== undefined && cabForm[key] !== null) {
          formData.append(key, cabForm[key]);
        }
      });

      console.log('Updating cab with:', Object.fromEntries(formData));
      
      try {
        const response = await riderService.updateCabDetails(formData);
        if (response.success) {
          showToast('Cab details updated successfully!', 'success');
          
          // Update local storage
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.cab = { ...user.cab, ...cabForm };
            localStorage.setItem('user', JSON.stringify(user));
          }
        } else {
          showToast(response.message || 'Failed to update cab details', 'error');
        }
      } catch (apiError) {
        console.log('Cab update API error:', apiError);
        showToast('Failed to update cab details (API error)', 'error');
        // Production: do not perform mock localStorage updates here
        // Previously this block saved cab details locally for demo; removed for deployment.
      }
    } catch (error) {
      console.error('Cab update error:', error);
      showToast('Failed to update cab details', 'error');
    } finally {
      setUpdatingCab(false);
    }
  };

  const handleDocumentUpload = async (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.pdf';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            showToast('File size should be less than 5MB', 'error');
            return;
          }

          // Check file type
          const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
          if (!validTypes.includes(file.type)) {
            showToast('Only JPG, PNG, and PDF files are allowed', 'error');
            return;
          }

          showToast(`Uploading ${type}...`, 'info');

          // Create FormData
          const formData = new FormData();
          formData.append(type, file);

          try {
            const response = await riderService.updateCabDetails(formData);
            if (response.success) {
              showToast(`${type} uploaded successfully!`, 'success');
              
              // Update document status
              setDocuments(prev => prev.map(doc => 
                doc.type === type 
                  ? { ...doc, status: 'Uploaded', fileName: file.name }
                  : doc
              ));
            } else {
              showToast('Upload failed', 'error');
            }
          } catch (apiError) {
            console.log('Document upload API error:', apiError);
            showToast('Failed to upload document (API error)', 'error');
            // Production: no mock localStorage uploads
          }
        } catch (error) {
          console.error('Upload error:', error);
          showToast('Upload failed', 'error');
        }
      }
    };
    
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Details Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Update Vehicle Details</h3>
        <form onSubmit={handleCabUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
            <input 
              type="text" 
              value={cabForm.cabNumber}
              onChange={(e) => setCabForm({...cabForm, cabNumber: e.target.value.toUpperCase()})}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., MH12AB1234"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
            <input 
              type="text" 
              value={cabForm.cabModel}
              onChange={(e) => setCabForm({...cabForm, cabModel: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., Honda City"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
            <select 
              value={cabForm.cabType}
              onChange={(e) => setCabForm({...cabForm, cabType: e.target.value})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="SEDAN">Sedan</option>
              <option value="HATCHBACK">Hatchback</option>
              <option value="SUV">SUV</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity</label>
            <select 
              value={cabForm.seatingCapacity}
              onChange={(e) => setCabForm({...cabForm, seatingCapacity: parseInt(e.target.value)})}
              className="w-full p-3 border rounded-lg"
            >
              <option value={4}>4 Seater</option>
              <option value={6}>6 Seater</option>
              <option value={7}>7 Seater</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center p-3 bg-gray-50 rounded-lg">
            <input 
              type="checkbox" 
              id="acAvailable"
              checked={cabForm.acAvailable}
              onChange={(e) => setCabForm({...cabForm, acAvailable: e.target.checked})}
              className="h-4 w-4 text-teal-600 rounded"
            />
            <label htmlFor="acAvailable" className="ml-2 text-gray-700">
              Air Conditioning Available
            </label>
          </div>
          <div className="md:col-span-2">
            <button 
              type="submit"
              disabled={updatingCab}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updatingCab ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                  Updating...
                </>
              ) : 'Update Vehicle Details'}
            </button>
          </div>
        </form>
      </div>

      {/* Vehicle Status */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Vehicle Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FaCar className="text-3xl text-blue-500 mx-auto mb-2" />
            <h4 className="font-semibold">Vehicle Type</h4>
            <p className="text-lg font-bold">{cabForm.cabType || 'Not Set'}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <FaWrench className="text-3xl text-yellow-500 mx-auto mb-2" />
            <h4 className="font-semibold">Approval Status</h4>
            <p className={`text-lg font-bold ${cab?.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
              {cab?.isApproved ? 'Approved' : 'Pending'}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <FaFileAlt className="text-3xl text-green-500 mx-auto mb-2" />
            <h4 className="font-semibold">Availability</h4>
            <p className={`text-lg font-bold ${cab?.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {cab?.isAvailable ? 'Available' : 'Busy'}
            </p>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Vehicle Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold">{doc.name}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  doc.status === 'Uploaded' ? 'bg-green-100 text-green-700' :
                  doc.status === 'Required' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {doc.status}
                </span>
              </div>
              {doc.fileName && (
                <p className="text-sm text-gray-600 mb-2">File: {doc.fileName}</p>
              )}
              <button 
                onClick={() => handleDocumentUpload(doc.type)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaUpload /> Upload {doc.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}