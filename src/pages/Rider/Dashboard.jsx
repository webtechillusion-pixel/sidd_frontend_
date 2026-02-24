import React, { useEffect, useState } from 'react';
import { FaMoneyBill, FaCar, FaCheckCircle, FaStar, FaArrowUp, FaClock, FaWallet } from "react-icons/fa";
import { StatCard } from './Cards';
import { WeeklyChart, HourlyChart } from './Charts';
import riderService from '../../services/riderService';

export function Dashboard({ stats, profile, cab, liveEarnings }) {
  const [dashboardData, setDashboardData] = useState({
    todayEarnings: 0,
    totalEarnings: 0,
    totalRides: 0,
    walletBalance: 0,
    weeklyEarnings: [],
    monthlyEarnings: [],
    recentEarnings: [],
    paymentHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Update dashboard with profile data as fallback
    if (profile?.completedRides > 0 || liveEarnings > 0) {
      setDashboardData(prev => ({
        ...prev,
        totalRides: prev.totalRides || profile?.completedRides || 0,
        walletBalance: prev.walletBalance || liveEarnings || profile?.walletBalance || 0,
        todayEarnings: prev.todayEarnings || liveEarnings || 0
      }));
    }
  }, [profile, liveEarnings]);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await riderService.getEarnings({
        startDate: thirtyDaysAgo,
        endDate: today,
        page: 1,
        limit: 20
      });

      console.log('Dashboard earnings response:', response);

      // Handle different response structures
      let earnings = [];
      let summary = {};
      
      if (response.success && response.data) {
        earnings = response.data.earnings || [];
        summary = response.data.summary || {};
      } else if (response.earnings) {
        // Alternative response format
        earnings = response.earnings;
        summary = response.summary || {};
      }

      // Calculate today's earnings from individual earnings
      const todayEarnings = earnings
        .filter(e => {
          const earningDate = new Date(e.createdAt).toISOString().split('T')[0];
          return earningDate === today;
        })
        .reduce((sum, e) => sum + (e.riderEarning || 0), 0);

      // Calculate total earnings
      const totalEarnings = earnings.reduce((sum, e) => sum + (e.riderEarning || 0), 0);

      // Calculate total rides (completed)
      const totalRides = earnings.length;

      setDashboardData({
        todayEarnings: todayEarnings || 0,
        totalEarnings: summary.totalEarnings || totalEarnings || 0,
        totalRides: summary.totalRides || totalRides || profile?.completedRides || 0,
        walletBalance: summary.walletBalance || liveEarnings || profile?.walletBalance || 0,
        weeklyEarnings: response.data?.charts?.weeklyEarnings || [],
        monthlyEarnings: response.data?.charts?.monthlyEarnings || [],
        recentEarnings: earnings.slice(0, 5),
        paymentHistory: earnings
      });

      console.log('Dashboard data set:', {
        todayEarnings,
        totalEarnings,
        totalRides,
        earningsCount: earnings.length,
        summary,
        profileCompletedRides: profile?.completedRides
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      )}
      
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard 
              title="Today's Earnings" 
              value={`₹${Number(dashboardData.todayEarnings || liveEarnings || 0).toFixed(1)}`} 
              icon={<FaMoneyBill className="text-green-500" />}
            />
            <StatCard 
              title="Total Earnings" 
              value={`₹${Number(dashboardData.totalEarnings || 0).toFixed(1)}`} 
              icon={<FaMoneyBill className="text-purple-500" />}
            />
            <StatCard 
              title="Total Rides" 
              value={dashboardData.totalRides || profile?.completedRides || 0} 
              icon={<FaCar className="text-blue-500" />}
            />
            <StatCard 
              title="Acceptance Rate" 
              value={`${Number(stats?.acceptance || profile?.acceptanceRate || 0).toFixed(1)}%`} 
              icon={<FaCheckCircle className="text-teal-500" />}
            />
            <StatCard 
              title="Rating" 
              value={`${profile?.overallRating || stats?.rating || 0} (${profile?.totalRatings || stats?.totalRatings || 0})`}
              icon={<FaStar className="text-yellow-500" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaArrowUp className="text-green-500" />
                Weekly Earnings
              </h3>
              <WeeklyChart data={dashboardData.weeklyEarnings} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Rides by Hour
              </h3>
              <HourlyChart data={stats?.hourlyData || []} />
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="font-semibold text-green-600">
                  {stats?.performance?.completionRate || 0}%
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="font-semibold">
                    {profile?.avgResponseTime || 0} min
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  <p className="font-semibold">
                    {profile?.overallRating || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Wallet Balance</p>
                  <p className="font-semibold text-green-600">
                    ₹{dashboardData.walletBalance || liveEarnings || 0}
                  </p>
                </div>
              </div>
            </div>

          {/* Vehicle Status */}
          {cab && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Vehicle Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Vehicle Type</p>
                  <p className="font-semibold">{cab.cabType}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Number</p>
                  <p className="font-semibold">{cab.cabNumber}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-semibold ${cab.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {profile?.availabilityStatus === "ON_TRIP" ? "Busy" : "Available"}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Approval</p>
                  <p className={`font-semibold ${cab.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                    {cab.isApproved ? 'Approved' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Earnings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Earnings</h3>
            <div className="space-y-3">
              {dashboardData.recentEarnings.map((earning) => (
                <div key={earning._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <FaMoneyBill className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(earning.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{Number(earning.riderEarning || 0).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      earning.payoutStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      earning.payoutStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {earning.payoutStatus}
                    </span>
                  </div>
                </div>
              ))}
              {dashboardData.recentEarnings.length === 0 && (
                <p className="text-center text-gray-500 py-4">No recent earnings</p>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaWallet className="text-purple-500" />
              Payment History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm">Date</th>
                    <th className="text-left py-3 px-4 text-sm">Booking ID</th>
                    <th className="text-left py-3 px-4 text-sm">Total Fare</th>
                    <th className="text-left py-3 px-4 text-sm">Your Earning</th>
                    <th className="text-left py-3 px-4 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.paymentHistory.map((payment) => (
                    <tr key={payment._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono">
                        #{payment.bookingId?._id?.slice(-8) || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">₹{Number(payment.totalFare || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 font-semibold text-green-600 text-sm">
                        ₹{Number(payment.riderEarning || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.payoutStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          payment.payoutStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.payoutStatus || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {dashboardData.paymentHistory.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500 text-sm">
                        No payment history
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}