import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Eye, EyeOff, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RiderLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const result = await login({
      email,
      password,
      role: 'RIDER'
    });
    
    console.log('Login result:', result);
    
    // ✅ Check if login was successful
    if (result.success) {
      toast.success('Login successful!');
      
      // ✅ Check if user is a rider
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role !== 'RIDER') {
          toast.error('Please use rider credentials');
          setLoading(false);
          return;
        }
      }
      
      navigate('/rider/dashboard');
    } else {
      toast.error('Login failed');
      setLoading(false);
    }
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes('pending') || errorMessage.includes('Pending')) {
        toast.error('Your account is pending approval. Please wait 24-48 hours for admin review or contact admin support.', {
          autoClose: 8000,
          position: 'top-center',
        });
      } else {
        toast.error(errorMessage || 'Login failed. Please check your credentials.');
      }
    } else if (error.response?.status === 401) {
      toast.error('Invalid email or password. Please try again.');
    } else {
      toast.error(error.message || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  }
};

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Truck className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Rider Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Login to manage your vehicles and bookings
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Want to become a rider?{' '}
            <Link to="/rider/register" className="font-medium text-green-600 hover:text-green-500">
              Apply here
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50"
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password?role=RIDER" className="font-medium text-green-600 hover:text-green-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign in as Rider'
              )}
            </button>
          </div>

          {/* Go to Home Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleGoToHome}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </button>
          </div>
        </form>

        {/* Additional Info for Pending Accounts */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">New Rider?</h4>
          <p className="text-sm text-blue-700 mb-2">
            If you've recently registered, your account is under review and will be activated within 24-48 hours.
          </p>
          <p className="text-sm text-blue-700">
            Need help? Contact admin at{' '}
            <a href="mailto:admin@siddharthtravel.com" className="font-medium hover:underline">
              admin@siddharthtravel.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderLogin;