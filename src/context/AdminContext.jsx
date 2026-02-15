
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {adminService} from '../services/adminService';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [riders, setRiders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [cabs, setCabs] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [pricing, setPricing] = useState([]);
  const navigate = useNavigate();

  // Load admin from localStorage on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    const token = localStorage.getItem('adminToken');
    
    if (storedAdmin && token) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  // Admin Login
const login = async (email, password) => {
  try {
    setLoading(true);
    console.log('Admin login attempt:', email);
    
    // Call the adminService.login
    const response = await adminService.login({ 
      email,
      password, 
      role: 'ADMIN' 
    });
    
    console.log('Full Admin login response:', response);
    
    
    // The actual data is in response.data
    const responseData = response.data;
    console.log('Response data:', responseData);
    
    // Check if the request was successful (status 200-299)
    if (response.status >= 200 && response.status < 300) {
      // Extract user data based on backend response structure
      let adminData = null;
      
      // Try different response structures
      if (responseData.data?.user) {
        adminData = responseData.data.user;
      } else if (responseData?.user) {
        adminData = responseData.user;
      } else if (responseData.data) {
        adminData = responseData.data;
      } else {
        adminData = responseData;
      }
      
      console.log('Extracted admin data:', adminData);
      
      if (!adminData) {
        console.error('No admin data received from server');
        toast.error('No admin data received from server');
        return { success: false, error: 'No admin data received' };
      }
      
      // Validate that this is an admin user
      if (adminData.role !== 'ADMIN') {
        console.error('User is not an admin:', adminData.role);
        toast.error('Access denied: User is not an administrator');
        return { success: false, error: 'User is not an administrator' };
      }
      
      // Store admin data
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      
      console.log('Admin login successful - Admin stored in state and localStorage');
      console.log('Current admin state after set:', adminData);
      
      toast.success('Welcome back, Administrator!');
      
      // Return success immediately
      return { 
        success: true, 
        data: adminData
      };
    } else {
      const errorMsg = responseData?.message || 'Login failed';
      console.error('Admin login failed with status:', response.status);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    console.error('Admin login error:', error);
    
    // Extract error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Login failed. Please try again.';
    
    console.error('Error details:', errorMessage);
    toast.error(errorMessage);
    
    return { 
      success: false, 
      error: errorMessage 
    };
  } finally {
    setLoading(false);
    console.log('Admin login process completed');
  }
};

  // Admin Logout
  const logout = async () => {
  try {
    // Call backend logout
    try {
      await adminService.logout();
    } catch (error) {
      console.warn('Backend logout failed, clearing frontend only:', error.message);
    }
    
    // Clear admin state
    setAdmin(null);
    
    // Clear all localStorage items related to admin
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    
    // Clear any other potential admin-related items
    localStorage.removeItem('admin_last_login');
    localStorage.removeItem('admin_permissions');
    localStorage.removeItem('admin_session');
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    
    // Clear all auth cookies
    clearAllCookies();
    
    toast.success('Logged out successfully');
    
    // Navigate to admin login page
    navigate('/admin/login');
    
    // Force a page reload to ensure all state is cleared
    window.location.reload();
    
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Error during logout');
  }
};

const clearAllCookies = () => {
  // Get all cookies
  const cookies = document.cookie.split(';');
  
  // Clear each cookie
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Clear all auth-related cookies
    if (name.includes('token') || name.includes('auth') || name.includes('session') || 
        name.includes('admin') || name.includes('user')) {
      
      // Clear cookie for current domain
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      
      // Also try to clear for subdomains
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      
      // Clear for localhost as well
      if (window.location.hostname === 'localhost') {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
      }
    }
  });
  
  console.log('All cookies cleared');
};

  // Load Dashboard Stats
  const loadDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  // Load Riders
  const loadRiders = async (params = {}) => {
    try {
      const response = await adminService.getRiders(params);
      if (response.success) {
        setRiders(response.data.riders);
        return response.data.pagination;
      }
    } catch (error) {
      console.error('Failed to load riders:', error);
      toast.error('Failed to load riders');
    }
    return null;
  };

  // Load Bookings
  const loadBookings = async (params = {}) => {
    try {
      const response = await adminService.getBookings(params);
      if (response.success) {
        setBookings(response.data.bookings);
        return {
          bookings: response.data.bookings,
          stats: response.data.stats,
          pagination: response.data.pagination
        };
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings');
    }
    return null;
  };

  // Load Users
  const loadUsers = async (params = {}) => {
    try {
      const response = await adminService.getUsers(params);
      if (response.success) {
        setUsers(response.data.users);
        return {
          users: response.data.users,
          stats: response.data.stats,
          pagination: response.data.pagination
        };
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    }
    return null;
  };

  // Load Cabs
  const loadCabs = async (params = {}) => {
    try {
      const response = await adminService.getCabs(params);
      if (response.success) {
        setCabs(response.data.cabs);
        return response.data.pagination;
      }
    } catch (error) {
      console.error('Failed to load cabs:', error);
      toast.error('Failed to load cabs');
    }
    return null;
  };

  // Load Payouts
  const loadPayouts = async (params = {}) => {
    try {
      const response = await adminService.getPayouts(params);
      if (response.success) {
        setPayouts(response.data.payouts);
        return {
          payouts: response.data.payouts,
          summary: response.data.summary,
          pagination: response.data.pagination
        };
      }
    } catch (error) {
      console.error('Failed to load payouts:', error);
      toast.error('Failed to load payouts');
    }
    return null;
  };

  // Load Pricing
  const loadPricing = async () => {
    try {
      const response = await adminService.getPricing();
      if (response.success) {
        setPricing(response.data);
      }
    } catch (error) {
      console.error('Failed to load pricing:', error);
      toast.error('Failed to load pricing');
    }
  };

  // Approve/Reject Rider
  const handleRiderApproval = async (riderId, action, reason = '') => {
    try {
      const response = await adminService.approveRider(riderId, { action, reason });
      if (response.success) {
        toast.success(`Rider ${action.toLowerCase()}d successfully`);
        // Update local state
        setRiders(prev => prev.map(rider => 
          rider._id === riderId ? { ...rider, approvalStatus: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : rider
        ));
        return true;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to process rider approval');
    }
    return false;
  };

  // Suspend Rider
  const suspendRider = async (riderId, reason) => {
    try {
      const response = await adminService.suspendRider(riderId, { reason });
      if (response.success) {
        toast.success('Rider suspended successfully');
        setRiders(prev => prev.map(rider => 
          rider._id === riderId ? { ...rider, approvalStatus: 'SUSPENDED' } : rider
        ));
        return true;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to suspend rider');
    }
    return false;
  };

  // Approve/Reject Cab
  const handleCabApproval = async (cabId, action, reason = '') => {
    try {
      const response = await adminService.approveCab(cabId, { action, reason });
      if (response.success) {
        toast.success(`Cab ${action.toLowerCase()}d successfully`);
        setCabs(prev => prev.map(cab => 
          cab._id === cabId ? { 
            ...cab, 
            approvalStatus: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
            isApproved: action === 'APPROVE'
          } : cab
        ));
        return true;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to process cab approval');
    }
    return false;
  };

  // Update Pricing
  const updatePricing = async (cabType, data) => {
    try {
      const response = await adminService.updatePricing({ cabType, ...data });
      if (response.success) {
        toast.success('Pricing updated successfully');
        setPricing(prev => prev.map(item => 
          item.cabType === cabType ? { ...item, ...data } : item
        ));
        return true;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update pricing');
    }
    return false;
  };

  // Process Payout
  const processPayout = async (payoutId, transactionId, notes = '') => {
    try {
      const response = await adminService.processPayout(payoutId, { transactionId, notes });
      if (response.success) {
        toast.success('Payout processed successfully');
        setPayouts(prev => prev.map(payout => 
          payout._id === payoutId ? { ...payout, payoutStatus: 'PAID' } : payout
        ));
        return true;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to process payout');
    }
    return false;
  };

  // Bulk Process Payouts
  const bulkProcessPayouts = async (riderIds, startDate, endDate) => {
    try {
      const response = await adminService.processBulkPayouts({ riderIds, startDate, endDate });
      if (response.success) {
        toast.success(`Processed ${response.data.processed} payouts`);
        return response.data;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to process bulk payouts');
    }
    return null;
  };

  // Update User Status
  const updateUserStatus = async (userId, isActive) => {
    try {
      const response = await adminService.updateUserStatus(userId, { isActive });
      if (response.success) {
        toast.success(`User account ${isActive ? 'activated' : 'deactivated'} successfully`);
        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, isActive } : user
        ));
        return true;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update user status');
    }
    return false;
  };

  // Get Analytics
  const getAnalytics = async (period = 'month') => {
    try {
      const response = await adminService.getBookingAnalytics({ period });
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics');
    }
    return null;
  };

  const value = {
    admin,
    loading,
    stats,
    riders,
    bookings,
    users,
    cabs,
    payouts,
    pricing,
    login,
    logout,
    loadDashboardStats,
    loadRiders,
    loadBookings,
    loadUsers,
    loadCabs,
    loadPayouts,
    loadPricing,
    handleRiderApproval,
    suspendRider,
    handleCabApproval,
    updatePricing,
    processPayout,
    bulkProcessPayouts,
    updateUserStatus,
    getAnalytics,
    clearAllCookies,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};