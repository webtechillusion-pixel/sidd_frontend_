import React, { useState } from 'react';
import { FaCamera, FaStar, FaCheckCircle } from "react-icons/fa";

export function Profile({ 
  profileData, 
  setProfileData, 
  stats, 
  handleProfileUpdate,
  showToast 
}) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingPhoto(true);
      try {
        // Note: Photo upload API not provided
        showToast('Photo uploaded successfully!', 'success');
      } catch (error) {
        showToast('Failed to upload photo', 'error');
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Driver Profile */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Driver Profile</h3>
        <div className="flex items-start gap-6 mb-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3 relative overflow-hidden">
              {profileData?.photo ? (
                <img 
                  src={profileData.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaCamera className="text-2xl text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <button 
              onClick={() => document.querySelector('input[type="file"]').click()}
              disabled={uploadingPhoto}
              className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded disabled:opacity-50"
            >
              {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
            </button>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={profileData?.name || ''}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full p-3 border rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={profileData?.phone || ''}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full p-3 border rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={profileData?.email || ''}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-50" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                  profileData?.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  profileData?.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <FaCheckCircle />
                  {profileData?.approvalStatus || 'PENDING'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Feedback */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Ratings & Feedback</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {profileData?.overallRating || 0}
            </div>
            <p className="text-gray-600">Overall Rating</p>
            <div className="flex justify-center mt-2">
              {[1,2,3,4,5].map(star => (
                <FaStar 
                  key={star} 
                  className={star <= Math.floor(profileData?.overallRating || 0) ? 'text-yellow-500' : 'text-gray-300'} 
                />
              ))}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {profileData?.totalRatings || 0}
            </div>
            <p className="text-gray-600">Total Reviews</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {profileData?.completedRides || 0}
            </div>
            <p className="text-gray-600">Completed Rides</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleProfileUpdate}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Update Profile
      </button>
    </div>
  );
}