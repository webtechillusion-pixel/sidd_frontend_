// frontend/src/components/admin/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  Shield,
  CreditCard,
  FileText,
  TrendingUp,
  Settings,
  Home,
  BarChart3,
  ClipboardCheck,
  Wallet,
  Bell,
  HelpCircle,
  ChevronRight,
  Database,
  Activity
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { stats } = useAdmin();
  const [expandedSections, setExpandedSections] = useState({
    management: true,
    analytics: false
  });

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      badge: null,
      section: 'dashboard'
    },
    {
      title: 'Management',
      section: 'management',
      icon: Database,
      children: [
        {
          title: 'Riders',
          icon: Users,
          path: '/admin/riders',
          badge: stats?.riders?.pending || 0
        },
        {
          title: 'Cabs',
          icon: Car,
          path: '/admin/cabs',
          badge: stats?.cabs?.pending || 0
        },
        {
          title: 'Bookings',
          icon: Calendar,
          path: '/admin/bookings',
          badge: null
        },
        {
          title: 'Users',
          icon: Shield,
          path: '/admin/users',
          badge: null
        }
      ]
    },
    {
      title: 'Financial',
      icon: CreditCard,
      section: 'financial',
      children: [
        {
          title: 'Pricing',
          icon: BarChart3,
          path: '/admin/pricing',
          badge: null
        },
        {
          title: 'Payouts',
          icon: Wallet,
          path: '/admin/payouts',
          badge: stats?.payouts?.pending || 0
        }
      ]
    },
    {
      title: 'Analytics',
      icon: TrendingUp,
      path: '/admin/analytics',
      badge: null,
      section: 'analytics'
    },
    {
      title: 'Reports',
      icon: FileText,
      path: '/admin/reports',
      badge: null,
      section: 'reports'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      badge: null,
      section: 'settings'
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isChildActive = (children) => {
    return children?.some(child => isActive(child.path));
  };

  useEffect(() => {
    // Auto-expand section if a child is active
    navigationItems.forEach(item => {
      if (item.children) {
        if (isChildActive(item.children)) {
          setExpandedSections(prev => ({
            ...prev,
            [item.section]: true
          }));
        }
      }
    });
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-0
        flex flex-col bg-gray-900 text-white
      `}>
        {/* Logo and Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TravelX Admin</h1>
              <p className="text-xs text-gray-400">Management Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-sm text-gray-300">Online</span>
              </div>
              <span className="text-sm font-semibold">{stats?.riders?.online || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardCheck className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-300">Pending</span>
              </div>
              <span className="text-sm font-semibold">{stats?.riders?.pending || 0}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.title || item.path}>
              {item.path ? (
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => toggleSection(item.section)}
                    className={`
                      flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium
                      text-gray-300 hover:bg-gray-800 hover:text-white transition-colors
                      ${expandedSections[item.section] || isChildActive(item.children) ? 'bg-gray-800' : ''}
                    `}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      expandedSections[item.section] ? 'rotate-90' : ''
                    }`} />
                  </button>
                  
                  {expandedSections[item.section] && item.children && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onClose}
                          className={({ isActive }) => `
                            flex items-center justify-between px-3 py-2 rounded text-sm transition-colors
                            ${isActive
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-center">
                            <child.icon className="h-4 w-4 mr-3" />
                            {child.title}
                          </div>
                          {child.badge && child.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                              {child.badge}
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-800">
          {/* Help & Support */}
          <div className="mb-4">
            <button
              onClick={() => window.open('https://help.travelx.com/admin', '_blank')}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </button>
            <button
              onClick={() => window.open('/admin/system-status', '_blank')}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Activity className="h-4 w-4 mr-3" />
              System Status
            </button>
          </div>

          {/* Return to Main Site */}
          <NavLink
            to="/"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Visit Main Site
          </NavLink>

          {/* Version Info */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-center text-gray-500">
              v2.1.0 • TravelX Admin
            </p>
            <p className="text-xs text-center text-gray-500 mt-1">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;