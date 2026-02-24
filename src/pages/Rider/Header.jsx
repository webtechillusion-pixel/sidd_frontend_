import React, { useState } from 'react';
import {
  FaHome,
  FaCar,
  FaMoneyBill,
  FaChartLine,
  FaUser,
  FaRoute,
  FaCalendarAlt,
  FaWrench,
  FaComments,
  FaFileAlt,
  FaSignOutAlt,
  FaBell,
  FaWifi,
  FaTachometerAlt,
  FaCheck,
  FaTrash
} from "react-icons/fa";

export function Header({ 
  activePage, 
  setActivePage, 
  online, 
  stats, 
  liveEarnings,
  handleLogout,
  toggleOnlineStatus,
  notifications = 0,
  notificationList = [],
  showNotificationPanel,
  setShowNotificationPanel,
  markNotificationRead,
  markAllNotificationsRead
}) {
const menuItems = [
    ["dashboard", "Dashboard", FaHome],
    ["rides", "Rides", FaCar],
    ["earnings", "Earnings", FaMoneyBill],
    // ["analytics", "Analytics", FaChartLine],
    ["navigation", "Navigation", FaRoute],
    // ["schedule", "Schedule", FaCalendarAlt],
    // ["vehicle", "Vehicle", FaWrench],
    // ["communication", "Messages", FaComments],
    ["documents", "Documents", FaFileAlt],
    ["profile", "Profile", FaUser],
  ];

  const getPageDescription = () => {
    switch(activePage) {
      case 'dashboard': return 'Overview of your performance and earnings';
      case 'rides': return online ? 'Accept rides and manage active trips' : 'Go online to start receiving rides';
      case 'earnings': return 'Track your income and payment history';
      case 'analytics': return 'Detailed insights into your performance';
      case 'navigation': return 'GPS navigation and route optimization';
      case 'schedule': return 'Manage your availability and breaks';
      case 'vehicle': return 'Vehicle details and maintenance';
      case 'communication': return 'Support chat and announcements';
      case 'documents': return 'Upload and manage required documents';
      case 'profile': return 'Personal information and account settings';
      default: return online ? "You're online and ready for rides" : "You're currently offline";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Main Header */}
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800 capitalize flex items-center gap-2">
                <FaTachometerAlt className="text-teal-600" />
                {activePage}
              </h1>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                online 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                {online ? <FaWifi /> : <FaWifi className="opacity-50" />}
                {online ? 'Online' : 'Offline'}
              </div>
            </div>
            <p className="text-sm lg:text-base text-gray-600">
              {getPageDescription()}
            </p>
          </div>
          
          {/* Stats & Actions */}
          <div className="flex items-center gap-3 lg:gap-6">
          {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationPanel && setShowNotificationPanel(!showNotificationPanel)}
                className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors"
              >
                <FaBell className="text-lg" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
            </div>
            
            {/* Today's Earnings */}
            <div className="text-right hidden sm:block">
              <p className="text-xs lg:text-sm text-gray-500">Today's Earnings</p>
              <p className="text-lg lg:text-2xl font-bold text-green-600">₹{Number(stats.todayEarnings || liveEarnings || 0).toFixed(1)}</p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-gray-500">Rating</p>
                <p className="font-semibold text-yellow-600">{stats.rating || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Rides</p>
                <p className="font-semibold text-blue-600">{stats.totalRides || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Accept</p>
                <p className="font-semibold text-green-600">{Number(stats.acceptance || 0).toFixed(1)}%</p>
              </div>
            </div>
            
            {/* Online/Offline Toggle - Mobile */}
            <button
              onClick={toggleOnlineStatus}
              className={`lg:hidden px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                online 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {online ? 'Online' : 'Offline'}
            </button>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="lg:hidden bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
            
            {/* Status Indicator */}
            <div className={`w-3 h-3 rounded-full ${
              online ? 'bg-green-400 animate-pulse shadow-lg' : 'bg-gray-400'
            }`} />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden border-t bg-gray-50">
        <div className="flex overflow-x-auto space-x-1 p-2">
          {menuItems.map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all duration-200 min-w-[60px] ${
                activePage === key
                  ? "bg-teal-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              <Icon className="text-sm" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Stats Bar */}
      <div className="lg:hidden border-t bg-white p-3">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-xs text-gray-500">Today</p>
            <p className="font-bold text-green-600">₹{Number(stats.todayEarnings || liveEarnings || 0).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <p className="font-bold text-yellow-600">{stats.rating || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Rides</p>
            <p className="font-bold text-blue-600">{stats.totalRides || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Accept</p>
            <p className="font-bold text-purple-600">{Number(stats.acceptance || 0).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </header>
  );
}