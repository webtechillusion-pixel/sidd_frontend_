import React, { useState } from 'react';
import { 
  X, User, Mail, Phone, Car, Shield, CheckCircle, 
  XCircle, AlertCircle, Calendar, MapPin, FileText, 
  Image as ImageIcon, CreditCard, Star, Clock
} from 'lucide-react';

const RiderDetailsModal = ({ 
  rider, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject, 
  onSuspend 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !rider) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'cab', label: 'Cab Details' },
    { id: 'performance', label: 'Performance' },
    { id: 'earnings', label: 'Earnings' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Rider ID</label>
                  <p className="mt-1 text-sm text-gray-900">{rider._id}</p>
                </div>
              </div>
            </div>

            {/* KYC Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">KYC Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Aadhaar Number</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.aadhaarNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Driving License</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.drivingLicenseNumber}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Status Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Approval Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rider.approvalStatus)}`}>
                    {rider.approvalStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-medium ${rider.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {rider.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Date</span>
                  <span className="font-medium">{new Date(rider.createdAt).toLocaleDateString()}</span>
                </div>
                {rider.approvedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved On</span>
                    <span className="font-medium">{new Date(rider.approvedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aadhaar */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Aadhaar Card</h4>
                <div className="space-y-2">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    {rider.aadhaarImage?.front ? (
                      <img 
                        src={rider.aadhaarImage.front} 
                        alt="Aadhaar Front"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    {rider.aadhaarImage?.back ? (
                      <img 
                        src={rider.aadhaarImage.back} 
                        alt="Aadhaar Back"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Driving License */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Driving License</h4>
                <div className="space-y-2">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    {rider.drivingLicenseImage?.front ? (
                      <img 
                        src={rider.drivingLicenseImage.front} 
                        alt="License Front"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    {rider.drivingLicenseImage?.back ? (
                      <img 
                        src={rider.drivingLicenseImage.back} 
                        alt="License Back"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Other Documents */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Other Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                  {rider.policeVerificationImage ? (
                    <img 
                      src={rider.policeVerificationImage} 
                      alt="Police Verification"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Police Verification</p>
                    </div>
                  )}
                </div>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                  {rider.photo ? (
                    <img 
                      src={rider.photo} 
                      alt="Profile"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Profile Photo</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'cab':
        return rider.cab ? (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Cab Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Cab Number</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.cab.cabNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Cab Model</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.cab.cabModel}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Cab Type</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.cab.cabType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Seating Capacity</label>
                  <p className="mt-1 text-sm text-gray-900">{rider.cab.seatingCapacity} persons</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">AC Available</label>
                  <p className={`mt-1 text-sm ${rider.cab.acAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {rider.cab.acAvailable ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Approval Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rider.cab.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      rider.cab.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {rider.cab.approvalStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Cab Images */}
            {rider.cab.images && rider.cab.images.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Cab Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rider.cab.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Cab ${image.type}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-b-lg">
                        {image.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No cab information available
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{rider.overallRating || 0}</div>
                  <div className="flex justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= (rider.overallRating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Overall Rating</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{rider.totalRatings || 0}</div>
                  <p className="text-sm text-gray-500 mt-2">Total Ratings</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{rider.completedRides || 0}</div>
                  <p className="text-sm text-gray-500 mt-2">Completed Rides</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Earnings Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(rider.earnings?.totalEarnings || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Payout</span>
                  <span className="font-bold text-yellow-600">
                    {formatCurrency(rider.earnings?.pendingPayout || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission Paid</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(rider.earnings?.totalCommission || 0)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-gray-900">Total Rides</span>
                  <span className="font-bold">{rider.earnings?.totalRides || 0}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {rider.name} - Rider Details
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {rider._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-6">
                  {rider.photo ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={rider.photo}
                      alt={rider.name}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{rider.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rider.approvalStatus)}`}>
                        {rider.approvalStatus}
                      </span>
                      {rider.isOnline && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                          ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {rider.approvalStatus === 'PENDING' && (
              <>
                <button
                  type="button"
                  onClick={onApprove}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve Rider
                </button>
                <button
                  type="button"
                  onClick={onReject}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject Rider
                </button>
              </>
            )}
            
            {rider.approvalStatus === 'APPROVED' && (
              <button
                type="button"
                onClick={onSuspend}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                Suspend Rider
              </button>
            )}
            
            {/* Show Approve button for suspended riders */}
            {rider.approvalStatus === 'SUSPENDED' && (
              <button
                type="button"
                onClick={onApprove}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Approve Rider (Unsuspend)
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDetailsModal;