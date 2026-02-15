import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Settings as SettingsIcon, User, Shield, Lock, ShieldCheck, Smartphone, Camera, Upload, X, Check, Trash2, Loader, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const Settings = ({ 
  profileForm, 
  setProfileForm,
  onUpdate, 
  onProfilePictureUpdate,
  onDeleteProfilePicture,
  currentAvatar,
  onBack 
}) => {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(currentAvatar);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const fileInputRef = useRef(null);

  // Initialize form data from props
  useEffect(() => {
    setFormData({
      name: profileForm?.name || '',
      email: profileForm?.email || '',
      phone: profileForm?.phone || ''
    });
  }, [profileForm]);

  // Change password form state
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      toast.info('New image selected. Click "Upload Now" to save.');
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) {
      toast.warning('Please select an image first');
      return false;
    }
    
    try {
      setIsUploadingImage(true);
      const success = await onProfilePictureUpdate(profileImage);
      if (success) {
        // Clear the file input
        setProfileImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Upload failed:', error);
      return false;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploadingImage(true);
      const success = await onDeleteProfilePicture();
      if (success) {
        setProfileImage(null);
        setImagePreview(`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0D8ABC&color=fff`);
      }
    } catch (error) {
      console.error('Remove failed:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image first if there's a new one
      let imageSuccess = true;
      if (profileImage) {
        imageSuccess = await handleImageUpload();
        if (!imageSuccess) {
          toast.error('Failed to upload profile picture. Profile not updated.');
          setLoading(false);
          return;
        }
      }

      // Then update profile data
      const profileSuccess = await onUpdate(formData);
      
      if (profileSuccess) {
        // Clear any selected image after successful upload
        setProfileImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Update parent state
        setProfileForm(formData);
      }
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelImage = () => {
    setProfileImage(null);
    setImagePreview(currentAvatar);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Image upload cancelled');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!changePasswordData.currentPassword || !changePasswordData.newPassword || !changePasswordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (changePasswordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      await authService.changePassword(
        changePasswordData.currentPassword,
        changePasswordData.newPassword
      );
      
      toast.success('Password changed successfully!');
      // Reset form
      setChangePasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowChangePassword(false);
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.message || 'Failed to change password. Please check your current password and try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChangePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cancelChangePassword = () => {
    setShowChangePassword(false);
    setChangePasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const resetForm = () => {
    setFormData({
      name: profileForm?.name || '',
      email: profileForm?.email || '',
      phone: profileForm?.phone || ''
    });
    setProfileImage(null);
    setImagePreview(currentAvatar);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Form reset to original values');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2 disabled:opacity-50"
            disabled={loading || isUploadingImage || changingPassword}
          >
            <ChevronRight className="h-5 w-5 rotate-180 mr-2" />
            Back to Dashboard
          </button>
          <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600 text-sm">Update your personal information and profile picture</p>
        </div>
        <SettingsIcon className="h-8 w-8 text-blue-600" />
      </div>

      {/* Profile Picture Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Camera className="h-5 w-5 mr-2 text-purple-600" />
          Profile Picture
        </h3>
        
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Profile Picture Preview */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0D8ABC&color=fff`;
                }}
              />
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
              {profileImage && !isUploadingImage && (
                <button
                  onClick={handleCancelImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
                  title="Cancel upload"
                  disabled={loading || isUploadingImage || changingPassword}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {profileImage ? 'New image selected' : 'Current profile picture'}
            </p>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Picture
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  className="hidden"
                  id="profile-upload"
                  disabled={loading || isUploadingImage || changingPassword}
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={loading || isUploadingImage || changingPassword}
                  className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${loading || isUploadingImage || changingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Image
                </button>
                
                {profileImage && !isUploadingImage && (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={loading || isUploadingImage || changingPassword}
                      className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading || isUploadingImage || changingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Upload Now
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WEBP
              </p>
            </div>

            {/* Remove Profile Picture Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={loading || isUploadingImage || !currentAvatar || currentAvatar.includes('ui-avatars.com') || changingPassword}
                className="flex items-center text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove profile picture
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      {showChangePassword && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              Change Password
            </h3>
            <button
              type="button"
              onClick={cancelChangePassword}
              className="text-gray-500 hover:text-gray-700 text-sm"
              disabled={changingPassword}
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={changePasswordData.currentPassword}
                  onChange={handleChangePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Enter your current password"
                  required
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={changingPassword}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={changePasswordData.newPassword}
                  onChange={handleChangePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Minimum 6 characters"
                  required
                  disabled={changingPassword}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={changingPassword}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={changePasswordData.confirmPassword}
                  onChange={handleChangePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Confirm your new password"
                  required
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={changingPassword}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              {changingPassword ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Update Password
                </>
              )}
            </button>
          </form>
          
          {/* Password Requirements */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={changePasswordData.newPassword.length >= 6 ? 'text-green-600' : ''}>
                • At least 6 characters long
              </li>
              <li className={/[A-Z]/.test(changePasswordData.newPassword) ? 'text-green-600' : ''}>
                • Contains at least one uppercase letter
              </li>
              <li className={/[a-z]/.test(changePasswordData.newPassword) ? 'text-green-600' : ''}>
                • Contains at least one lowercase letter
              </li>
              <li className={/\d/.test(changePasswordData.newPassword) ? 'text-green-600' : ''}>
                • Contains at least one number
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Personal Information - Single Column Now */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                required
                disabled={loading || isUploadingImage || changingPassword}
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  readOnly
                  disabled
                  title="Email cannot be changed"
                  placeholder="Your email address"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  required
                  disabled={loading || isUploadingImage || changingPassword}
                  placeholder="Enter your phone number"
                />
                <p className="text-xs text-gray-500 mt-1">Used for ride notifications and driver contact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        {!showChangePassword && (
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Account Security
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left disabled:opacity-50 transition-colors"
                disabled={loading || isUploadingImage || changingPassword}
              >
                <Lock className="h-5 w-5 text-blue-600 mb-2" />
                <div className="font-medium text-gray-900">Change Password</div>
                <p className="text-sm text-gray-600">Update your password for security</p>
              </button>
              
              <button
                type="button"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left disabled:opacity-50 transition-colors"
                disabled={loading || isUploadingImage || changingPassword}
                onClick={() => toast.info('Two-factor authentication will be added soon')}
              >
                <ShieldCheck className="h-5 w-5 text-purple-600 mb-2" />
                <div className="font-medium text-gray-900">Two-Factor Auth</div>
                <p className="text-sm text-gray-600">Enable 2FA for extra security</p>
              </button>
              
              <button
                type="button"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left disabled:opacity-50 transition-colors"
                disabled={loading || isUploadingImage || changingPassword}
                onClick={() => toast.info('Active devices list will be shown here')}
              >
                <Smartphone className="h-5 w-5 text-green-600 mb-2" />
                <div className="font-medium text-gray-900">Active Devices</div>
                <p className="text-sm text-gray-600">Manage logged in devices</p>
              </button>
            </div>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            disabled={loading || isUploadingImage || changingPassword}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            disabled={loading || isUploadingImage || changingPassword}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
            disabled={loading || isUploadingImage || changingPassword || showChangePassword}
          >
            {loading || isUploadingImage ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                {isUploadingImage ? 'Uploading Image...' : 'Saving...'}
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;