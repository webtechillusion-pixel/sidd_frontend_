// frontend/src/pages/admin/ManageBookings.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Car,
  Clock,
  DollarSign,
  MoreVertical,
  Eye,
  Download
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import StatusBadge from '../../components/admin/StatusBadge';
import BookingDetailsModal from '../../components/admin/BookingDetailsModal';

const ManageBookings = () => {
  const {
    bookings,
    loadBookings,
    stats: bookingStats
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tripTypeFilter, setTripTypeFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter, tripTypeFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: 10,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      tripType: tripTypeFilter !== 'ALL' ? tripTypeFilter : undefined,
      startDate: dateRange.startDate || undefined,
      endDate: dateRange.endDate || undefined,
      search: searchTerm || undefined
    };
    
    await loadBookings(params);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBookings();
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleDateFilter = () => {
    setCurrentPage(1);
    fetchBookings();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="text-gray-600">View and manage all bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Total Bookings</p>
              <p className="text-2xl font-bold truncate">{bookingStats?.bookings?.total || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500 flex-shrink-0 ml-4" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Today's Bookings</p>
              <p className="text-2xl font-bold truncate">{bookingStats?.bookings?.today || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-green-500 flex-shrink-0 ml-4" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Revenue</p>
              <p className="text-2xl font-bold truncate">
                {formatCurrency(bookingStats?.revenue?.totalRevenue || 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500 flex-shrink-0 ml-4" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Commission</p>
              <p className="text-2xl font-bold truncate">
                {formatCurrency(bookingStats?.revenue?.commission || 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-500 flex-shrink-0 ml-4" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={tripTypeFilter}
              onChange={(e) => setTripTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="ONE_WAY">One Way</option>
              <option value="ROUND_TRIP">Round Trip</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <form onSubmit={handleSearch} className="w-full sm:flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking ID, user name, or rider name..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={handleDateFilter}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
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
                      Booking Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User & Rider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trip Info
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
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            #{booking._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.bookingType} • {booking.tripType}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{booking.userId?.name}</div>
                              <div className="text-xs text-gray-500 truncate">{booking.userId?.phone}</div>
                            </div>
                          </div>
                          {booking.riderId && (
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-sm font-medium truncate">{booking.riderId?.name}</div>
                                <div className="text-xs text-gray-500 truncate">{booking.riderId?.phone}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2 min-w-[200px]">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm min-w-0">
                              <div className="font-medium">Pickup</div>
                              <div className="text-gray-500 truncate max-w-xs">
                                {booking.pickup?.addressText}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm min-w-0">
                              <div className="font-medium">Drop</div>
                              <div className="text-gray-500 truncate max-w-xs">
                                {booking.drop?.addressText}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Distance: </span>
                            <span className="font-medium">{booking.distanceKm} km</span>
                            <span className="mx-2">•</span>
                            <span className="text-gray-500">Fare: </span>
                            <span className="font-medium">{formatCurrency(booking.estimatedFare)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={booking.bookingStatus} />
                        <div className="mt-1 text-xs text-gray-500">
                          {booking.paymentType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                          >
                            <Eye className="h-4 w-4 inline mr-1" />
                            View
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-5 w-5" />
                          </button>
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
                  Showing {Math.min(bookings.length, 10)} of {bookings.length} bookings
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
                    Page {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={bookings.length < 10}
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageBookings;