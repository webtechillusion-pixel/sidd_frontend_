import React, { useState, useEffect } from 'react';
import { FaUpload, FaDownload, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import riderService from '../../services/riderService';

export function Documents({ cab, rider, showToast }) {
  const [documents, setDocuments] = useState([
    { 
      name: 'Aadhaar Card', 
      status: 'Not Uploaded', 
      type: 'aadhaar',
      frontRequired: true,
      backRequired: true
    },
    { 
      name: 'Driving License', 
      status: 'Not Uploaded', 
      type: 'drivingLicense',
      frontRequired: true,
      backRequired: true
    },
    { 
      name: 'Police Verification', 
      status: 'Not Uploaded', 
      type: 'policeVerification',
      frontRequired: false,
      backRequired: false
    },
  ]);

  const [uploadFiles, setUploadFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    drivingLicenseFront: null,
    drivingLicenseBack: null,
    policeVerification: null
  });

  const [documentNumbers, setDocumentNumbers] = useState({
    aadhaarNumber: rider?.aadhaarNumber || '',
    drivingLicenseNumber: rider?.drivingLicenseNumber || ''
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (rider) {
      const updatedDocs = documents.map(doc => {
        if (doc.type === 'aadhaar') {
          const hasFront = rider.aadhaarImage?.front;
          const hasBack = rider.aadhaarImage?.back;
          return { 
            ...doc, 
            status: hasFront && hasBack ? 'Verified' : hasFront || hasBack ? 'Partial' : 'Not Uploaded',
            frontUploaded: !!hasFront,
            backUploaded: !!hasBack
          };
        }
        if (doc.type === 'drivingLicense') {
          const hasFront = rider.drivingLicenseImage?.front;
          const hasBack = rider.drivingLicenseImage?.back;
          return { 
            ...doc, 
            status: hasFront && hasBack ? 'Verified' : hasFront || hasBack ? 'Partial' : 'Not Uploaded',
            frontUploaded: !!hasFront,
            backUploaded: !!hasBack
          };
        }
        if (doc.type === 'policeVerification') {
          return { 
            ...doc, 
            status: rider.policeVerificationImage ? 'Uploaded' : 'Not Uploaded',
            uploaded: !!rider.policeVerificationImage
          };
        }
        return doc;
      });
      setDocuments(updatedDocs);
      
      setDocumentNumbers({
        aadhaarNumber: rider.aadhaarNumber || '',
        drivingLicenseNumber: rider.drivingLicenseNumber || ''
      });
    }
  }, [rider]);

  const handleFileSelect = (docType, side) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const fieldName = docType === 'aadhaar' 
          ? `aadhaar${side.charAt(0).toUpperCase() + side.slice(1)}`
          : docType === 'drivingLicense'
            ? `drivingLicense${side.charAt(0).toUpperCase() + side.slice(1)}`
            : 'policeVerification';
        
        setUploadFiles(prev => ({ ...prev, [fieldName]: file }));
        showToast(`${file.name} selected`, 'info');
      }
    };
    input.click();
  };

  const handleNumberChange = (type, value) => {
    setDocumentNumbers(prev => ({ ...prev, [type]: value }));
  };

  const handleSaveDocuments = async () => {
    const hasFiles = Object.values(uploadFiles).some(f => f !== null);
    const hasNumbers = documentNumbers.aadhaarNumber || documentNumbers.drivingLicenseNumber;
    
    if (!hasFiles && !hasNumbers) {
      showToast('Please add document number or upload files', 'error');
      return;
    }

    setUploading(true);
    try {
      const response = await riderService.updateDocuments(documentNumbers, uploadFiles);
      
      if (response.success) {
        showToast('Documents saved successfully! Pending admin approval.', 'success');
        setUploadFiles({
          aadhaarFront: null,
          aadhaarBack: null,
          drivingLicenseFront: null,
          drivingLicenseBack: null,
          policeVerification: null
        });
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save documents', 'error');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-700';
      case 'Partial': return 'bg-yellow-100 text-yellow-700';
      case 'Uploaded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified': return <FaCheckCircle className="text-green-500" />;
      case 'Partial': return <FaClock className="text-yellow-500" />;
      case 'Uploaded': return <FaCheckCircle className="text-blue-500" />;
      default: return <FaTimesCircle className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Wallet */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Document Wallet</h3>
        
        <div className="space-y-6">
          {/* Aadhaar Card */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">Aadhaar Card</h4>
                {getStatusIcon(documents[0].status)}
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(documents[0].status)}`}>
                {documents[0].status}
              </span>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Aadhaar Number</label>
              <input
                type="text"
                value={documentNumbers.aadhaarNumber}
                onChange={(e) => handleNumberChange('aadhaarNumber', e.target.value)}
                placeholder="Enter 12-digit Aadhaar number"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                maxLength={12}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleFileSelect('aadhaar', 'front')}>
                <p className="text-xs text-gray-600">Front Side</p>
                <p className={`text-xs ${uploadFiles.aadhaarFront ? 'text-green-600' : documents[0].frontUploaded ? 'text-green-600' : 'text-gray-400'}`}>
                  {uploadFiles.aadhaarFront ? uploadFiles.aadhaarFront.name : documents[0].frontUploaded ? 'Uploaded' : 'Upload'}
                </p>
              </div>
              <div className="text-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleFileSelect('aadhaar', 'back')}>
                <p className="text-xs text-gray-600">Back Side</p>
                <p className={`text-xs ${uploadFiles.aadhaarBack ? 'text-green-600' : documents[0].backUploaded ? 'text-green-600' : 'text-gray-400'}`}>
                  {uploadFiles.aadhaarBack ? uploadFiles.aadhaarBack.name : documents[0].backUploaded ? 'Uploaded' : 'Upload'}
                </p>
              </div>
            </div>
          </div>

          {/* Driving License */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">Driving License</h4>
                {getStatusIcon(documents[1].status)}
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(documents[1].status)}`}>
                {documents[1].status}
              </span>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">License Number</label>
              <input
                type="text"
                value={documentNumbers.drivingLicenseNumber}
                onChange={(e) => handleNumberChange('drivingLicenseNumber', e.target.value)}
                placeholder="Enter license number"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleFileSelect('drivingLicense', 'front')}>
                <p className="text-xs text-gray-600">Front Side</p>
                <p className={`text-xs ${uploadFiles.drivingLicenseFront ? 'text-green-600' : documents[1].frontUploaded ? 'text-green-600' : 'text-gray-400'}`}>
                  {uploadFiles.drivingLicenseFront ? uploadFiles.drivingLicenseFront.name : documents[1].frontUploaded ? 'Uploaded' : 'Upload'}
                </p>
              </div>
              <div className="text-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleFileSelect('drivingLicense', 'back')}>
                <p className="text-xs text-gray-600">Back Side</p>
                <p className={`text-xs ${uploadFiles.drivingLicenseBack ? 'text-green-600' : documents[1].backUploaded ? 'text-green-600' : 'text-gray-400'}`}>
                  {uploadFiles.drivingLicenseBack ? uploadFiles.drivingLicenseBack.name : documents[1].backUploaded ? 'Uploaded' : 'Upload'}
                </p>
              </div>
            </div>
          </div>

          {/* Police Verification */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">Police Verification</h4>
                {getStatusIcon(documents[2].status)}
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(documents[2].status)}`}>
                {documents[2].status}
              </span>
            </div>
            
            <div className="text-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleFileSelect('policeVerification', 'front')}>
              <FaUpload className="mx-auto mb-1 text-gray-400" />
              <p className={`text-xs ${uploadFiles.policeVerification ? 'text-green-600' : documents[2].uploaded ? 'text-green-600' : 'text-gray-400'}`}>
                {uploadFiles.policeVerification ? uploadFiles.policeVerification.name : documents[2].uploaded ? 'View Uploaded' : 'Click to Upload'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSaveDocuments}
          disabled={uploading}
          className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <FaClock className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <FaUpload /> Save Documents
            </>
          )}
        </button>
      </div>

      {/* Cab Approval Status */}
      {cab && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Cab Approval Status</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              cab.isApproved ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Vehicle Approval</h4>
                <span className={`px-3 py-1 rounded text-sm ${
                  cab.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {cab.isApproved ? 'APPROVED' : 'PENDING'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {cab.isApproved 
                  ? 'Your vehicle is approved and ready for rides.'
                  : 'Your vehicle is pending approval. Please ensure all documents are uploaded.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Vehicle Type</p>
                <p className="font-semibold">{cab.cabType}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Vehicle Number</p>
                <p className="font-semibold">{cab.cabNumber}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Model</p>
                <p className="font-semibold">{cab.cabModel}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
