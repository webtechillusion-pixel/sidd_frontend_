import React, { useState, useEffect } from 'react';
import { Menu, X, User, ChevronDown, Home, Info, Briefcase, Images, Phone, Car } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user: contextUser, logout } = useAuth();

  const NAV_ITEMS = [
    { label: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'About Us', path: '/about', icon: <Info className="h-4 w-4" /> },
    { label: 'Services', path: '/services', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Gallery', path: '/gallery', icon: <Images className="h-4 w-4" /> },
    { label: 'Contact', path: '/contact', icon: <Phone className="h-4 w-4" /> },
    // { label: 'Our Fleet', path: '/fleet', icon: <Car className="h-4 w-4" /> },
  ];

  useEffect(() => {
    // Get user data safely
    const getUserData = () => {
      try {
        if (contextUser) {
          setUserData(contextUser);
          return;
        }
        const storedUser = authService.getCurrentUserFromStorage();
        if (storedUser) {
          setUserData(storedUser);
          return;
        }
        const userFromCookie = getUserInfoFromCookie();
        if (userFromCookie) {
          setUserData(userFromCookie);
          return;
        }
        setUserData(null);
      } catch (error) {
        console.error('Error getting user data:', error);
        setUserData(null);
      }
    };

    getUserData();
    const interval = setInterval(getUserData, 5000);
    return () => clearInterval(interval);
  }, [contextUser]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getUserInfoFromCookie = () => {
    const userInfo = getCookie('user_info');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('Error parsing user_info cookie:', error);
        return null;
      }
    }
    return null;
  };

  const getUserName = () => {
    if (!userData) return 'Account';
    if (typeof userData === 'object') {
      if (userData.name && typeof userData.name === 'string' && userData.name.trim() !== '') {
        return userData.name.split(' ')[0] || userData.name;
      }
      if (userData.email && typeof userData.email === 'string') {
        return userData.email.split('@')[0];
      }
    }
    return 'Account';
  };

  const getUserRole = () => {
    if (!userData) return '';
    if (typeof userData === 'object' && userData.role) {
      const roleMap = {
        'USER': 'Customer',
        'RIDER': 'Rider',
        'ADMIN': 'Admin'
      };
      return roleMap[userData.role] || userData.role;
    }
    return '';
  };

  const getUserInitials = () => {
    const name = getUserName();
    if (name === 'Account') return 'A';
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardPath = () => {
    if (!userData) return '/dashboard';
    if (userData.role === 'RIDER') return '/rider/dashboard';
    if (userData.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard';
  };

  const isAuthPage = () => {
    const authPages = [
      '/login/customer',
      '/login/rider',
      '/admin/login',
      '/register/customer',
      '/rider/register',
      '/rider/registration-success',
      '/verify-email',
      '/forgot-password',
      '/reset-password'
    ];
    return authPages.includes(location.pathname);
  };

  if (isAuthPage()) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Car className="h-8 w-8 text-[#219ebc]" />
            <div>
              <h1 className="text-3xl font-bold text-[#023047]">Pariyatan</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                  ${location.pathname === item.path
                    ? 'bg-[#219ebc] text-white font-semibold'
                    : 'text-[#475569] hover:text-[#219ebc] hover:bg-[#8ecae6]/20 font-medium'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
                {location.pathname === item.path && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side - User Menu (Desktop) */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#219ebc] text-white rounded-full hover:bg-[#8ecae6] hover:text-[#023047] transition-colors"
              >
                <div className="h-8 w-8 bg-white text-[#219ebc] rounded-full flex items-center justify-center font-bold">
                  {getUserInitials()}
                </div>
                <span>{getUserName()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {userData ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-[#023047]">{getUserName()}</p>
                        <p className="text-xs text-[#475569]">{getUserRole()}</p>
                      </div>
                      <Link
                        to={getDashboardPath()}
                        className="block px-4 py-2 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/my-bookings"
                        className="block px-4 py-2 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <div className="border-t border-gray-200 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-[#fb8500] hover:bg-[#ffb703]/20"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login/customer"
                        className="block px-4 py-2 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Customer Login
                      </Link>
                      <Link
                        to="/login/rider"
                        className="block px-4 py-2 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Rider Login
                      </Link>
                      <Link
                        to="/register/customer"
                        className="block px-4 py-2 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Register as Customer
                      </Link>
                      <Link
                        to="/rider/register"
                        className="block px-4 py-2 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Become a Rider
                      </Link>
                      <div className="border-t border-gray-200 mt-1 pt-1">
                        <Link
                          to="/admin/login"
                          className="block px-4 py-2 hover:bg-[#8ecae6]/20 text-sm text-[#475569] hover:text-[#023047]"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Login
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-[#475569] hover:text-[#219ebc]"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors
                    ${location.pathname === item.path
                      ? 'bg-[#219ebc] text-white'
                      : 'text-[#475569] hover:text-[#219ebc] hover:bg-[#8ecae6]/20'
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              ))}

              {/* User Section for Mobile */}
              {userData ? (
                <div className="pt-4 space-y-3 border-t border-gray-200">
                  <div className="px-4 flex items-center space-x-3">
                    <div className="h-10 w-10 bg-[#219ebc] text-white rounded-full flex items-center justify-center font-bold">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="font-medium text-[#023047]">{getUserName()}</p>
                      <p className="text-sm text-[#475569]">{getUserRole()}</p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    className="block py-2.5 px-4 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2.5 px-4 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="block py-2.5 px-4 hover:bg-[#8ecae6]/20 text-[#475569] hover:text-[#023047]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <div className="border-t border-gray-200 pt-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2.5 px-4 text-[#fb8500] hover:bg-[#ffb703]/20"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 space-y-3 border-t border-gray-200">
                  <div className="space-y-2">
                    <Link
                      to="/login/customer"
                      className="block w-full py-2.5 text-center bg-[#219ebc] text-white rounded-full hover:bg-[#8ecae6] hover:text-[#023047] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Customer Login
                    </Link>
                    <Link
                      to="/login/rider"
                      className="block w-full py-2.5 text-center bg-[#fb8500] text-white rounded-full hover:bg-[#ffb703] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Rider Login
                    </Link>
                    <Link
                      to="/register/customer"
                      className="block w-full py-2.5 text-center border border-[#219ebc] text-[#219ebc] rounded-full hover:bg-[#8ecae6]/20 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register as Customer
                    </Link>
                    <Link
                      to="/rider/register"
                      className="block w-full py-2.5 text-center border border-[#fb8500] text-[#fb8500] rounded-full hover:bg-[#ffb703]/20 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become a Rider
                    </Link>
                    <div className="pt-2 border-t border-gray-200">
                      <Link
                        to="/admin/login"
                        className="block w-full py-2 text-center text-sm text-[#475569] hover:text-[#023047]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Login
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;