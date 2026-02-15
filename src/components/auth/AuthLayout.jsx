
import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, footerLink, footerText }) => {
  // Function to determine link text based on the route
  const getLinkText = (link) => {
    if (link.includes('login')) {
      return 'Log In';
    } else if (link.includes('register') || link.includes('apply')) {
      return 'Sign Up';
    }
    return 'Continue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Left Side - Branding */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
            <MapPin className="h-10 w-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TravelX</h1>
              <p className="text-gray-600">Explore Norway</p>
            </div>
          </Link>
          
          <div className="hidden lg:block">
            <div className="mb-6">
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Discover Norway's
                <span className="text-blue-600 block">Hidden Beauty</span>
              </h2>
              <p className="text-gray-600 mt-4 text-lg">
                From majestic fjords to northern lights, experience the adventure of a lifetime.
              </p>
            </div>
            
            <div className="mt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Authentic Experiences</h3>
                  <p className="text-gray-600 text-sm">Local guides, genuine adventures</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sustainable Travel</h3>
                  <p className="text-gray-600 text-sm">Eco-friendly, responsible tourism</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Best Price Guarantee</h3>
                  <p className="text-gray-600 text-sm">No hidden fees, transparent pricing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-2">{subtitle}</p>
            </div>
            
            {children}
            
            {footerLink && (
              <p className="text-center text-gray-600 mt-8">
                {footerText}{' '}
                <Link to={footerLink} className="text-blue-600 font-semibold hover:text-blue-700">
                  {getLinkText(footerLink)}
                </Link>
              </p>
            )}
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                By continuing, you agree to TravelX's{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> and{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
              </p>
            </div>
          </div>
          
          {/* Mobile Stats */}
          <div className="lg:hidden mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">Tours Completed</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">98%</div>
              <div className="text-sm text-gray-600">Happy Travelers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;