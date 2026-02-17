// frontend/src/pages/admin/ManageCabs.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Car,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  Shield,
  Download
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import StatusBadge from '../../components/admin/StatusBadge';
import AddCabModal from '../../components/admin/AddCabModal';
import { toast } from 'react-toastify';

const ManageCabs = () => {
  const {
    cabs,
    riders,
    loadCabs,
    loadRiders,
    handleCabApproval,
    createCab
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cabTypeFilter, setCabTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedCab, setSelectedCab] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCabs();
    loadRiders({ limit: 100, status: 'APPROVED' });
  }, [currentPage, statusFilter, cabTypeFilter]);

  const fetchCabs = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: 10,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      search: searchTerm || undefined
    };
    
    const paginationData = await loadCabs(params);
    if (paginationData) {
      setTotalPages(paginationData.totalPages);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCabs();
  };

  const handleApprove = async (cabId) => {
    if (await handleCabApproval(cabId, 'APPROVE')) {
      toast.success('Cab approved successfully');
      fetchCabs();
    }
  };

  const handleReject = async (cabId) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason && reason.trim()) {
      if (await handleCabApproval(cabId, 'REJECT', reason)) {
        toast.success('Cab rejected successfully');
        fetchCabs();
      }
    }
  };

  const handleViewDetails = (cab) => {
    setSelectedCab(cab);
    setIsDetailsModalOpen(true);
  };

  const getCabTypeColor = (type) => {
    const colors = {
      HATCHBACK: 'bg-blue-100 text-blue-800',
      SEDAN: 'bg-green-100 text-green-800',
      SUV: 'bg-purple-100 text-purple-800',
      PREMIUM: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredCabs = cabs.filter(cab => {
    if (statusFilter === 'ALL' && cabTypeFilter === 'ALL') return true;
    if (statusFilter !== 'ALL' && cab.approvalStatus !== statusFilter) return false;
    if (cabTypeFilter !== 'ALL' && cab.cabType !== cabTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Cabs</h1>
        <p className="text-gray-600">Review and manage cab registrations</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by cab number, model, or rider name..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={cabTypeFilter}
              onChange={(e) => setCabTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="HATCHBACK">Hatchback</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="PREMIUM">Premium</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Car className="h-5 w-5" />
              <span>Add Cab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cabs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cab Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rider & Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specifications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCabs.map((cab) => (
                    <tr key={cab._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Car className="h-5 w-5 mr-2 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">{cab.cabNumber}</div>
                              <div className="text-sm text-gray-500">{cab.cabModel}</div>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCabTypeColor(cab.cabType)}`}>
                            {cab.cabType}
                          </span>
                          <div className="text-sm text-gray-500">
                            Registered: {new Date(cab.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {cab.riderId && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium">{cab.riderId.name}</div>
                                <div className="text-xs text-gray-500">{cab.riderId.phone}</div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            <span>{cab.images?.length || 0} images</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Shield className="h-4 w-4 mr-2" />
                            <span>Docs: {[
                              cab.rcImage?.front && 'RC',
                              cab.insuranceImage?.front && 'Insurance',
                              cab.permitImage && 'Permit',
                              cab.fitnessImage && 'Fitness'
                            ].filter(Boolean).length}/4</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-gray-500">Seats: </span>
                            <span className="font-medium">{cab.seatingCapacity}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">AC: </span>
                            <span className={`font-medium ${cab.acAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {cab.acAvailable ? 'Available' : 'Not Available'}
                            </span>
                          </div>
                          {cab.yearOfManufacture && (
                            <div>
                              <span className="text-gray-500">Year: </span>
                              <span className="font-medium">{cab.yearOfManufacture}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Available: </span>
                            <span className={`font-medium ${cab.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {cab.isAvailable ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={cab.approvalStatus} />
                        {cab.isApproved && (
                          <div className="mt-1 text-xs text-gray-500">
                            Approved: {cab.approvedAt ? new Date(cab.approvedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        )}
                        {cab.rejectionReason && (
                          <div className="mt-1 text-xs text-red-500">
                            Reason: {cab.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(cab)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          
                          {cab.approvalStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(cab._id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleReject(cab._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          
                          {cab.approvalStatus === 'APPROVED' && !cab.isAvailable && (
                            <button
                              onClick={() => toast.info('Make cab available from rider app')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Mark Available"
                            >
                              <AlertCircle className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, filteredCabs.length)}
                  </span> of{' '}
                  <span className="font-medium">{filteredCabs.length}</span> cabs
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{cabs.length}</div>
          <div className="text-sm text-gray-600">Total Cabs</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {cabs.filter(c => c.approvalStatus === 'PENDING').length}
          </div>
          <div className="text-sm text-gray-600">Pending Approval</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {cabs.filter(c => c.approvalStatus === 'APPROVED').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {cabs.filter(c => c.isAvailable).length}
          </div>
          <div className="text-sm text-gray-600">Currently Available</div>
        </div>
      </div>

      {/* Cab Details Modal */}
      {isDetailsModalOpen && selectedCab && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
            onClick={() => {
              setIsDetailsModalOpen(false);
              setSelectedCab(null);
            }}
          ></div>
          
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Cab Details - {selectedCab.cabNumber}
                      </h3>
                      <button 
                        onClick={() => {
                          setIsDetailsModalOpen(false);
                          setSelectedCab(null);
                        }} 
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XCircle className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cab Number:</span>
                              <span className="font-medium">{selectedCab.cabNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Model:</span>
                              <span className="font-medium">{selectedCab.cabModel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCabTypeColor(selectedCab.cabType)}`}>
                                {selectedCab.cabType}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Seating Capacity:</span>
                              <span className="font-medium">{selectedCab.seatingCapacity} persons</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">AC:</span>
                              <span className={`font-medium ${selectedCab.acAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedCab.acAvailable ? 'Available' : 'Not Available'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rider Information */}
                        {selectedCab.riderId && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Rider Information</h4>
                            <div className="mt-2 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium">{selectedCab.riderId.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium">{selectedCab.riderId.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">{selectedCab.riderId.email}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Status Information */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Status Information</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Approval Status:</span>
                              <StatusBadge status={selectedCab.approvalStatus} />
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Availability:</span>
                              <span className={`font-medium ${selectedCab.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedCab.isAvailable ? 'Available' : 'Not Available'}
                              </span>
                            </div>
                            {selectedCab.approvedAt && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Approved On:</span>
                                <span className="font-medium">{new Date(selectedCab.approvedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            {selectedCab.rejectionReason && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Rejection Reason:</span>
                                <span className="font-medium text-red-600">{selectedCab.rejectionReason}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Document Status */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Document Status</h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">RC Book:</span>
                              <span className={`text-xs px-2 py-1 rounded ${selectedCab.rcImage?.front ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {selectedCab.rcImage?.front ? 'Uploaded' : 'Missing'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Insurance:</span>
                              <span className={`text-xs px-2 py-1 rounded ${selectedCab.insuranceImage?.front ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {selectedCab.insuranceImage?.front ? 'Uploaded' : 'Missing'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Permit:</span>
                              <span className={`text-xs px-2 py-1 rounded ${selectedCab.permitImage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {selectedCab.permitImage ? 'Uploaded' : 'Missing'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Fitness:</span>
                              <span className={`text-xs px-2 py-1 rounded ${selectedCab.fitnessImage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {selectedCab.fitnessImage ? 'Uploaded' : 'Missing'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Images Preview */}
                    {selectedCab.images && selectedCab.images.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Cab Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {selectedCab.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.url}
                                alt={`Cab ${image.type}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                                  {image.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {selectedCab.approvalStatus === 'PENDING' && (
                      <div className="mt-6 flex space-x-3">
                        <button
                          onClick={() => {
                            handleApprove(selectedCab._id);
                            setIsDetailsModalOpen(false);
                          }}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Approve Cab
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason && reason.trim()) {
                              handleReject(selectedCab._id, reason);
                              setIsDetailsModalOpen(false);
                            }
                          }}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject Cab
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Cab Modal */}
      {isAddModalOpen && (
        <AddCabModal 
          riders={riders}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchCabs();
          }}
        />
      )}
    </div>
  );
};

export default ManageCabs;