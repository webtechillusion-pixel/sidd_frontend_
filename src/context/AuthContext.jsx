import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = authService.getCurrentUserFromStorage();
        
        if (storedUser) {
          setUser(storedUser);
          setLoading(false);
          return;
        }
        
        const response = await authService.checkAuth();
        
        if (response.authenticated && response.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await authService.login(credentials);
      
      let userData = null;
      
      if (response.data?.user) {
        userData = response.data.user;
      } else if (response?.user) {
        userData = response.user;
      } else if (response.data) {
        userData = response.data;
      }
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success(`Welcome back, ${userData.name || userData.email}!`);
        
        return { 
          success: true, 
          data: response.data || response,
          user: userData 
        };
      } else {
        toast.error('Login failed: No user data received');
        return { 
          success: false, 
          error: 'Login failed: No user data received' 
        };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        const user = response.data.user || response.data;
        if (user) {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          toast.success('Registration successful!');
        }
      }
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerRider = async (riderData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.registerRider(riderData);
      toast.success('Rider registration submitted successfully!');
      return response;
    } catch (err) {
      setError(err.message || 'Rider registration failed');
      toast.error(err.message || 'Rider registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    } finally {
      setUser(null);
      authService.clearAuthData();
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    registerRider,
    logout,
    isAuthenticated: !!user,
    clearError: () => setError(null),
    updateUser: (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};