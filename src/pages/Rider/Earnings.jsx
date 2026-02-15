import React, { useEffect, useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { EarningCard } from "./Cards";
import { WeeklyChart, MonthlyChart, PeakHoursChart } from "./Charts";
import riderService from "../../services/riderService";

export function Earnings({ stats, liveEarnings, profile, showToast, setStats }) {
  const [earningsData, setEarningsData] = useState({
    earnings: [],
    summary: {
      totalEarnings: 0,
      totalCommission: 0,
      walletBalance: 0,
      totalRides: 0,
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEarningsData();
  }, [profile]);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API if available
      const response = await riderService.getEarnings({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        page: 1,
        limit: 20,
      });

      if (response.success && response.data) {
        setEarningsData({
          earnings: response.data.earnings || [],
          summary: response.data.summary || {
            totalEarnings: 0,
            totalCommission: 0,
            walletBalance: liveEarnings || 0,
            totalRides: profile?.completedRides || stats.totalRides || 0,
          },
          pagination: response.data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        });
        
        // Update stats with chart data
        if (response.data.charts) {
          if (setStats) {
            setStats(prev => ({
              ...prev,
              weeklyEarnings: response.data.charts.weeklyEarnings || [],
              monthlyEarnings: response.data.charts.monthlyEarnings || []
            }));
          }
        }
      } else {
        // Show empty data if API fails
        setEarningsData({
          earnings: [],
          summary: {
            totalEarnings: 0,
            totalCommission: 0,
            walletBalance: liveEarnings || 0,
            totalRides: profile?.completedRides || stats.totalRides || 0,
          },
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching earnings data:", error);

      // Show empty data on error instead of mock
      setEarningsData({
        earnings: [],
        summary: {
          totalEarnings: 0,
          totalCommission: 0,
          walletBalance: liveEarnings || 0,
          totalRides: profile?.completedRides || stats.totalRides || 0,
        },
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      });

      if (showToast) {
        showToast("Failed to fetch earnings data", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Wallet Balance</h2>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              ₹{((liveEarnings || 0).toFixed(2))}
            </div>
            <p className="text-green-100 text-sm sm:text-base">Live balance updates in real-time</p>
          </div>
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center ${loading ? "animate-pulse" : ""}`}
            >
              <FaMoneyBill className="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <EarningCard
              label="Total Earnings"
              value={`₹${earningsData.summary.totalEarnings.toFixed(2)}`}
            />
            <EarningCard
              label="Commission Paid"
              value={`₹${earningsData.summary.totalCommission.toFixed(2)}`}
            />
            <EarningCard
              label="Total Rides"
              value={earningsData.summary.totalRides.toString()}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Weekly Earnings Trend
              </h3>
              {stats.weeklyEarnings && stats.weeklyEarnings.length > 0 ? (
                <WeeklyChart data={stats.weeklyEarnings} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <p className="text-sm sm:text-base">-</p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Monthly Summary</h3>
              {stats.monthlyEarnings && stats.monthlyEarnings.length > 0 ? (
                <MonthlyChart data={stats.monthlyEarnings} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <p className="text-sm sm:text-base">-</p>
                </div>
              )}
            </div>
          </div>

          {/* Earnings History */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Earnings History</h3>
              <span className="text-sm text-gray-600">
                Total: {earningsData.pagination.total} rides
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Date</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Customer</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Booking ID</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Total Fare</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Your Earning</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.earnings.map((earning) => (
                    <tr key={earning._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                        {new Date(earning.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          {earning.customerPhoto && (
                            <img 
                              src={earning.customerPhoto} 
                              alt={earning.customerName}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium">{earning.customerName}</div>
                            <div className="text-gray-500 text-xs">{earning.customerPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-mono">
                        {earning.bookingId?._id?.slice(-8) || "N/A"}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">₹{Number(earning.totalFare || 0).toFixed(2)}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-semibold text-green-600 text-xs sm:text-sm">
                        ₹{Number(earning.riderEarning || 0).toFixed(2)}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            earning.payoutStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : earning.payoutStatus === "PAID"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {earning.payoutStatus || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {earningsData.earnings.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 text-center text-gray-500 text-sm sm:text-base"
                      >
                        No rides yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {earningsData.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  disabled
                  className="px-3 py-1 rounded border text-gray-400 cursor-not-allowed text-sm"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {earningsData.pagination.page} of {earningsData.pagination.totalPages}
                </span>
                <button
                  disabled
                  className="px-3 py-1 rounded border text-gray-400 cursor-not-allowed text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
