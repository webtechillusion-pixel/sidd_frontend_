// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Users,
  Car,
  Calendar,
  CreditCard,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import StatsCard from '../../components/admin/StatsCard';
import RecentBookings from '../../components/admin/RecentBookings';
// import RevenueChart from '../../components/admin/RevenueChart';

// Helper to safely get nested values
const getNestedValue = (obj, path, defaultValue = 0) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  return obj[path] ?? defaultValue;
};

const AdminDashboard = () => {
  const {
    stats,
    loadDashboardStats,
    loadBookings,
    bookings
  } = useAdmin();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      await loadDashboardStats();
      const result = await loadBookings({ page: 1, limit: 5 });
      if (result?.bookings) {
        setRecentBookings(result.bookings);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={getNestedValue(stats, 'users.total', 0)}
          change={getNestedValue(stats, 'users.newToday', 0)}
          changeText="today"
          icon={Users}
          color="blue"
        />
        
        <StatsCard
          title="Total Riders"
          value={getNestedValue(stats, 'riders.total', 0)}
          change={getNestedValue(stats, 'riders.online', 0)}
          changeText="online"
          icon={Car}
          color="green"
        />
        
        <StatsCard
          title="Today's Bookings"
          value={getNestedValue(stats, 'bookings.today', 0)}
          change={getNestedValue(stats, 'bookings.week', 0)}
          changeText="this week"
          icon={Calendar}
          color="purple"
        />
        
        <StatsCard
          title="Monthly Revenue"
          value={`₹${(getNestedValue(stats, 'revenue.total', 0)).toLocaleString()}`}
          change={getNestedValue(stats, 'revenue.commission', 0)}
          changeText="commission"
          icon={CreditCard}
          color="orange"
        />
      </div>

      {/* Rider Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 min-w-0">
              <p className="text-sm text-gray-500 truncate">Approved Riders</p>
              <p className="text-2xl font-bold truncate">{getNestedValue(stats, 'riders.approved', 0)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4 min-w-0">
              <p className="text-sm text-gray-500 truncate">Pending Riders</p>
              <p className="text-2xl font-bold truncate">{getNestedValue(stats, 'riders.pending', 0)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4 min-w-0">
              <p className="text-sm text-gray-500 truncate">Suspended</p>
              <p className="text-2xl font-bold truncate">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4 min-w-0">
              <p className="text-sm text-gray-500 truncate">Active Users</p>
              <p className="text-2xl font-bold truncate">{getNestedValue(stats, 'users.active', 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 w-full sm:w-auto">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          {/* <RevenueChart /> */}
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>
          <RecentBookings bookings={recentBookings} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <UserCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
            <span className="truncate">Approve Pending Riders</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <CreditCard className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
            <span className="truncate">Process Payouts</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
            <span className="truncate">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;