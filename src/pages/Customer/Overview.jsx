import React from 'react';
import { ChevronRight, Calendar, MapPin, Car, Shield, FileText, Phone, Gift, Crown, Award, Star } from 'lucide-react';
import QuickActions from './QuickActions';
import StatisticsSummary from './StatisticsSummary';
import { Link } from 'react-router-dom';

const Overview = ({
  upcomingRides,
  recentActivity,
  statistics,
  loyaltyTiers,
  userData,
  onViewRideHistory,
  onViewDetailedStats,
  bookingHistory 
}) => {
  // Debug log
  console.log('Overview - statistics:', statistics);
  console.log('Overview - bookingHistory length:', bookingHistory?.length);
  console.log('Overview - userData:', userData);
  
  // Compact LoyaltyProgram component
  const LoyaltyProgram = () => {
    // Debug
    console.log('LoyaltyProgram - userData:', userData);
    console.log('LoyaltyProgram - membershipTier:', userData?.membershipTier);
    console.log('LoyaltyProgram - loyaltyPoints:', userData?.loyaltyPoints);
    
    const currentTier = userData?.membershipTier || statistics?.membershipTier || 'Silver';
    const currentPoints = userData?.loyaltyPoints || statistics?.loyaltyPoints || 0;
    const currentTierIndex = loyaltyTiers.findIndex(tier => tier.name === currentTier);
    const currentTierData = loyaltyTiers[currentTierIndex];
    const nextTier = loyaltyTiers[currentTierIndex + 1];
    const pointsToNext = nextTier ? nextTier.points - currentPoints : 0;
    const progressPercentage = Math.min(100, (currentPoints / (nextTier?.points || 2000)) * 100);

    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-md">
        {/* Header */}
        <div className="p-5 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl mr-4">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Loyalty Rewards</h2>
                <p className="text-sm text-gray-600">Earn points on every ride</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full">
              {currentTier} Member
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Points Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-amber-100 rounded-lg mr-3">
                  <Star className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Current Points</h3>
                  <p className="text-xs text-gray-600">Total earned</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{currentPoints}</div>
                {nextTier && (
                  <p className="text-xs text-gray-600 mt-2">
                    {pointsToNext} to {nextTier.name}
                  </p>
                )}
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Progress</h3>
                  <p className="text-xs text-gray-600">To next tier</p>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Silver</span>
                  <span>Gold</span>
                  <span>Platinum</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                {progressPercentage.toFixed(0)}% complete
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Gift className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Benefits</h3>
                  <p className="text-xs text-gray-600">Current perks</p>
                </div>
              </div>
              <div className="space-y-1">
                {currentTierData?.benefits?.slice(0, 2).map((benefit, index) => (
                  <div key={`${benefit}-${index}`} className="flex items-center text-xs text-gray-700">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Tiers */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Loyalty Tiers</h3>
            <div className="space-y-3">
              {loyaltyTiers.map((tier, index) => {
                const isCurrent = tier.name === currentTier;
                return (
                  <div 
                    key={tier.name}
                    className={`p-3 rounded-lg border ${
                      isCurrent 
                        ? 'border-amber-300 bg-amber-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          tier.name === 'Silver' ? 'bg-gray-100' :
                          tier.name === 'Gold' ? 'bg-yellow-100' : 'bg-purple-100'
                        }`}>
                          {tier.name === 'Silver' && <Star className="h-4 w-4 text-gray-600" />}
                          {tier.name === 'Gold' && <Crown className="h-4 w-4 text-yellow-600" />}
                          {tier.name === 'Platinum' && <Award className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{tier.name}</div>
                          <div className="text-xs text-gray-600">{tier.points} points</div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                          CURRENT
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-xs text-blue-600">
                <Gift className="h-3 w-3 mr-2" />
                Earn 2x points on weekend rides
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <QuickActions userData={userData} />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Rides & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Rides */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Upcoming Rides</h3>
                  <p className="text-sm text-gray-600">Your scheduled journeys</p>
                </div>
              </div>
              {upcomingRides.length > 0 && (
                <button 
                  onClick={onViewRideHistory}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
            
            {upcomingRides.length > 0 ? (
              <div className="space-y-4">
                {upcomingRides.slice(0, 3).map((ride) => (
                  <div key={ride.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{ride.date}</span>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                          ride.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          ride.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {ride.status}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{ride.fare}</span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span className="text-sm truncate">{ride.from}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
                        <span className="text-sm truncate">{ride.to}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Car className="h-4 w-4 mr-2" />
                        {ride.vehicle}
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                        Track Ride
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming rides</p>
                <p className="text-sm text-gray-400 mt-1">Book a new ride to see it here</p>
                <Link to="/book" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Book a Ride
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">Your recent actions and updates</p>
                </div>
              </div>
              {recentActivity.length > 0 && (
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              )}
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${
                        activity.type === 'ride' ? 'bg-blue-50' :
                        activity.type === 'payment' ? 'bg-green-50' :
                        activity.type === 'cancellation' ? 'bg-red-50' : 'bg-gray-50'
                      }`}>
                        {activity.icon || <Calendar className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <p className={`font-medium ${
                          activity.amount.startsWith('-') ? 'text-red-600' : 
                          activity.amount.startsWith('Save') ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {activity.amount}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">Your activity will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - StatisticsSummary ONLY */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-5 h-full">
            <StatisticsSummary 
              statistics={statistics}
              bookingHistory={bookingHistory}
              userData={userData}
              onViewAllStats={onViewDetailedStats}
            />
          </div>
        </div>
      </div>

      {/* Loyalty Program - Medium Size */}
      <LoyaltyProgram />

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Verified Safety</p>
              <p className="text-sm text-gray-600">Trusted profile</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Documents</p>
              <p className="text-sm text-gray-600">Upload & manage</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
              <Phone className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">24/7 Support</p>
              <p className="text-sm text-gray-600">Always available</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
              <Gift className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Refer & Earn</p>
              <p className="text-sm text-gray-600">Get ₹500 credit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;