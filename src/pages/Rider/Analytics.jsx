import React, { useEffect, useState } from 'react';
import { FaStar, FaClock, FaMapMarkerAlt, FaCheckCircle, FaCalculator, FaChartLine, FaArrowUp, FaCar } from "react-icons/fa";
import { MetricCard } from './Cards';
import { PeakHoursChart } from './Charts';
import riderService from '../../services/riderService';

export function Analytics({ stats }) {
  const [analyticsData, setAnalyticsData] = useState({
    ratings: [],
    ratingsSummary: {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: []
    },
    earnings: {
      totalEarnings: 0,
      totalCommission: 0,
      walletBalance: 0,
      totalRides: 0,
      weeklyEarnings: [],
      monthlyEarnings: []
    },
    performance: {
      acceptanceRate: 0,
      cancellationRate: 0,
      completionRate: 0,
      averageResponseTime: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch ratings data
      const ratingsPromise = riderService.getRatings().catch(err => {
        console.warn('Ratings API failed:', err);
        return { success: false, data: { ratings: [], summary: {} } };
      });

      // Fetch earnings data for analytics
      const earningsPromise = riderService.getEarnings({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
        endDate: new Date().toISOString().split('T')[0],
        page: 1,
        limit: 100
      }).catch(err => {
        console.warn('Earnings API failed:', err);
        return { success: false, data: { earnings: [], summary: {} } };
      });

      const [ratingsResponse, earningsResponse] = await Promise.all([
        ratingsPromise,
        earningsPromise
      ]);

      // Process ratings data
      if (ratingsResponse.success && ratingsResponse.data) {
        setAnalyticsData(prev => ({
          ...prev,
          ratings: ratingsResponse.data.ratings || [],
          ratingsSummary: {
            averageRating: ratingsResponse.data.summary?.averageRating || 0,
            totalRatings: ratingsResponse.data.summary?.totalRatings || 0,
            ratingDistribution: ratingsResponse.data.summary?.ratingDistribution || []
          }
        }));
      }

      // Process earnings data for analytics
      if (earningsResponse.success && earningsResponse.data) {
        const { earnings, summary } = earningsResponse.data;
        
        // Calculate weekly earnings from recent data
        const weeklyEarnings = calculateWeeklyEarnings(earnings || []);
        const monthlyEarnings = calculateMonthlyEarnings(earnings || []);
        
        setAnalyticsData(prev => ({
          ...prev,
          earnings: {
            totalEarnings: summary?.totalEarnings || 0,
            totalCommission: summary?.totalCommission || 0,
            walletBalance: summary?.walletBalance || 0,
            totalRides: summary?.totalRides || 0,
            weeklyEarnings,
            monthlyEarnings
          }
        }));
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyEarnings = (earnings) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayEarnings = earnings.filter(earning => {
        const earningDate = new Date(earning.createdAt);
        return earningDate.toDateString() === date.toDateString();
      }).reduce((sum, earning) => sum + (earning.riderEarning || 0), 0);
      
      last7Days.push(dayEarnings);
    }
    
    return last7Days;
  };

  const calculateMonthlyEarnings = (earnings) => {
    const last4Months = [];
    const today = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEarnings = earnings.filter(earning => {
        const earningDate = new Date(earning.createdAt);
        return earningDate.getMonth() === date.getMonth() && 
               earningDate.getFullYear() === date.getFullYear();
      }).reduce((sum, earning) => sum + (earning.riderEarning || 0), 0);
      
      last4Months.push(monthEarnings);
    }
    
    return last4Months;
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
          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FaChartLine className="text-2xl" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Live</span>
              </div>
              <div className="text-2xl font-bold mb-1">₹{Number(analyticsData.earnings.totalEarnings).toFixed(2)}</div>
              <p className="text-green-100 text-sm">Total Earnings</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FaArrowUp className="text-2xl" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">+12%</span>
              </div>
              <div className="text-2xl font-bold mb-1">{analyticsData.performance.acceptanceRate}%</div>
              <p className="text-blue-100 text-sm">Acceptance Rate</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FaStar className="text-2xl" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Excellent</span>
              </div>
              <div className="text-2xl font-bold mb-1">{analyticsData.ratingsSummary.averageRating.toFixed(1)}</div>
              <p className="text-yellow-100 text-sm">Average Rating</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FaCheckCircle className="text-2xl" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">High</span>
              </div>
              <div className="text-2xl font-bold mb-1">{analyticsData.performance.completionRate}%</div>
              <p className="text-purple-100 text-sm">Completion Rate</p>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FaCalculator className="text-teal-500" />
              Performance Analytics
            </h3>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-3xl font-bold text-green-600 mb-2">{analyticsData.performance.acceptanceRate}%</div>
                <p className="text-gray-600 mb-2">Acceptance Rate</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${analyticsData.performance.acceptanceRate}%` }} />
                </div>
                <p className="text-xs text-green-600 mt-1">Excellent Performance</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="text-3xl font-bold text-red-600 mb-2">{analyticsData.performance.cancellationRate}%</div>
                <p className="text-gray-600 mb-2">Cancellation Rate</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${analyticsData.performance.cancellationRate}%` }} />
                </div>
                <p className="text-xs text-red-600 mt-1">Keep it low</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{analyticsData.ratingsSummary.averageRating.toFixed(1)}</div>
                <p className="text-gray-600 mb-2">Average Rating</p>
                <div className="flex justify-center mt-2">
                  {[1,2,3,4,5].map(star => (
                    <FaStar key={star} className={star <= Math.floor(analyticsData.ratingsSummary.averageRating) ? 'text-yellow-500' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-xs text-yellow-600 mt-1">{analyticsData.ratingsSummary.totalRatings} reviews</p>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-3">Earnings Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Earnings:</span>
                    <span className="font-semibold text-green-600">₹{Number(analyticsData.earnings.totalEarnings).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Commission Paid:</span>
                    <span className="font-semibold text-red-600">₹{Number(analyticsData.earnings.totalCommission).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Wallet Balance:</span>
                    <span className="font-semibold text-blue-600">₹{Number(analyticsData.earnings.walletBalance).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total Rides:</span>
                    <span className="font-bold">{analyticsData.earnings.totalRides}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-3">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Time:</span>
                    <span className="font-semibold text-green-600">{analyticsData.performance.averageResponseTime || 0} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completion Rate:</span>
                    <span className="font-semibold text-blue-600">{analyticsData.performance.completionRate || 0}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Ratings Dashboard */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Recent Customer Feedback ({analyticsData.ratingsSummary.totalRatings} total)
              </h4>
              <div className="space-y-3">
                {analyticsData.ratings.length > 0 ? (
                  analyticsData.ratings.slice(0, 5).map((feedback, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{feedback.userId?.name || 'Customer'}</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <FaStar key={star} className={star <= feedback.rating ? 'text-yellow-500' : 'text-gray-300'} size={12} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{feedback.comment || 'No comment provided'}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaStar className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p>No ratings yet. Complete more rides to get feedback!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Peak Hours Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaClock className="text-blue-500" />
              Peak Hours Analysis
            </h3>
            <PeakHoursChart data={stats.hourlyData} peakHours={stats.peakHours} />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Response Time" value={`${analyticsData.performance.averageResponseTime || 0} min`} icon={<FaClock />} />
            <MetricCard title="Completion Rate" value={`${analyticsData.performance.completionRate || 0}%`} icon={<FaCheckCircle />} />
            <MetricCard title="Total Rides" value={analyticsData.earnings.totalRides || 0} icon={<FaCar />} />
            <MetricCard title="Average Rating" value={analyticsData.ratingsSummary.averageRating?.toFixed(1) || '0.0'} icon={<FaStar />} />
          </div>
        </>
      )}
    </div>
  );
}