import React from 'react';
import { Crown, Gift, TrendingUp, Check, Star, Award } from 'lucide-react';

const LoyaltyProgram = ({ userData, loyaltyTiers }) => {
  const currentTier = userData?.membershipTier || 'Silver';
  const currentPoints = userData?.loyaltyPoints || 0;
  
  // Find current tier index
  const currentTierIndex = loyaltyTiers.findIndex(tier => tier.name === currentTier);
  const nextTier = loyaltyTiers[currentTierIndex + 1];
  
  // Calculate progress
  const currentTierMin = loyaltyTiers[currentTierIndex]?.points || 0;
  const nextTierMin = nextTier?.points || loyaltyTiers[loyaltyTiers.length - 1]?.points;
  const pointsNeeded = nextTierMin - currentPoints;
  const progressInCurrentTier = currentTierIndex === 0 ? currentPoints : currentPoints - currentTierMin;
  const progressMax = nextTierMin - currentTierMin;
  const progressPercentage = Math.min(100, (progressInCurrentTier / progressMax) * 100);

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Silver': return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      case 'Gold': return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 'Platinum': return 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
    }
  };

  const getTierTextColor = (tier) => {
    switch(tier) {
      case 'Silver': return 'text-gray-700';
      case 'Gold': return 'text-yellow-700';
      case 'Platinum': return 'text-purple-700';
      default: return 'text-gray-700';
    }
  };

  const getTierIcon = (tier) => {
    switch(tier) {
      case 'Silver': return <Star className="h-5 w-5" />;
      case 'Gold': return <Crown className="h-5 w-5" />;
      case 'Platinum': return <Award className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl mr-4 shadow-sm">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Loyalty Program</h3>
            <p className="text-sm text-gray-600">Earn rewards and unlock benefits with every ride</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full ${getTierColor(currentTier)} border ${getTierTextColor(currentTier)} font-semibold flex items-center shadow-sm`}>
          {getTierIcon(currentTier)}
          <span className="ml-2">{currentTier} Member</span>
        </div>
      </div>

      {/* Points and Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Points Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Current Points</span>
            <span className="text-2xl font-bold text-blue-600">{currentPoints.toLocaleString()}</span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{currentTier}</span>
              <span>{nextTier ? `Next: ${nextTier.name}` : 'Max Tier'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {nextTier && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-blue-700">{pointsNeeded.toLocaleString()} points</span> needed for {nextTier.name}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
            This Month
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">15</div>
              <div className="text-xs text-gray-600">Rides Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+120</div>
              <div className="text-xs text-gray-600">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹2,500</div>
              <div className="text-xs text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12%</div>
              <div className="text-xs text-gray-600">Savings</div>
            </div>
          </div>
        </div>

        {/* Tier Benefits Preview */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Current Benefits</h4>
          <div className="space-y-3">
            {loyaltyTiers[currentTierIndex]?.benefits?.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 mr-3 text-green-500" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-blue-600">
              <Gift className="h-4 w-4 mr-2" />
              <span>Earn 2x points on weekend rides</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Tiers Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-6 text-lg">Loyalty Tiers</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loyaltyTiers.map((tier, index) => (
            <div 
              key={tier.name}
              className={`p-5 rounded-xl border-2 ${
                currentTier === tier.name 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white'
              } transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    currentTier === tier.name 
                      ? tier.name === 'Silver' ? 'bg-gray-100' :
                        tier.name === 'Gold' ? 'bg-yellow-50' : 'bg-purple-50'
                      : 'bg-gray-50'
                  }`}>
                    {getTierIcon(tier.name)}
                  </div>
                  <span className={`font-bold ${
                    currentTier === tier.name 
                      ? tier.name === 'Silver' ? 'text-gray-800' :
                        tier.name === 'Gold' ? 'text-yellow-700' : 'text-purple-700'
                      : 'text-gray-700'
                  }`}>
                    {tier.name}
                  </span>
                </div>
                <span className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full">
                  {tier.points.toLocaleString()} pts
                </span>
              </div>
              
              {currentTier === tier.name && (
                <div className="mb-4">
                  <div className="flex items-center text-sm text-green-600 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-medium">Current Tier</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 mb-4">
                {tier.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              {index > currentTierIndex && (
                <div className="text-xs text-gray-500 mt-3">
                  {currentPoints < tier.points ? 
                    `${(tier.points - currentPoints).toLocaleString()} points to unlock` : 
                    'Almost there!'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;