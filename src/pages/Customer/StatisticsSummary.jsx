import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Car, ArrowRight, CheckCircle, XCircle, Star, Users, Leaf, Wallet, Gift } from 'lucide-react';

const StatisticsSummary = ({ statistics, bookingHistory, userData, onViewAllStats }) => {
  const [statsData, setStatsData] = useState({
    totalRides: 0,
    completedRides: 0,
    cancelledRides: 0,
    totalSpent: 0,
    averageRating: 0,
    cancellationRate: 0,
    rideFrequency: '0/week',
    carbonSaved: '0 kg',
    thisMonthRides: 0,
    totalDistance: '0 km'
  });

  useEffect(() => {
    console.log('StatisticsSummary - stats:', statistics);
    console.log('StatisticsSummary - bookingHistory:', bookingHistory?.length);
    console.log('StatisticsSummary - userData:', userData);
    
    if (bookingHistory?.length > 0) {
      const calculatedStats = calculateStatsFromBookings(bookingHistory);
      // Merge with userData for wallet and points
      calculatedStats.walletBalance = userData?.walletBalance || statistics?.walletBalance || 0;
      calculatedStats.loyaltyPoints = userData?.loyaltyPoints || statistics?.loyaltyPoints || 0;
      calculatedStats.membershipTier = userData?.membershipTier || statistics?.membershipTier || 'Silver';
      setStatsData(calculatedStats);
    } else if (statistics) {
      // Include today's stats from statistics prop - handle all possible keys
      const todayRides = statistics.todayRides || 0;
      const todaySpending = statistics.todaySpending || 0;
      
      setStatsData({
        todayRides: todayRides,
        todaySpending: todaySpending,
        todaySpent: `₹${todaySpending}`,
        totalRides: statistics.totalSpent ? Math.round(statistics.totalSpent / (statistics.averageFare?.replace('₹','') || 1)) : (statistics.totalRides || 0),
        completedRides: statistics.completedRides || 0,
        cancelledRides: statistics.cancelledRides || 0,
        totalSpent: `₹${statistics.totalSpent || 0}`,
        averageRating: statistics.averageRating || userData?.averageRating || 0,
        cancellationRate: statistics.cancellationRate || 0,
        rideFrequency: statistics.rideFrequency || '0/week',
        carbonSaved: statistics.carbonSaved || '0 kg',
        thisMonthRides: statistics.monthlyRides || 0,
        totalDistance: statistics.totalDistance || '0 km',
        walletBalance: statistics.walletBalance || userData?.walletBalance || 0,
        loyaltyPoints: statistics.loyaltyPoints || userData?.loyaltyPoints || 0,
        membershipTier: statistics.membershipTier || userData?.membershipTier || 'Silver'
      });
    }
  }, [bookingHistory, statistics, userData]);

 const calculateStatsFromBookings = (bookings) => {
  const totalRides = bookings.length;

  const completedBookings = bookings.filter(b =>
    ['COMPLETED', 'TRIP_COMPLETED', 'PAYMENT_DONE']
      .includes(b.bookingStatus)
  );

  const cancelledRides = bookings.filter(b =>
    ['CANCELLED', 'REJECTED']
      .includes(b.bookingStatus)
  ).length;

  const completedRides = completedBookings.length;

  // 💰 Total Spent
  const totalSpent = bookings.reduce((sum, booking) => {
    const fare = parseFloat(
      booking.finalFare || booking.estimatedFare || 0
    );
    return sum + fare;
  }, 0);

  // ⭐ Average Rating (from userRating)
  const totalRating = completedBookings.reduce((sum, booking) => {
    return sum + (booking.userRating || 0);
  }, 0);

  const averageRating =
    completedRides > 0
      ? (totalRating / completedRides).toFixed(1)
      : 0;

  // 🚗 Total Distance
  const totalDistance = bookings.reduce((sum, booking) =>
    sum + (booking.distanceKm || booking.actualDistanceKm || 0),
    0
  );

  const carbonKg = (totalDistance * 0.12).toFixed(1);

  // 📅 Ride Frequency
  const now = new Date();
  const firstBookingDate = new Date(
    Math.min(
      ...bookings.map(b =>
        new Date(b.date || b.createdAt || now).getTime()
      )
    )
  );

  const weeks = Math.max(
    1,
    Math.floor((now - firstBookingDate) / (7 * 24 * 60 * 60 * 1000))
  );

  const rideFrequency = (totalRides / weeks).toFixed(1);

  return {
    totalRides,
    completedRides,
    cancelledRides,
    totalSpent: `₹${Math.round(totalSpent).toLocaleString()}`,
    averageRating,
    cancellationRate:
      totalRides > 0
        ? ((cancelledRides / totalRides) * 100).toFixed(1)
        : '0',
    rideFrequency: `${rideFrequency}/week`,
    carbonSaved: `${carbonKg} kg`,
    thisMonthRides: totalRides,
    totalDistance: `${Math.round(totalDistance)} km`,
    walletBalance: 0,
    loyaltyPoints: 0,
    membershipTier: 'Silver'
  };
};

  const mainStats = [
    {
      title: "Today's Rides",
      value: statsData.todayRides || 0,
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Rides',
      value: statsData.totalRides || 0,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg Rating',
      value: `${statsData.averageRating || 0}/5`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Wallet',
      value: `₹${statsData.walletBalance || 0}`,
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const quickStats = [
    { 
      label: 'Points', 
      value: statsData.loyaltyPoints || 0, 
      icon: Gift,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      label: 'Completed', 
      value: statsData.completedRides, 
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Cancelled', 
      value: `${statsData.cancellationRate}%`, 
      icon: XCircle, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Frequency', 
      value: statsData.rideFrequency, 
      icon: TrendingUp, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'This Month', 
      value: statsData.thisMonthRides, 
      icon: Users, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Ride Statistics</h3>
            <p className="text-sm text-gray-600">Overview of your travel patterns</p>
          </div>
        </div>
        <button
          onClick={onViewAllStats}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
        >
          View All Stats
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Main Stats Grid - Reduced height */}
      <div className="grid grid-cols-2 gap-3 mb-5 flex-grow-0">
        {mainStats.map((stat, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className={`p-2 rounded-lg mb-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-base font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats - More compact */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <div className={`p-1.5 rounded ${stat.bgColor}`}>
                <stat.icon className={`h-3 w-3 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Distance - Small footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-50 rounded mr-2">
              <Car className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Total Distance</span>
          </div>
          <span className="text-sm font-bold text-blue-700">{statsData.totalDistance}</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSummary;