// frontend/src/pages/admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  User,
  Users,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Shield,
  Download,
  Activity
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const {
    users,
    loadUsers,
    updateUserStatus
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter, verificationFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: 10,
      isActive: statusFilter !== 'ALL' ? (statusFilter === 'ACTIVE') : undefined,
      isEmailVerified: verificationFilter !== 'ALL' ? (verificationFilter === 'VERIFIED') : undefined,
      search: searchTerm || undefined
    };
    
    const result = await loadUsers(params);
    if (result?.pagination) {
      setPagination(result.pagination);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleStatusToggle = async (userId, isActive) => {
    if (await updateUserStatus(userId, isActive)) {
      fetchUsers();
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-600">Manage customer accounts and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Total Users</p>
              <p className="text-2xl font-bold truncate">{pagination.total || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500 flex-shrink-0 ml-4" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Active Users</p>
              <p className="text-2xl font-bold truncate">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500 flex-shrink-0 ml-4" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Verified Users</p>
              <p className="text-2xl font-bold truncate">
                {users.filter(u => u.isEmailVerified).length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-500 flex-shrink-0 ml-4" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Google Users</p>
              <p className="text-2xl font-bold truncate">
                {users.filter(u => u.googleId).length}
              </p>
            </div>
            <User className="h-8 w-8 text-orange-500 flex-shrink-0 ml-4" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-4">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
            >
              <option value="ALL">All Verification</option>
              <option value="VERIFIED">Verified</option>
              <option value="UNVERIFIED">Unverified</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.photo}
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="font-medium text-gray-600">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                            <div className="text-sm text-gray-500 truncate">
                              ID: {user._id?.slice(-6)}
                              {user.googleId && (
                                <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-1 rounded">Google</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-sm font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${user.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className={`text-sm ${user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                              {user.isEmailVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Role: <span className="font-medium capitalize">{user.role || 'USER'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            {formatDate(user.createdAt)}
                          </div>
                          {user.lastLogin && (
                            <div className="text-xs text-gray-500">
                              Last login: {formatDate(user.lastLogin)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          
                          {user.isActive ? (
                            <button
                              onClick={() => handleStatusToggle(user._id, false)}
                              className="text-red-600 hover:text-red-900"
                              title="Deactivate"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusToggle(user._id, true)}
                              className="text-green-600 hover:text-green-900"
                              title="Activate"
                            >
                              <CheckCircle className="h-5 w-5" />
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, pagination.total)}
                  </span> of{' '}
                  <span className="font-medium">{pagination.total}</span> users
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
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsDetailsModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        User Details
                      </h3>
                      <button onClick={() => setIsDetailsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                        <XCircle className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Profile Header */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        {selectedUser.photo ? (
                          <img
                            className="h-20 w-20 rounded-full object-cover flex-shrink-0"
                            src={selectedUser.photo}
                            alt={selectedUser.name}
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-medium text-gray-600">
                              {selectedUser.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xl font-bold text-gray-900 truncate">{selectedUser.name}</h4>
                          <p className="text-gray-600 truncate">{selectedUser.email}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {selectedUser.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${selectedUser.isEmailVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {selectedUser.isEmailVerified ? 'Verified' : 'Unverified'}
                            </span>
                            {selectedUser.googleId && (
                              <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                                Google User
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* User Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">User ID</label>
                            <p className="mt-1 text-sm text-gray-900 truncate">{selectedUser._id}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedUser.phone}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Role</label>
                            <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.role}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {formatDate(selectedUser.createdAt)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Last Login</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Account Status</label>
                            <div className="mt-1">
                              <button
                                onClick={() => {
                                  handleStatusToggle(selectedUser._id, !selectedUser.isActive);
                                  setIsDetailsModalOpen(false);
                                }}
                                className={`px-3 py-1 text-sm rounded-md ${selectedUser.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                              >
                                {selectedUser.isActive ? 'Deactivate Account' : 'Activate Account'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Additional Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Notification Token</label>
                            <p className="mt-1 text-sm text-gray-900 truncate">
                              {selectedUser.notificationToken || 'Not set'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Account Created</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(selectedUser.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            toast.info('Send notification feature coming soon');
                          }}
                          className="w-full sm:flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Send Notification
                        </button>
                        <button
                          onClick={() => {
                            toast.info('Password reset feature coming soon');
                          }}
                          className="w-full sm:flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;