// frontend/src/components/admin/AdminHeader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const AdminHeader = ({ onMenuToggle, sidebarOpen }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search functionality
      console.log('Searching for:', searchQuery);
      toast.info(`Searching for: ${searchQuery}`);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const profileMenuItems = [
    {
      label: 'My Profile',
      icon: User,
      onClick: () => navigate('/admin/profile'),
      divider: false
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => navigate('/admin/settings'),
      divider: false
    },
    {
      label: 'Help & Support',
      icon: HelpCircle,
      onClick: () => {
        window.open('https://help.travelx.com', '_blank');
      },
      divider: true
    },
    {
      label: 'Logout',
      icon: LogOut,
      onClick: handleLogout,
      divider: false
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Search Bar */}
          <div className="ml-4 lg:ml-0 flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="Search users, riders, bookings..."
              />
            </form>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
              onClick={() => toast.info('Notifications feature coming soon')}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {admin?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {admin?.email || 'admin@example.com'}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    {profileMenuItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <button
                          onClick={() => {
                            item.onClick();
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </button>
                        {item.divider && (
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar (Optional) */}
      <div className="hidden lg:block bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">Online Riders:</span>
                <span className="font-semibold text-green-600">24</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">Pending Bookings:</span>
                <span className="font-semibold text-yellow-600">8</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">Today's Revenue:</span>
                <span className="font-semibold text-blue-600">₹12,450</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: Just now
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;