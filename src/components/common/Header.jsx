import React, { useState, useEffect } from 'react'
import { Menu, X, MapPin, User, Search, ChevronDown, Home, Info, Briefcase, Images, Phone, Car } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const { user: contextUser, logout } = useAuth()

  const NAV_ITEMS = [
    { label: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'About Us', path: '/about', icon: <Info className="h-4 w-4" /> },
    { label: 'Services', path: '/services', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Gallery', path: '/gallery', icon: <Images className="h-4 w-4" /> },
    { label: 'Contact', path: '/contact', icon: <Phone className="h-4 w-4" /> },
    { label: 'Our Fleet', path: '/fleet', icon: <Car className="h-4 w-4" /> },
  ]

  useEffect(() => {
    // Get user data safely
    const getUserData = () => {
      try {
        // First try context
        if (contextUser) {
          setUserData(contextUser)
          return
        }
        
        // Then try localStorage via authService
        const storedUser = authService.getCurrentUserFromStorage()
        if (storedUser) {
          setUserData(storedUser)
          return
        }
        
        // Finally try cookies
        const userFromCookie = getUserInfoFromCookie()
        if (userFromCookie) {
          setUserData(userFromCookie)
          return
        }
        
        setUserData(null)
      } catch (error) {
        console.error('Error getting user data:', error)
        setUserData(null)
      }
    }

    getUserData()
    
    // Listen for auth changes
    const interval = setInterval(getUserData, 5000)
    return () => clearInterval(interval)
  }, [contextUser])

  // Helper function to get cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }

  // Helper to parse user info from cookie
  const getUserInfoFromCookie = () => {
    const userInfo = getCookie('user_info')
    if (userInfo) {
      try {
        return JSON.parse(userInfo)
      } catch (error) {
        console.error('Error parsing user_info cookie:', error)
        return null
      }
    }
    return null
  }

  // Safe user name extraction
  const getUserName = () => {
    if (!userData) return 'Account'
    
    // Handle different user data structures
    if (typeof userData === 'object') {
      if (userData.name && typeof userData.name === 'string') {
        return userData.name.split(' ')[0] || userData.name
      }
      if (userData.email && typeof userData.email === 'string') {
        return userData.email.split('@')[0]
      }
    }
    
    return 'Account'
  }

  // Safe role extraction and formatting
  const getUserRole = () => {
    if (!userData) return ''
    
    if (typeof userData === 'object' && userData.role) {
      // Map backend roles to display text
      const roleMap = {
        'USER': 'Customer',
        'RIDER': 'Rider',
        'ADMIN': 'Admin'
      }
      return roleMap[userData.role] || userData.role
    }
    
    return ''
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserName()
    if (name === 'Account') return 'A'
    
    const parts = name.split(' ')
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUserData(null)
      setIsUserMenuOpen(false)
      setIsMenuOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Determine dashboard path based on user role
  const getDashboardPath = () => {
    if (!userData) return '/dashboard'
    
    if (userData.role === 'RIDER') return '/rider/dashboard'
    if (userData.role === 'ADMIN') return '/admin/dashboard'
    return '/dashboard'
  }

  // Check if current route requires layout
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
    ]
    return authPages.includes(location.pathname)
  }

  // Don't render header on auth pages
  if (isAuthPage()) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo with Link to Home */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TravelX</h1>
              <p className="text-xs text-gray-500">Siddharth Tour & Travel</p>
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
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
                {location.pathname === item.path && (
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for services..."
                className="pl-10 pr-4 py-2.5 w-64 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <div className="h-8 w-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {getUserInitials()}
                </div>
                <span>{getUserName()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {userData ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                        <p className="text-xs text-gray-500">{getUserRole()}</p>
                      </div>
                      <Link 
                        to={getDashboardPath()} 
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/my-bookings" 
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login/customer" 
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Customer Login
                      </Link>
                      <Link 
                        to="/login/rider" 
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Rider Login
                      </Link>
                      <Link 
                        to="/register/customer" 
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Register as Customer
                      </Link>
                      <Link 
                        to="/rider/register" 
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Become a Rider
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link 
                          to="/admin/login" 
                          className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-500"
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
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
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
                <div className="pt-4 space-y-3 border-t border-gray-100">
                  <div className="px-4 flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{getUserName()}</p>
                      <p className="text-sm text-gray-500">{getUserRole()}</p>
                    </div>
                  </div>
                  <Link 
                    to={getDashboardPath()} 
                    className="block py-2.5 px-4 hover:bg-gray-50 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block py-2.5 px-4 hover:bg-gray-50 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/my-bookings" 
                    className="block py-2.5 px-4 hover:bg-gray-50 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2.5 px-4 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 space-y-3 border-t border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Link 
                      to="/login/customer" 
                      className="block w-full py-2.5 text-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Customer Login
                    </Link>
                    <Link 
                      to="/login/rider" 
                      className="block w-full py-2.5 text-center bg-green-600 text-white rounded-full hover:bg-green-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Rider Login
                    </Link>
                    <Link 
                      to="/register/customer" 
                      className="block w-full py-2.5 text-center border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register as Customer
                    </Link>
                    <Link 
                      to="/rider/register" 
                      className="block w-full py-2.5 text-center border border-green-600 text-green-600 rounded-full hover:bg-green-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become a Rider
                    </Link>
                    <div className="pt-2 border-t border-gray-200">
                      <Link 
                        to="/admin/login" 
                        className="block w-full py-2 text-center text-sm text-gray-500 hover:text-gray-700"
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
  )
}

export default Header