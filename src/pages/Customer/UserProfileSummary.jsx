import React from 'react';
import { Award } from 'lucide-react';

const UserProfileSummary = ({ userData }) => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex items-center mb-4">
        <img 
          src={userData?.avatar} 
          alt="User" 
          className="w-16 h-16 rounded-full border-4 border-white mr-4"
        />
        <div>
          <h2 className="text-xl font-bold">{userData?.name}</h2>
          <p className="text-green-100 text-sm">{userData?.email}</p>
          <div className="flex items-center mt-1">
            <Award className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-sm">{userData?.membershipTier} Member</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold">{userData?.totalRides}</div>
          <div className="text-green-100 text-sm">Total Rides</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{userData?.averageRating}</div>
          <div className="text-green-100 text-sm">Avg Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">₹{userData?.walletBalance}</div>
          <div className="text-green-100 text-sm">Wallet</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{userData?.loyaltyPoints}</div>
          <div className="text-green-100 text-sm">Points</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSummary;