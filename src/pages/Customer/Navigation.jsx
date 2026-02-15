import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { Home, History, Settings, HelpCircle, Bell } from 'lucide-react';

const Navigation = ({ 
  userData, 
  activeView, 
  setActiveView, 
  sidebarOpen, 
  setSidebarOpen, 
  onLogout 
}) => {
  const navigationItems = [
    { id: 'overview', label: 'Home', icon: Home, color: 'text-blue-600' },
    { id: 'ride-history', label: 'Ride History', icon: History, color: 'text-green-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-purple-600' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, color: 'text-orange-600' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-3"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {userData?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2">
              <Bell className="h-5 w-5 text-gray-700" />
            </button>
            <img 
              src={userData?.avatar} 
              alt="User" 
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center mb-4">
                <img src={userData?.avatar} alt="User" className="w-12 h-12 rounded-full mr-3" />
                <div>
                  <p className="font-semibold">{userData?.name}</p>
                  <p className="text-sm text-gray-600">{userData?.membershipTier} Member</p>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center ${
                    activeView === item.id 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${item.color}`} />
                  {item.label}
                </button>
              ))}
              
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-lg flex items-center text-red-600 hover:bg-red-50 mt-2"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white min-h-screen border-r">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">MyTravelRide</h1>
          <p className="text-sm text-gray-600">Dashboard</p>
        </div>
        
        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            <img src={userData?.avatar} alt="User" className="w-12 h-12 rounded-full mr-3" />
            <div>
              <p className="font-semibold">{userData?.name}</p>
              <p className="text-sm text-gray-600">{userData?.membershipTier} Member</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center ${
                activeView === item.id 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${item.color}`} />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button 
            onClick={onLogout}
            className="flex items-center text-red-600 hover:text-red-800 w-full"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;