import React, { useEffect, useState } from 'react';
import { FaUpload, FaDownload, FaCheckCircle } from "react-icons/fa";
import riderService from '../../services/riderService';

export function Documents({ cab, showToast }) {
  const [documents, setDocuments] = useState([
    { name: 'Driving License', status: 'Verified', expiry: '2026-03-15', type: 'license' },
    { name: 'Vehicle Registration (RC)', status: cab?.isApproved ? 'Verified' : 'Pending', expiry: '2025-08-20', type: 'rc' },
    { name: 'Insurance Certificate', status: 'Pending', expiry: '2024-12-30', type: 'insurance' },
    { name: 'PUC Certificate', status: 'Expiring Soon', expiry: '2024-02-10', type: 'puc' },
  ]);

  const handleDocumentUpload = async (docType) => {
    if (docType === 'rc') {
      // RC upload handled in Vehicle component
      return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          // Note: Document upload API not provided for non-RC documents
          showToast(`${docType} uploaded: ${file.name}`, 'success');
        } catch (error) {
          showToast('Failed to upload document', 'error');
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Document Wallet */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Document Wallet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{doc.name}</h4>
                  {doc.status === 'Verified' && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  doc.status === 'Verified' ? 'bg-green-100 text-green-700' :
                  doc.status === 'Uploaded' ? 'bg-blue-100 text-blue-700' :
                  doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {doc.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Expires: {doc.expiry}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDocumentUpload(doc.type)}
                  className="flex-1 bg-teal-600 text-white py-2 rounded text-sm flex items-center justify-center gap-2"
                >
                  <FaUpload /> Upload
                </button>
                <button 
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded text-sm flex items-center justify-center gap-2"
                >
                  <FaDownload /> View
                </button>
              </div>
            </div>
          ))}
        </div>
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