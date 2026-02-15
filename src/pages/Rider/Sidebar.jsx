import React from 'react';
import {
  FaHome,
  FaCar,
  FaMoneyBill,
  FaChartLine,
  FaUser,
  FaPowerOff,
  FaBell,
  FaRoute,
  FaCalendarAlt,
  FaWrench,
  FaComments,
  FaFileAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaShieldAlt,
  FaCrown,
  FaUsers
} from "react-icons/fa";

export function Sidebar({ 
  activePage, 
  setActivePage, 
  online, 
  toggleOnlineStatus, 
  notifications, 
  handleLogout,
  onOpenSupport
}) {
  const menuItems = [
    ["dashboard", "Dashboard", FaHome, "Overview & Stats"],
    ["rides", "Rides", FaCar, "Active & Requests"],
    ["earnings", "Earnings", FaMoneyBill, "Income & Payments"],
    ["navigation", "Navigation", FaRoute, "GPS & Routes"],
    ["profile", "Profile", FaUser, "Account Settings"],
  ];

  const supportItems = [
    ["support", "Help & Support", FaComments, "Get assistance"]
  ];

  return (
    <aside className="hidden lg:flex lg:w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex-col shadow-2xl border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-teal-600/10 to-blue-600/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
            <FaTachometerAlt className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              RideVendor
            </h2>
            <p className="text-xs text-slate-400">Professional Dashboard</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mt-3 ${
          online 
            ? 'bg-green-500/20 border border-green-500/30' 
            : 'bg-slate-700/50 border border-slate-600/30'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            online ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
          }`} />
          <span className="text-sm font-medium">
            {online ? 'Online & Active' : 'Currently Offline'}
          </span>
          {online && <FaCrown className="text-yellow-400 text-xs" />}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
          Main Menu
        </div>
        {menuItems.map(([key, label, Icon, description]) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 relative overflow-hidden ${
              activePage === key
                ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25 transform scale-[1.02]"
                : "hover:bg-slate-700/50 text-slate-300 hover:text-white hover:transform hover:scale-[1.01]"
            }`}
          >
            {/* Active indicator */}
            {activePage === key && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-blue-400 rounded-r" />
            )}
            
            <div className={`p-2 rounded-lg transition-colors ${
              activePage === key 
                ? 'bg-white/20' 
                : 'bg-slate-600/30 group-hover:bg-slate-600/50'
            }`}>
              <Icon className="text-base" />
            </div>
            
            <div className="flex-1 text-left">
              <div className="font-medium">{label}</div>
              <div className={`text-xs transition-colors ${
                activePage === key 
                  ? 'text-white/80' 
                  : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                {description}
              </div>
            </div>
            
            {/* Notification badges */}
            {key === 'communication' && notifications > 0 && (
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">{notifications}</span>
              </div>
            )}
          </button>
        ))}
        
        {/* Support Section */}
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 mt-6">
          Support
        </div>
        {supportItems.map(([key, label, Icon, description]) => (
          <button
            key={key}
            onClick={() => onOpenSupport && onOpenSupport()}
            className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 relative overflow-hidden hover:bg-slate-700/50 text-slate-300 hover:text-white hover:transform hover:scale-[1.01]"
          >
            <div className="p-2 rounded-lg transition-colors bg-slate-600/30 group-hover:bg-slate-600/50">
              <Icon className="text-base" />
            </div>
            
            <div className="flex-1 text-left">
              <div className="font-medium">{label}</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300">
                {description}
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        {/* Online/Offline Toggle */}
        <button
          onClick={toggleOnlineStatus}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 text-sm mb-3 relative overflow-hidden ${
            online 
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25" 
              : "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-300 hover:text-white"
          }`}
        >
          <FaPowerOff className={`text-lg ${online ? "animate-pulse" : ""}`} />
          <span>{online ? "Go Offline" : "Go Online"}</span>
          {online && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          )}
        </button>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-2">
          <div className="flex items-center gap-2">
            <FaBell className="text-teal-400" />
            <span>{notifications} alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-green-400" />
            <span>Verified</span>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:transform hover:scale-[1.02]"
        >
          <FaSignOutAlt className="text-base" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}