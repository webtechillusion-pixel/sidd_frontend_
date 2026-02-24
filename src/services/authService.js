import api from './api';

const authService = {
  // User Registration
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      const data = response.data || response;
      
      // Store user and token
      if (data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      } else if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract error message from response
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle array of validation errors
        if (Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Create a custom error with the message
      const customError = new Error(errorMessage);
      customError.response = error.response;
      
      throw customError;
    }
  },

  // Rider Registration (with file uploads)
  async registerRider(riderData) {
    try {
      // Convert object to FormData
      const formData = new FormData();
      
      // Add text fields
      Object.keys(riderData).forEach(key => {
        if (key !== 'photo' && key !== 'aadhaarFront' && key !== 'aadhaarBack' && 
            key !== 'licenseFront' && key !== 'licenseBack' && key !== 'rcFront' && key !== 'rcBack') {
          formData.append(key, riderData[key]);
        }
      });
      
      // Add files if they exist
      if (riderData.photo instanceof File) formData.append('photo', riderData.photo);
      if (riderData.aadhaarFront instanceof File) formData.append('aadhaarFront', riderData.aadhaarFront);
      if (riderData.aadhaarBack instanceof File) formData.append('aadhaarBack', riderData.aadhaarBack);
      if (riderData.licenseFront instanceof File) formData.append('licenseFront', riderData.licenseFront);
      if (riderData.licenseBack instanceof File) formData.append('licenseBack', riderData.licenseBack);
      
      const response = await api.post('/api/auth/register-rider', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = response.data || response;
      
      if (data.data?.rider) {
        localStorage.setItem('user', JSON.stringify(data.data.rider));
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Rider registration error:', error);
      throw error;
    }
  },

  // Login
  async login(credentials) {
  try {
    const response = await api.post('/api/auth/login', credentials);
    const data = response.data || response;
    
    console.log('Login successful. Response:', data);
    
    // Store user and token
    if (data.data?.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    } else if (data?.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    // Store token for API requests
    if (data.token) {
      localStorage.setItem('token', data.token);
    } else if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
},

  // Get Profile
  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data || response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

// Logout
  async logout(navigate) {
    try {
      // Clear local data first - BEFORE making API call
      this.clearAuthData();
      
      // Make logout API call (optional - won't affect if fails)
      api.post('/api/auth/logout', {}, {
        timeout: 3000
      }).catch(() => {
        console.log('Logout API call completed');
      });
      
      // Use navigate instead of window.location - default to /login
      if (navigate) {
        navigate('/login');
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      if (navigate) {
        navigate('/login');
      } else {
        window.location.href = '/login';
      }
    }
  },

  // Clear all auth data
  clearAuthData() {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all possible auth cookies
    const hostname = window.location.hostname;
    const cookiesToClear = ['token', 'user_token', 'auth_token', 'user_info', 'session_id', 'jwt', 'connect.sid', 'session'];
    
    cookiesToClear.forEach(cookieName => {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${hostname};`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${hostname};`;
    });
    
    // Clear all cookies for current domain
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${hostname};`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      }
    });
    
    // Also clear any stored state in memory (if needed)
    console.log('All auth data cleared');
  },

  // Get current user from localStorage
  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  },

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUserFromStorage();
    return !!(token && user);
  },

  // Check auth status with server
  async checkAuth() {
    try {
      const response = await api.get('/api/auth/check');
      return response.data || response;
    } catch (error) {
      console.error('Check auth error:', error);
      return { 
        success: false, 
        authenticated: false, 
        message: error.message 
      };
    }
  },

  // Get user role
  getUserRole() {
    const user = this.getCurrentUserFromStorage();
    return user?.role || null;
  },

  // Forgot Password
  async forgotPassword(email, role = 'USER') {
    try {
      const response = await api.post('/api/auth/forgot-password', { email, role });
      return response.data || response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset Password
  async resetPassword(token, password, role = 'USER') {
    try {
      const response = await api.post('/api/auth/reset-password', { token, password, role });
      return response.data || response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/api/auth/refresh-token');
      const data = response.data || response;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  // Verify Email with OTP
  async verifyEmail(email, otp) {
    try {
      const response = await api.post('/api/auth/verify-email', { 
        email: email,
        otp: otp.toString()
      });
      
      const data = response.data || response;
      
      // Update user verification status
      if (data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Email verification error:', error);
      
      // Extract error message
      let errorMessage = 'Email verification failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const customError = new Error(errorMessage);
      customError.response = error.response;
      
      throw customError;
    }
  },

  // Resend OTP
  async resendOTP(email) {
    try {
      const response = await api.post('/api/auth/resend-otp', { 
        email: email 
      });
      
      const data = response.data || response;
      
      return data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      // Extract error message
      let errorMessage = 'Failed to resend OTP';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const customError = new Error(errorMessage);
      customError.response = error.response;
      
      throw customError;
    }
  },

  // Google Login/Register
  async googleLogin(email, name, picture, token) {
    try {
      const response = await api.post('/api/auth/google-auth', { 
        email,
        name,
        picture,
        token
      });
      
      const data = response.data || response;
      
      // Store user and token
      if (data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      } else if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      
      let errorMessage = 'Google login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const customError = new Error(errorMessage);
      customError.response = error.response;
      
      throw customError;
    }
  },

  // Update Profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      const data = response.data || response;
      
      // Update local storage with new user data
      if (data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Update Profile Picture
  async updateProfilePicture(imageFile) {
    try {
      const formData = new FormData();
      formData.append('photo', imageFile);
      
      const response = await api.post('/api/auth/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = response.data || response;
      
      // Update local storage with new user data
      if (data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Update profile picture error:', error);
      throw error;
    }
  },

  // Delete Profile Picture
  async deleteProfilePicture() {
    try {
      const response = await api.delete('/api/auth/profile-picture');
      const data = response.data || response;
      
      // Update local storage with new user data
      if (data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Delete profile picture error:', error);
      throw error;
    }
  },

  // Change Password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data || response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
};

export default authService;