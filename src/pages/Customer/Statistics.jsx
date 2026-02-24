import React, { useState, useEffect } from 'react';
import { ChevronRight, BarChart3, TrendingUp, Calendar, DollarSign, Star, Leaf, Car, Clock, MapPin, Users, ArrowUp, ArrowDown, CheckCircle, XCircle } from 'lucide-react';

const Statistics = ({ statistics, onBack, bookingHistory = [] }) => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [statsData, setStatsData] = useState(null);

  // Calculate statistics from booking history
  useEffect(() => {
    if (bookingHistory.length > 0) {
      const calculatedStats = calculateAdvancedStats(bookingHistory, timeRange);
      setStatsData(calculatedStats);
    } else {
      // Use provided statistics if no booking history
      setStatsData({
        totalRides: statistics?.monthlyRides || 0,
        completedRides: statistics?.monthlyRides || 0,
        cancelledRides: 0,
        totalSpent: `₹${statistics?.monthlySpending || 0}`,
        averageRating: statistics?.averageRating || 0,
        cancellationRate: '0',
        rideFrequency: statistics?.rideFrequency || '0/week',
        carbonSaved: statistics?.carbonSaved || '0 kg',
        averageSpendingPerRide: statistics?.averageFare || '₹0',
        monthlyBreakdown: generateMonthlyBreakdown(bookingHistory),
        rideDistribution: calculateRideDistribution(bookingHistory),
        favoriteTime: calculateFavoriteTime(bookingHistory),
        totalDistance: statistics?.totalDistance || '0 km'
      });
    }
  }, [bookingHistory, timeRange, statistics]);

  const calculateAdvancedStats = (bookings, range) => {
    // Filter bookings by time range
    const filteredBookings = filterBookingsByTimeRange(bookings, range);
    
    const totalRides = filteredBookings.length;
    // Use bookingStatus from API (COMPLETED, TRIP_COMPLETED, etc.)
    const completedRides = filteredBookings.filter(b => 
      ['COMPLETED', 'TRIP_COMPLETED', 'PAYMENT_DONE'].includes(b.bookingStatus)
    ).length;
    const cancelledRides = filteredBookings.filter(b => 
      ['CANCELLED', 'REJECTED'].includes(b.bookingStatus)
    ).length;
    
    // Use finalFare from API (actual fare after ride completion)
    const totalSpent = filteredBookings.reduce((sum, booking) => {
      const fare = parseFloat(booking.finalFare || booking.estimatedFare || 0);
      return sum + fare;
    }, 0);

    const averageRating = filteredBookings.length > 0 
      ? (filteredBookings.reduce((sum, booking) => sum + (booking.rating || 0), 0) / filteredBookings.length).toFixed(1)
      : 0;

    const monthlyAvg = totalRides > 0 ? Math.round(totalSpent / totalRides) : 0;

    // Calculate ride frequency
    const rideFrequency = calculateRideFrequency(filteredBookings, range);

    return {
      totalRides,
      completedRides,
      cancelledRides,
      cancellationRate: totalRides > 0 ? ((cancelledRides / totalRides) * 100).toFixed(1) : '0',
      totalSpent: `₹${Math.round(totalSpent).toLocaleString()}`,
      averageSpendingPerRide: `₹${monthlyAvg.toLocaleString()}`,
      averageRating,
      carbonSaved: calculateCarbonSaved(filteredBookings),
      rideFrequency,
      monthlyBreakdown: generateMonthlyBreakdown(filteredBookings),
      rideDistribution: calculateRideDistribution(filteredBookings),
      favoriteTime: calculateFavoriteTime(filteredBookings),
      totalDistance: calculateTotalDistance(filteredBookings)
    };
  };

  // Helper functions
  const filterBookingsByTimeRange = (bookings, range) => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(range) {
      case 'weekly':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarterly':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'yearly':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date || booking.createdAt || now);
      return bookingDate >= cutoffDate;
    });
  };

  const calculateRideFrequency = (bookings, range) => {
    if (bookings.length === 0) return '0/week';
    
    const now = new Date();
    const firstBookingDate = new Date(Math.min(...bookings.map(b => 
      new Date(b.date || b.createdAt || now).getTime()
    )));
    
    let weeks;
    switch(range) {
      case 'weekly': weeks = 1; break;
      case 'monthly': weeks = 4; break;
      case 'quarterly': weeks = 12; break;
      case 'yearly': weeks = 52; break;
      default: weeks = 4;
    }
    
    const actualWeeks = Math.max(1, Math.floor((now - firstBookingDate) / (7 * 24 * 60 * 60 * 1000)));
    const frequency = (bookings.length / Math.min(actualWeeks, weeks)).toFixed(1);
    return `${frequency}/week`;
  };

  const calculateCarbonSaved = (bookings) => {
    // Use actual distance from API if available
    const totalDistance = bookings.reduce((sum, booking) => {
      return sum + (booking.distanceKm || booking.actualDistanceKm || 10);
    }, 0);
    const carbonKg = (totalDistance * 0.12).toFixed(1);
    return `${carbonKg} kg`;
  };

  const generateMonthlyBreakdown = (bookings) => {
    // Group bookings by month
    const monthlyData = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt || booking.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      // Use finalFare or estimatedFare from API
      const fare = parseFloat(booking.finalFare || booking.estimatedFare || 0);
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { amount: 0, rides: 0 };
      }
      monthlyData[monthKey].amount += fare;
      monthlyData[monthKey].rides += 1;
    });
    
    // Convert to array and get last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const data = monthlyData[monthKey] || { amount: 0, rides: 0 };
      
      result.push({
        month: months[date.getMonth()],
        amount: Math.round(data.amount),
        rides: data.rides
      });
    }
    
    return result;
  };

  const calculateRideDistribution = (bookings) => {
    const distribution = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };
    
    bookings.forEach(booking => {
      const date = new Date(booking.date || booking.createdAt);
      const hour = date.getHours();
      
      if (hour >= 6 && hour < 12) distribution.morning++;
      else if (hour >= 12 && hour < 18) distribution.afternoon++;
      else if (hour >= 18 && hour < 24) distribution.evening++;
      else distribution.night++;
    });
    
    const total = bookings.length || 1;
    return [
      { time: 'Morning (6AM-12PM)', percentage: Math.round((distribution.morning / total) * 100) || 40 },
      { time: 'Afternoon (12PM-6PM)', percentage: Math.round((distribution.afternoon / total) * 100) || 25 },
      { time: 'Evening (6PM-12AM)', percentage: Math.round((distribution.evening / total) * 100) || 30 },
      { time: 'Night (12AM-6AM)', percentage: Math.round((distribution.night / total) * 100) || 5 }
    ];
  };

  const calculateFavoriteTime = (bookings) => {
    const distribution = calculateRideDistribution(bookings);
    const max = distribution.reduce((prev, current) => 
      (prev.percentage > current.percentage) ? prev : current
    );
    return max.time.split(' ')[0];
  };

  const calculateTotalDistance = (bookings) => {
    const totalKm = bookings.reduce((sum, booking) => sum + (booking.distance || 10), 0);
    return `${Math.round(totalKm)} km`;
  };

  if (!statsData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const timeRanges = [
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'quarterly', label: 'Last 3 Months' },
    { id: 'yearly', label: 'This Year' }
  ];

  const performanceCards = [
    {
      title: 'Ride Completion',
      value: `${statsData.completedRides} rides`,
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cancellation Rate',
      value: `${statsData.cancellationRate}%`,
      change: '-3%',
      trend: 'down',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Average Rating',
      value: `${statsData.averageRating}/5`,
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Spent',
      value: statsData.totalSpent,
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const quickStats = [
    { 
      label: 'Total Rides', 
      value: statsData.totalRides, 
      icon: Car, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
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
      value: statsData.cancelledRides, 
      icon: XCircle, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      label: 'Avg per Ride', 
      value: statsData.averageSpendingPerRide, 
      icon: DollarSign, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Carbon Saved', 
      value: statsData.carbonSaved, 
      icon: Leaf, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      label: 'Favorite Time', 
      value: statsData.favoriteTime, 
      icon: Clock, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2 text-sm font-medium"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ride Statistics</h2>
              <p className="text-gray-600 text-sm">Detailed overview of your travel patterns and performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                timeRange === range.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceCards.map((card, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                  card.trend === 'up' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {card.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {card.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
              <p className="text-sm text-gray-600">{card.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickStats.map((stat, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full mb-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Spending */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Monthly Spending</h3>
                <p className="text-sm text-gray-600">Last 6 months</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {statsData.monthlyBreakdown?.map((item, index) => {
              const maxAmount = Math.max(...statsData.monthlyBreakdown.map(m => m.amount), 1);
              const percentage = (item.amount / maxAmount) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.month}</span>
                    <span className="text-sm font-medium text-gray-900">₹{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ride Distribution */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Ride Distribution</h3>
                <p className="text-sm text-gray-600">By time of day</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {statsData.rideDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.time}</span>
                  <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' : 'bg-gray-400'
                    } h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Insights & Recommendations</h3>
            <p className="text-sm text-gray-600">Personalized tips to improve your experience</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Savings Opportunity',
              description: `Save ~₹${Math.round(parseInt(statsData.totalSpent.replace(/[^0-9]/g, '')) * 0.1)} by booking rides during off-peak hours.`,
              icon: DollarSign,
              color: 'text-green-600',
              bgColor: 'bg-green-50'
            },
            {
              title: 'Environmental Impact',
              description: `You've saved ${statsData.carbonSaved} of CO₂. That's equivalent to planting ${Math.round(parseInt(statsData.carbonSaved) / 0.21)} trees!`,
              icon: Leaf,
              color: 'text-emerald-600',
              bgColor: 'bg-emerald-50'
            },
            {
              title: 'Usage Pattern',
              description: `Your ride frequency is ${statsData.rideFrequency}. Consider our weekly subscription for better rates.`,
              icon: TrendingUp,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50'
            },
            {
              title: 'Travel Distance',
              description: `You've traveled ${statsData.totalDistance} this ${timeRange}. Keep exploring!`,
              icon: Car,
              color: 'text-blue-600',
              bgColor: 'bg-blue-50'
            }
          ].map((insight, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow duration-200">
              <div className={`inline-flex p-2 rounded-lg ${insight.bgColor} mb-3`}>
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;