// frontend/src/pages/admin/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Car,
  Calendar,
  DollarSign,
  BarChart,
  PieChart,
  Download,
  Filter,
  Clock,
  MapPin
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminAnalytics = () => {
  const {
    getAnalytics,
    stats
  } = useAdmin();

  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [period, setPeriod] = useState('month');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const data = await getAnalytics(period);
    if (data) {
      setAnalyticsData(data);
    }
    setLoading(false);
  };

  // Revenue Chart Data
  const revenueChartData = {
    labels: analyticsData?.revenue?.map(r => r._id) || [],
    datasets: [
      {
        label: 'Revenue',
        data: analyticsData?.revenue?.map(r => r.amount) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Booking Trends Chart Data
  const bookingChartData = {
    labels: analyticsData?.trends?.map(t => t._id) || [],
    datasets: [
      {
        label: 'Bookings',
        data: analyticsData?.trends?.map(t => t.count) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      }
    ]
  };

  // Cab Type Distribution Data
  const cabDistributionData = {
    labels: analyticsData?.cabDistribution?.map(c => c._id) || [],
    datasets: [
      {
        data: analyticsData?.cabDistribution?.map(c => c.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Platform performance and insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="day">Last 30 Days</option>
            <option value="week">Last 12 Weeks</option>
            <option value="month">Last 12 Months</option>
            <option value="year">Last 5 Years</option>
          </select>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-5 w-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Total Revenue</p>
              <p className="text-2xl font-bold truncate">
                {formatCurrency(analyticsData?.trends?.reduce((sum, t) => sum + t.revenue, 0) || 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4 flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Total Bookings</p>
              <p className="text-2xl font-bold truncate">
                {analyticsData?.trends?.reduce((sum, t) => sum + t.count, 0) || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-4 flex-shrink-0">
              <Car className="h-6 w-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Avg Ride Distance</p>
              <p className="text-2xl font-bold truncate">
                {analyticsData?.avgDistance || '0'} km
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-4 flex-shrink-0">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Avg Ride Duration</p>
              <p className="text-2xl font-bold truncate">
                {analyticsData?.avgDuration || '0'} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-sm rounded-md ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm rounded-md ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Bar
              </button>
            </div>
          </div>
          <div className="h-80 w-full">
            {chartType === 'line' ? (
              <Line data={revenueChartData} options={chartOptions} />
            ) : (
              <Bar data={revenueChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Booking Trends Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
            </div>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
              <option>By Count</option>
              <option>By Revenue</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <Bar data={bookingChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Cab Distribution and Top Riders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cab Type Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <PieChart className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Cab Type Distribution</h3>
            </div>
            <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </div>
          <div className="h-64 w-full">
            <Pie data={cabDistributionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                }
              }
            }} />
          </div>
        </div>

        {/* Top Riders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Riders</h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData?.topRiders?.slice(0, 5).map((rider, index) => (
              <div key={index} className="flex flex-wrap items-center justify-between p-3 hover:bg-gray-50 rounded-lg gap-2">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-medium">
                      {rider.rider?.name?.charAt(0) || 'R'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{rider.rider?.name || 'Unknown Rider'}</p>
                    <p className="text-xs text-gray-500 truncate">{rider.rider?.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-600">
                    {formatCurrency(rider.totalEarnings)}
                  </p>
                  <p className="text-xs text-gray-500">{rider.totalRides} rides</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between flex-wrap gap-2">
              <span className="text-gray-600">Rider Acceptance Rate</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="flex justify-between flex-wrap gap-2">
              <span className="text-gray-600">User Satisfaction</span>
              <span className="font-medium">4.7/5</span>
            </div>
            <div className="flex justify-between flex-wrap gap-2">
              <span className="text-gray-600">On-time Arrival</span>
              <span className="font-medium">92%</span>
            </div>
            <div className="flex justify-between flex-wrap gap-2">
              <span className="text-gray-600">Cancellation Rate</span>
              <span className="font-medium text-red-600">3.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
          <div className="space-y-3">
            {[
              { time: '8:00 AM - 10:00 AM', percentage: 85 },
              { time: '12:00 PM - 2:00 PM', percentage: 65 },
              { time: '5:00 PM - 8:00 PM', percentage: 95 },
              { time: '10:00 PM - 12:00 AM', percentage: 45 }
            ].map((peak, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{peak.time}</span>
                  <span>{peak.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${peak.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h3>
          <div className="space-y-3">
            {[
              { from: 'Airport', to: 'City Center', count: 245 },
              { from: 'CBD', to: 'Residential', count: 189 },
              { from: 'Mall', to: 'Hotel', count: 156 },
              { from: 'Station', to: 'Office', count: 132 }
            ].map((route, index) => (
              <div key={index} className="flex flex-wrap items-center justify-between p-2 hover:bg-gray-50 rounded gap-2">
                <div className="flex items-center min-w-0">
                  <MapPin className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">{route.from}</span>
                  <span className="mx-2 flex-shrink-0">→</span>
                  <MapPin className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">{route.to}</span>
                </div>
                <span className="text-sm font-medium flex-shrink-0">{route.count} rides</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Platform Activity</h3>
        <div className="space-y-4 min-w-max w-full">
          {[
            { action: 'New rider registration', user: 'Rahul Sharma', time: '10 minutes ago', type: 'success' },
            { action: 'Booking completed', user: 'Priya Singh', time: '25 minutes ago', type: 'info' },
            { action: 'Payout processed', user: 'Amit Kumar', amount: '₹1,250', time: '1 hour ago', type: 'warning' },
            { action: 'User account deactivated', user: 'Rohan Mehta', time: '2 hours ago', type: 'error' },
            { action: 'New cab approved', user: 'Driver Raj', time: '3 hours ago', type: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex flex-wrap items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 gap-2">
              <div className="flex items-center min-w-0">
                <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    by {activity.user} {activity.amount && `• ${activity.amount}`}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;