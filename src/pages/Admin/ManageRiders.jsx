// frontend/src/pages/admin/ManageRiders.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Mail,
  Phone
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import StatusBadge from '../../components/admin/StatusBadge';
import RiderDetailsModal from '../../components/admin/RiderDetailsModal';
import { toast } from 'react-toastify';

const ManageRiders = () => {
  const {
    riders,
    loadRiders,
    handleRiderApproval,
    suspendRider
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });

  useEffect(() => {
    fetchRiders();
  }, [currentPage, statusFilter]);

  const fetchRiders = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: 10,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      search: searchTerm || undefined
    };
    
    const paginationData = await loadRiders(params);
    if (paginationData) {
      setTotalPages(paginationData.totalPages);
      setPagination({
        total: paginationData.total,
        limit: paginationData.limit
      });
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRiders();
  };

  const handleApprove = async (riderId) => {
    if (await handleRiderApproval(riderId, 'APPROVE')) {
      fetchRiders();
    }
  };

  const handleReject = async (riderId) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason && reason.trim()) {
      if (await handleRiderApproval(riderId, 'REJECT', reason)) {
        fetchRiders();
      }
    }
  };

  const handleSuspend = async (riderId) => {
    const reason = prompt('Please enter suspension reason:');
    if (reason && reason.trim()) {
      if (await suspendRider(riderId, reason)) {
        fetchRiders();
      }
    }
  };

  const handleViewDetails = (rider) => {
    setSelectedRider(rider);
    setIsDetailsModalOpen(true);
  };

  const filteredRiders = riders.filter(rider => {
    if (statusFilter === 'ALL') return true;
    return rider.approvalStatus === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Riders</h1>
        <p className="text-gray-600">Review and manage rider registrations</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search riders by name, email, or phone..."
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
              <option value="SUSPENDED">Suspended</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              <span>More Filters</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Riders Table */}
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
                      Rider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRiders.map((rider) => (
                    <tr key={rider._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {rider.photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={rider.photo}
                                alt={rider.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="font-medium text-gray-600">
                                  {rider.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                            <div className="text-sm text-gray-500">ID: {rider._id?.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {rider.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {rider.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={rider.approvalStatus} />
                        {rider.availabilityStatus === 'ACTIVE' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rider.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(rider)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          
                          {rider.approvalStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(rider._id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleReject(rider._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          
                          {rider.approvalStatus === 'APPROVED' && (
                            <button
                              onClick={() => handleSuspend(rider._id)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Suspend"
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
                    {Math.min(currentPage * 10, pagination.total)}
                  </span> of{' '}
                  <span className="font-medium">{pagination.total}</span> riders
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">{riders.length}</div>
          <div className="text-sm text-blue-600">Total Riders</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-700">
            {riders.filter(r => r.approvalStatus === 'PENDING').length}
          </div>
          <div className="text-sm text-yellow-600">Pending Approval</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">
            {riders.filter(r => r.approvalStatus === 'APPROVED').length}
          </div>
          <div className="text-sm text-green-600">Approved</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-700">
            {riders.filter(r => r.approvalStatus === 'REJECTED').length}
          </div>
          <div className="text-sm text-red-600">Rejected</div>
        </div>
      </div>

      {/* Rider Details Modal */}
      {selectedRider && (
        <RiderDetailsModal
          rider={selectedRider}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onApprove={() => {
            handleApprove(selectedRider._id);
            setIsDetailsModalOpen(false);
          }}
          onReject={() => {
            handleReject(selectedRider._id);
            setIsDetailsModalOpen(false);
          }}
          onSuspend={() => {
            handleSuspend(selectedRider._id);
            setIsDetailsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ManageRiders;