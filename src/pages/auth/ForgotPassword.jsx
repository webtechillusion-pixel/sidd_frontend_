import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const role = searchParams.get('role') || 'USER';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) return;

    setLoading(true);
    try {
      await authService.forgotPassword(email, role);
      setEmailSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/login/${role.toLowerCase()}`)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </button>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {emailSent ? 'Check Your Email' : 'Reset Your Password'}
            </h1>
            
            <p className="text-gray-600">
              {emailSent 
                ? `We've sent password reset instructions to ${email}`
                : 'Enter your email address and we\'ll send you instructions to reset your password.'
              }
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  Check your inbox for password reset instructions. The link will expire in 15 minutes.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Try another email
                </button>
                
                <Link
                  to={`/login/${role.toLowerCase()}`}
                  className="block w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Didn't receive the email?</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• Wait a few minutes and try again</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;