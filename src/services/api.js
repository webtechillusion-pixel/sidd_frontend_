import axios from 'axios';
import { toast } from 'react-toastify'; 

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're already refreshing token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Add admin token from localStorage for admin routes
    if (config.url?.includes('/admin/')) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      // Add regular token for other routes
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling

api.interceptors.response.use(
  (response) => {
    // Format response for admin routes
    if (response.config.url?.includes('/admin/')) {
      const data = response.data;
      
      // Check if it's a successful response
      if (response.status >= 200 && response.status < 300) {
        // Return formatted response for admin - ensure data is properly handled
        return {
          ...response,
          success: data?.success !== false,
          message: data?.message || '',
          data: data?.data !== undefined ? data.data : data
        };
      }
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear appropriate data based on route
      if (originalRequest.url?.includes('/admin/')) {
        // Clear admin data
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        
        // Redirect to admin login if not already there
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/admin/login')) {
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1000);
        }
      } else {
        // Clear user data for regular routes
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Only redirect if not already on login page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login')) {
          // Redirect based on current path
          let redirectPath = '/login/customer';
          if (currentPath.includes('/rider')) {
            redirectPath = '/login/rider';
          }
          
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1000);
        }
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission.');
    }
    
    return Promise.reject(error);
  }
);

// Helper functions
const clearAllAuthData = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('admin');
  localStorage.removeItem('adminToken');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear all auth cookies
  document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name.includes('token') || name.includes('auth') || name.includes('user') || name.includes('admin')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
    }
  });
};

const isLoginPage = () => {
  const currentPath = window.location.pathname;
  return currentPath.includes('/login') || 
         currentPath.includes('/admin/login') || 
         currentPath === '/';
};

const redirectToLogin = () => {
  const currentPath = window.location.pathname;
  let redirectPath = '/login/customer';
  
  if (currentPath.includes('/admin')) {
    redirectPath = '/admin/login';
  } else if (currentPath.includes('/rider')) {
    redirectPath = '/login/rider';
  }
  
  console.log('Redirecting to:', redirectPath);
  window.location.href = redirectPath;
};

// Helper to get cookie value
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper to parse user info from cookie
export const getUserInfoFromCookie = () => {
  const userInfo = getCookie('user_info');
  if (userInfo) {
    try {
      return JSON.parse(decodeURIComponent(userInfo));
    } catch (error) {
      console.error('Error parsing user_info cookie:', error);
      return null;
    }
  }
  return null;
};

// Add formatResponse helper from his version
export const formatResponse = (response) => {
  // If response has data property, return it formatted
  if (response.data && typeof response.data === 'object') {
    return {
      ...response.data,
      success: response.data.success !== false,
      status: response.status
    };
  }
  return response;
};

// Export clearAllAuthData for use in other files
export { clearAllAuthData };

export default api;