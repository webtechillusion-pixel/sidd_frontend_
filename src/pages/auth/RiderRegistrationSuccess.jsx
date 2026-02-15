import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Clock, Truck } from 'lucide-react';
import { toast } from 'react-toastify';

const RiderRegistrationSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user data from localStorage to display relevant info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user || !user.email) {
      // Use setTimeout to defer the toast and navigation to next tick
      const timer = setTimeout(() => {
        toast.error('No registration data found. Please register again.');
        navigate('/rider/register');
      }, 0);
      
      return () => clearTimeout(timer);
    }

    setUserEmail(user.email || 'your registered email');

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use setTimeout for navigation to avoid state update during render
          setTimeout(() => {
            navigate('/login/rider');
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clear timer on component unmount
    return () => {
      clearInterval(timer);
    };
  }, [navigate]); // Only include navigate as dependency

  const handleImmediateRedirect = () => {
    navigate('/login/rider');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-600 mb-6">
            Thank you for applying to become a rider partner with Siddharth Tour & Travel.
          </p>

          {/* Countdown Timer */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-blue-700">
              Redirecting to login in <span className="font-bold text-blue-800">{countdown}</span> seconds...
            </p>
          </div>
          
          {/* Information Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-medium">Verification Email Sent</h4>
                <p className="text-sm text-gray-500">
                  We've sent a confirmation email to <span className="font-semibold">{userEmail}</span>. 
                  Please check your inbox (and spam folder) for verification instructions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-medium">Verification Process</h4>
                <p className="text-sm text-gray-500">
                  Our team will review your application and documents within 24-48 hours. 
                  You'll receive an approval email once verified.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-medium">Get Started</h4>
                <p className="text-sm text-gray-500">
                  Once approved, you can login to your rider dashboard to manage bookings, 
                  update your profile, and start earning.
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Important:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Make sure to verify your email address first</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Keep your documents (license, RC, insurance) ready for verification</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Complete your rider profile with vehicle details after login</span>
              </li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleImmediateRedirect}
              className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Go to Login Now
            </button>
            
            <Link
              to="/"
              className="block w-full py-2.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
          
          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Have questions? Contact our rider support team at{' '}
              <a href="mailto:rider-support@siddharthtravel.com" className="text-green-600 hover:underline">
                rider-support@siddharthtravel.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderRegistrationSuccess;