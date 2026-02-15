// frontend/src/pages/admin/ManagePayouts.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  CreditCard,
  User,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  BarChart,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const ManagePayouts = () => {
  const {
    payouts,
    loadPayouts,
    processPayout,
    bulkProcessPayouts
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [riderFilter, setRiderFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedPayouts, setSelectedPayouts] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [summary, setSummary] = useState({
    pendingTotal: 0,
    paidTotal: 0,
    totalAmount: 0
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPayouts();
  }, [currentPage, statusFilter]);

  const fetchPayouts = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: 10,
      status: statusFilter,
      riderId: riderFilter || undefined,
      startDate: dateRange.startDate || undefined,
      endDate: dateRange.endDate || undefined
    };
    
    const result = await loadPayouts(params);
    if (result?.summary) {
      setSummary(result.summary);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPayouts();
  };

  const handleProcessPayout = async (payoutId) => {
    const transactionId = prompt('Enter transaction ID:');
    if (!transactionId || !transactionId.trim()) {
      toast.error('Transaction ID is required');
      return;
    }

    const notes = prompt('Enter notes (optional):');
    
    if (await processPayout(payoutId, transactionId, notes || '')) {
      fetchPayouts();
    }
  };

  const handleBulkProcess = async () => {
    if (selectedPayouts.length === 0) {
      toast.error('Please select payouts to process');
      return;
    }

    const confirm = window.confirm(`Process ${selectedPayouts.length} payouts?`);
    if (!confirm) return;

    setBulkProcessing(true);
    
    const riderIds = [...new Set(selectedPayouts.map(p => p.riderId._id))];
    const startDate = new Date(Math.min(...selectedPayouts.map(p => new Date(p.createdAt))));
    const endDate = new Date(Math.max(...selectedPayouts.map(p => new Date(p.createdAt))));

    const result = await bulkProcessPayouts(riderIds, startDate, endDate);
    
    if (result) {
      setSelectedPayouts([]);
      fetchPayouts();
      toast.success(`Processed ${result.processed} payouts successfully`);
    }
    
    setBulkProcessing(false);
  };

  const handleDateFilter = () => {
    setCurrentPage(1);
    fetchPayouts();
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPayouts(payouts.filter(p => p.payoutStatus === 'PENDING'));
    } else {
      setSelectedPayouts([]);
    }
  };

  const handleSelectPayout = (payout, checked) => {
    if (checked) {
      setSelectedPayouts(prev => [...prev, payout]);
    } else {
      setSelectedPayouts(prev => prev.filter(p => p._id !== payout._id));
    }
  };

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
      PAID: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Payouts</h1>
        <p className="text-gray-600">Process rider earnings and payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payouts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(summary.pendingTotal)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {payouts.filter(p => p.payoutStatus === 'PENDING').length} riders waiting
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.paidTotal)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {payouts.filter(p => p.payoutStatus === 'PAID').length} payouts processed
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.totalAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Overall payout amount
              </p>
            </div>
            <BarChart className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPayouts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">
                {selectedPayouts.length} payouts selected
              </p>
              <p className="text-sm text-blue-700">
                Total: {formatCurrency(selectedPayouts.reduce((sum, p) => sum + p.riderEarning, 0))}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBulkProcess}
                disabled={bulkProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {bulkProcessing ? 'Processing...' : 'Process Selected'}
              </button>
              <button
                onClick={() => setSelectedPayouts([])}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="ALL">All</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rider ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter rider ID"
              value={riderFilter}
              onChange={(e) => setRiderFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <form onSubmit={handleSearch} className="flex-1 mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by rider name, booking ID..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex space-x-2">
            <button
              onClick={handleDateFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      <input
                        type="checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        checked={selectedPayouts.length === payouts.filter(p => p.payoutStatus === 'PENDING').length && payouts.filter(p => p.payoutStatus === 'PENDING').length > 0}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payout Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rider Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings Breakdown
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
                  {payouts.map((payout) => (
                    <tr key={payout._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {payout.payoutStatus === 'PENDING' && (
                          <input
                            type="checkbox"
                            checked={selectedPayouts.some(p => p._id === payout._id)}
                            onChange={(e) => handleSelectPayout(payout, e.target.checked)}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            Payout ID: {payout._id.slice(-8).toUpperCase()}
                          </div>
                          {payout.bookingId && (
                            <div className="text-sm text-gray-500">
                              Booking: #{payout.bookingId._id?.slice(-8).toUpperCase()}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(payout.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {payout.riderId && (
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium">{payout.riderId.name}</div>
                                <div className="text-xs text-gray-500">ID: {payout.riderId._id?.slice(-6)}</div>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-4 w-4 mr-2" />
                              {payout.riderId.phone}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="h-4 w-4 mr-2" />
                              {payout.riderId.email}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Fare:</span>
                            <span className="text-sm font-medium">₹{payout.totalFare}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Commission:</span>
                            <span className="text-sm text-blue-600">₹{payout.adminCommission}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-sm font-medium text-gray-900">Rider Earnings:</span>
                            <span className="text-sm font-bold text-green-600">₹{payout.riderEarning}</span>
                          </div>
                          {payout.payoutStatus === 'PAID' && payout.metadata?.transactionId && (
                            <div className="text-xs text-gray-500">
                              Txn: {payout.metadata.transactionId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.payoutStatus)}`}>
                          {payout.payoutStatus}
                        </span>
                        {payout.payoutStatus === 'PAID' && payout.metadata?.processedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(payout.metadata.processedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {payout.payoutStatus === 'PENDING' ? (
                          <button
                            onClick={() => handleProcessPayout(payout._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            Process
                          </button>
                        ) : (
                          <div className="text-gray-500">Processed</div>
                        )}
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
                  Showing {Math.min(payouts.length, 10)} of {payouts.length} payouts
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
                    disabled={payouts.length < 10}
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

      {/* Payment Methods Info */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Bank Transfer</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Transfer amount directly to rider's registered bank account
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Transaction Record</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Always record transaction ID for audit purposes
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900">Total Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {formatCurrency(summary.pendingTotal)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ready for processing</p>
            </div>
            
            <button
              onClick={handleBulkProcess}
              disabled={selectedPayouts.length === 0 || bulkProcessing}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkProcessing ? 'Processing...' : `Process ${selectedPayouts.length} Selected Payouts`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePayouts;