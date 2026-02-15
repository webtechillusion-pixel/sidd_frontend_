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
  Clock
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import StatsCard from '../../components/admin/StatsCard';
import RecentBookings from '../../components/admin/RecentBookings';
// import RevenueChart from '../../components/admin/RevenueChart';

const AdminDashboard = () => {
  const {
    stats,
    loadDashboardStats,
    loadBookings,
    bookings
  } = useAdmin();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadDashboardStats();
      const result = await loadBookings({ page: 1, limit: 5 });
      if (result?.bookings) {
        setRecentBookings(result.bookings);
      }
      setLoading(false);
    };
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.users?.total || 0}
          change={stats?.users?.newToday || 0}
          changeText="today"
          icon={Users}
          color="blue"
        />
        
        <StatsCard
          title="Total Riders"
          value={stats?.riders?.total || 0}
          change={stats?.riders?.online || 0}
          changeText="online"
          icon={Car}
          color="green"
        />
        
        <StatsCard
          title="Today's Bookings"
          value={stats?.bookings?.today || 0}
          change={stats?.bookings?.week || 0}
          changeText="this week"
          icon={Calendar}
          color="purple"
        />
        
        <StatsCard
          title="Monthly Revenue"
          value={`₹${(stats?.revenue?.total || 0).toLocaleString()}`}
          change={`₹${(stats?.revenue?.commission || 0).toLocaleString()}`}
          changeText="commission"
          icon={CreditCard}
          color="orange"
        />
      </div>

      {/* Rider Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Approved Riders</p>
              <p className="text-2xl font-bold">{stats?.riders?.approved || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Riders</p>
              <p className="text-2xl font-bold">{stats?.riders?.pending || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Suspended</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">{stats?.users?.active || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <UserCheck className="h-5 w-5 text-green-600 mr-2" />
            <span>Approve Pending Riders</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
            <span>Process Payouts</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;