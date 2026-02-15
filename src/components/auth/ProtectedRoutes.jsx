import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  try {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      const path = location.pathname;
      let loginPath = '/login/customer';
      
      if (path.includes('/admin')) {
        loginPath = '/admin/login';
      } else if (path.includes('/rider')) {
        loginPath = '/login/rider';
      }
      
      return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // Role mapping
    const roleMapping = {
      'USER': 'customer',
      'RIDER': 'rider', 
      'ADMIN': 'admin'
    };

    // Check role if required
    if (roles.length > 0) {
      const userRole = roleMapping[user.role] || user.role?.toLowerCase();
      const hasRole = roles.some(role => {
        const mappedRole = roleMapping[role] || role.toLowerCase();
        return mappedRole === userRole;
      });
      
      if (!hasRole) {
        let redirectPath = '/';
        
        switch (userRole) {
          case 'customer':
            redirectPath = '/dashboard';
            break;
          case 'rider':
            redirectPath = '/rider/dashboard';
            break;
          case 'admin':
            redirectPath = '/admin/dashboard';
            break;
        }
        
        return <Navigate to={redirectPath} replace />;
      }
    }

    // Check rider approval
    if (user.role === 'RIDER' && user.approvalStatus && user.approvalStatus !== 'APPROVED') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg border">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
            <p className="text-gray-600 mb-4">
              Your rider account is {user.approvalStatus?.toLowerCase()}.
            </p>
            <button
              onClick={() => {
                authService.logout();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    return children;
  } catch (error) {
    console.error('ProtectedRoute error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg border">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
};

export default ProtectedRoute;