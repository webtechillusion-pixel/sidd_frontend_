import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Get email from localStorage or location state
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get('email');
    
    const userEmail = user.email || emailFromQuery || '';
    setEmail(userEmail);

    // Start countdown for resend OTP
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
      setVerificationStatus(null);
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setErrorMessage('Please enter all 6 digits');
      setVerificationStatus('error');
      return;
    }

    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register/customer');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await authService.verifyEmail(email, otpString);
      
      setVerificationStatus('success');
      toast.success('Email verified successfully!');
      
      // Update user in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.isEmailVerified = true;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      const errorMsg = error.message || 'Verification failed. Please try again.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;

    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await authService.resendOTP(email);
      
      // Reset OTP fields
      setOtp(['', '', '', '', '', '']);
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
      toast.success('OTP sent to your email!');
      
      // Start countdown again
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Resend error:', error);
      const errorMsg = error.message || 'Failed to resend OTP';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-medium text-gray-800 mt-1">{email || 'your email'}</p>
          </div>

          {verificationStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800">Email verified successfully! Redirecting...</p>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-800 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                6-Digit Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 outline-none transition-colors ${
                      verificationStatus === 'error' && errorMessage
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    disabled={loading || verificationStatus === 'success'}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading || verificationStatus === 'success' || otp.join('').length < 6}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </span>
                ) : verificationStatus === 'success' ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Verified ✓
                  </span>
                ) : (
                  'Verify Email'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading || !email}
                className={`px-4 py-2 rounded-lg font-medium ${canResend && email ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 cursor-not-allowed'}`}
              >
                {canResend ? (
                  'Resend OTP'
                ) : (
                  <span className="flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Resend in {countdown}s
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;