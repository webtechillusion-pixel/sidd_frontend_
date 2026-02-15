import React, { useEffect, useState } from 'react';
import { FaMoneyBill, FaCar, FaCheckCircle, FaStar, FaArrowUp, FaClock, FaUser } from "react-icons/fa";
import { StatCard } from './Cards';
import { WeeklyChart, HourlyChart } from './Charts';
import riderService from '../../services/riderService';

export function Dashboard({ stats, profile, cab }) {
  const [recentEarnings, setRecentEarnings] = useState([]);

  useEffect(() => {
    fetchRecentEarnings();
  }, []);

  const fetchRecentEarnings = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const res = await riderService.getEarnings({
        startDate: sevenDaysAgo,
        endDate: today,
        page: 1,
        limit: 5
      });

      if (res.success && res.data?.earnings) {
        setRecentEarnings(res.data.earnings.slice(0, 5));
      } else {
        setRecentEarnings([]);
      }
    } catch (error) {
      console.error('Error fetching recent earnings:', error);
      setRecentEarnings([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Earnings" 
          value={`₹${Number(stats.todayEarnings || 0).toFixed(1)}`} 
          icon={<FaMoneyBill className="text-green-500" />}
        />
        <StatCard 
          title="Total Rides" 
          value={profile?.completedRides || 0} 
          icon={<FaCar className="text-blue-500" />}
        />
        <StatCard 
          title="Acceptance Rate" 
          value={`${Number(stats.acceptance || 0).toFixed(1)}%`} 
          icon={<FaCheckCircle className="text-teal-500" />}
        />
        <StatCard 
          title="Rating" 
          value={profile?.overallRating || 0} 
          icon={<FaStar className="text-yellow-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaArrowUp className="text-green-500" />
            Weekly Earnings
          </h3>
          <WeeklyChart data={stats.weeklyEarnings} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaClock className="text-blue-500" />
            Rides by Hour
          </h3>
          <HourlyChart data={stats.hourlyData} />
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
          {recentEarnings.map((earning) => (
            <div key={earning._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaMoneyBill className="text-teal-600" />
                </div>
                <div>
                  {/* <p className="font-medium">Ride #{earning.bookingId?.slice(-6) || 'N/A'}</p> */}
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
          {recentEarnings.length === 0 && (
            <p className="text-center text-gray-500 py-4">No recent earnings</p>
          )}
        </div>
      </div>
    </div>
  );
}