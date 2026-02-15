import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const CustomerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Initialize Google Sign-In
  useEffect(() => {
    const loadGoogleSignIn = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initGoogleSignIn();
        };
        document.head.appendChild(script);
      } else {
        initGoogleSignIn();
      }
    };

    const initGoogleSignIn = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'your-google-client-id') {
        console.warn('⚠️ Google Client ID not configured. Add VITE_GOOGLE_CLIENT_ID to .env');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false
      });

      // Render button
      if (document.getElementById('googleSignInButton') && window.google) {
        try {
          window.google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'),
            {
              theme: 'outline',
              size: 'large',
              width: '100%'
            }
          );
        } catch (error) {
          console.error('Error rendering Google button:', error);
        }
      }
    };

    loadGoogleSignIn();
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      if (!response.credential) {
        toast.error('No credentials received from Google');
        return;
      }

      // Decode JWT payload from Google
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      const decoded = JSON.parse(jsonPayload);

      console.log('✅ Google credentials decoded:', {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });

      setIsGoogleLoading(true);
      
      // Send to backend
      const result = await authService.googleLogin(
        decoded.email,
        decoded.name || 'Google User',
        decoded.picture || null,
        response.credential
      );

      console.log('✅ Google login successful:', result);
      toast.success('Welcome! Redirecting to dashboard...');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('❌ Google login error:', error);
      toast.error(error.message || 'Google login failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
        role: 'USER'
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGoogleLogin = () => {
    // Google's library will handle the OAuth flow
    // This is just a placeholder for any additional logic if needed
    console.log('Google Sign-In button clicked - Google library handles the flow');
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue your adventure"
      footerLink="/register/customer"
      footerText="Don't have an account?"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password?role=USER" className="text-sm text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Social Login */}
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <div 
            id="googleSignInButton" 
            className="flex justify-center"
          ></div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Google Sign-In will appear above
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default CustomerLogin;