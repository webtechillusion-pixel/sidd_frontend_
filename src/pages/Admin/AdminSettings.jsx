// frontend/src/pages/admin/AdminSettings.jsx
import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Mail,
  Globe,
  CreditCard,
  Users,
  Key,
  Save,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const { admin } = useAdmin();

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'TravelX Cab Booking',
    supportEmail: 'support@travelx.com',
    supportPhone: '+91-9876543210',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    maintenanceMode: false
  });

  // Commission Settings
  const [commissionSettings, setCommissionSettings] = useState({
    defaultCommission: 15,
    minCommission: 5,
    maxCommission: 30,
    commissionType: 'percentage', // 'percentage' or 'fixed'
    payoutSchedule: 'weekly' // 'daily', 'weekly', 'monthly'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingAlerts: true,
    payoutAlerts: true,
    riderAlerts: true,
    userAlerts: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    passwordExpiryDays: 90,
    ipWhitelist: [],
    newIp: ''
  });

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: admin?.photo || ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSaveSettings = async (settingsType) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (settingsType) {
        case 'general':
          toast.success('General settings updated successfully');
          break;
        case 'commission':
          toast.success('Commission settings updated successfully');
          break;
        case 'notifications':
          toast.success('Notification settings updated successfully');
          break;
        case 'security':
          toast.success('Security settings updated successfully');
          break;
        case 'profile':
          if (profileSettings.newPassword && profileSettings.newPassword !== profileSettings.confirmPassword) {
            toast.error('New passwords do not match');
            setLoading(false);
            return;
          }
          toast.success('Profile updated successfully');
          break;
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileSettings(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const addIpToWhitelist = () => {
    if (securitySettings.newIp && /^(\d{1,3}\.){3}\d{1,3}$/.test(securitySettings.newIp)) {
      setSecuritySettings(prev => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, prev.newIp],
        newIp: ''
      }));
      toast.success('IP added to whitelist');
    } else {
      toast.error('Please enter a valid IP address');
    }
  };

  const removeIpFromWhitelist = (ip) => {
    setSecuritySettings(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(i => i !== ip)
    }));
    toast.success('IP removed from whitelist');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'commission', label: 'Commission', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'profile', label: 'Profile', icon: Users }
  ];

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={generalSettings.platformName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, platformName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={generalSettings.supportPhone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  >
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">EST</option>
                    <option value="Europe/London">GMT</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">
                    Temporarily disable the platform for maintenance
                  </p>
                </div>
                <button
                  onClick={() => setGeneralSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    generalSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    generalSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSaveSettings('general')}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      case 'commission':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Commission (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={commissionSettings.defaultCommission}
                      onChange={(e) => setCommissionSettings(prev => ({ ...prev, defaultCommission: parseFloat(e.target.value) }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Percentage deducted from each ride</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Type
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={commissionSettings.commissionType}
                      onChange={(e) => setCommissionSettings(prev => ({ ...prev, commissionType: e.target.value }))}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Commission (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={commissionSettings.minCommission}
                      onChange={(e) => setCommissionSettings(prev => ({ ...prev, minCommission: parseFloat(e.target.value) }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Commission (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={commissionSettings.maxCommission}
                      onChange={(e) => setCommissionSettings(prev => ({ ...prev, maxCommission: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payout Schedule
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={commissionSettings.payoutSchedule}
                    onChange={(e) => setCommissionSettings(prev => ({ ...prev, payoutSchedule: e.target.value }))}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly (Every Monday)</option>
                    <option value="monthly">Monthly (1st of every month)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    When riders receive their earnings
                  </p>
                </div>

                {/* Commission Preview */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Commission Preview</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ride Fare:</span>
                      <span className="font-medium">₹500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission ({commissionSettings.defaultCommission}%):</span>
                      <span className="text-red-600">₹{500 * (commissionSettings.defaultCommission / 100)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-medium">Rider Earnings:</span>
                      <span className="text-green-600 font-bold">
                        ₹{500 - (500 * (commissionSettings.defaultCommission / 100))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSaveSettings('commission')}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => setNotificationSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <button
                  onClick={() => setNotificationSettings(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notificationSettings.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notificationSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive push notifications</p>
                </div>
                <button
                  onClick={() => setNotificationSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notificationSettings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">New Booking Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.bookingAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, bookingAlerts: e.target.checked }))}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Payout Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.payoutAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, payoutAlerts: e.target.checked }))}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Rider Registration Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.riderAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, riderAlerts: e.target.checked }))}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">User Activity Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.userAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, userAlerts: e.target.checked }))}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSaveSettings('notifications')}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    securitySettings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  min="30"
                  max="365"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={securitySettings.passwordExpiryDays}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiryDays: parseInt(e.target.value) }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 to disable password expiry
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">IP Whitelist</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter IP address (e.g., 192.168.1.1)"
                      value={securitySettings.newIp}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, newIp: e.target.value }))}
                    />
                    <button
                      onClick={addIpToWhitelist}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {securitySettings.ipWhitelist.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">{ip}</span>
                        <button
                          onClick={() => removeIpFromWhitelist(ip)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSaveSettings('security')}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
            
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="relative">
                  {profileSettings.profilePicture ? (
                    <img
                      src={profileSettings.profilePicture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                      <span className="text-4xl font-medium text-gray-600">
                        {profileSettings.name?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                  )}
                  
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to upload new photo</p>
              </div>

              {/* Profile Form */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? 'text' : 'password'}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                          value={profileSettings.currentPassword}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                          value={profileSettings.newPassword}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                          value={profileSettings.confirmPassword}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setProfileSettings({
                    name: admin?.name || '',
                    email: admin?.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    profilePicture: admin?.photo || ''
                  });
                  setShowPassword({ current: false, new: false, confirm: false });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSettings('profile')}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">Manage platform configuration and preferences</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap
                    ${isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {renderSettingsContent()}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900">Platform Version</p>
            <p className="text-2xl font-bold mt-2">2.1.0</p>
            <p className="text-xs text-gray-500 mt-1">Latest stable release</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900">Database Status</p>
            <p className="text-2xl font-bold text-green-600 mt-2">Healthy</p>
            <p className="text-xs text-gray-500 mt-1">Connected to MongoDB</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900">Last Backup</p>
            <p className="text-2xl font-bold mt-2">Today, 02:00 AM</p>
            <p className="text-xs text-gray-500 mt-1">Automated backup completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;