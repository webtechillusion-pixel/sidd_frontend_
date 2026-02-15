import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Shield, 
  Lock, 
  CreditCard, 
  Smartphone,
  ArrowLeft,
  Loader2,
  Clock,
  MapPin,
  Car,
  Users,
  Calendar,
  X,
  AlertCircle,
  Truck,
  Phone,
  Mail,
  User,
  IndianRupee,
  Wallet,
  RefreshCw,
  Receipt
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import customerService from '../services/customerService';
import bookingService from '../services/bookingService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('online');
  
  // Contact info
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve, reject) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Razorpay failed to load');
          setRazorpayLoaded(false);
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  // Fetch user profile and wallet balance
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await customerService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const userData = profileResponse.data;
          setContactInfo(prev => ({
            ...prev,
            name: userData.name || prev.name,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone
          }));
        }

        // Fetch wallet balance (if available)
        // This would require a wallet API endpoint
        // Demo mock value removed for production

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Load booking data
  useEffect(() => {
    const loadBookingData = async () => {
  try {
    // ----- PRIORITY 1: Get bookingId from location.state -----
    let bookingId = location.state?.bookingId;

    // ----- PRIORITY 2: Fallback to sessionStorage -----
    if (!bookingId) {
      bookingId = sessionStorage.getItem('pendingBookingId');
      console.log('Fallback: retrieved bookingId from sessionStorage:', bookingId);
    }

    // ----- PRIORITY 3: Fallback to URL query param (optional) -----
    if (!bookingId) {
      const urlParams = new URLSearchParams(location.search);
      bookingId = urlParams.get('bookingId');
      console.log('Fallback: retrieved bookingId from URL:', bookingId);
    }

    if (!bookingId) {
      console.error('No booking ID found in state, sessionStorage, or URL');
      // Try to load from localStorage (legacy)
      const storedBooking = localStorage.getItem('pendingBooking');
      if (storedBooking) {
        const parsedBooking = JSON.parse(storedBooking);
        setBookingData(parsedBooking);
        const estimatedTotal = parsedBooking.fareEstimate || parsedBooking.estimatedFare || 0;
        setPaymentDetails({
          estimatedTotal,
          pendingAmount: estimatedTotal,
          paidAmount: 0,
          paymentStatus: 'PENDING'
        });
        setLoading(false);
        return;
      }
      navigate('/book');
      return;
    }

    // ✅ We have a booking ID – fetch fresh data from backend
    
console.log('Fetching booking details for ID:', bookingId);
const response = await bookingService.getBookingDetails(bookingId);
console.log('📦 Server response:', response);

// ✅ Handle both direct and nested success flags
const isSuccess = response.data?.success === true || response.data?.data !== undefined;

if (response?.success) {
  const booking = response.data;
  setBookingData(booking);
  sessionStorage.setItem('pendingBookingId', bookingId);
  await fetchPaymentDetails(bookingId);
} else {
  console.error('Booking fetch failed:', response?.message || 'Unknown error');
  navigate('/book');
}
 
  } catch (error) {
    console.error('Error loading booking data:', error);
    navigate('/book');
  } finally {
    setLoading(false);
  }
};

    loadBookingData();
  }, [navigate, location.state?.bookingId, location.search]);

 const fetchPaymentDetails = async (bookingId) => {
  try {
    const response = await customerService.getPaymentDetails(bookingId);
    console.log('Payment details response:', response);
    if (response?.success) {
      setPaymentDetails(response.data.data);
    } else {
      console.warn('Payment details not found, using defaults');
      // Set fallback payment details
      setPaymentDetails({
        estimatedTotal: bookingData?.estimatedFare || 0,
        pendingAmount: bookingData?.estimatedFare || 0,
        paidAmount: 0,
        paymentStatus: 'PENDING'
      });
    }
  } catch (error) {
    console.warn('Payment details unavailable, using defaults');
    setPaymentDetails({
      estimatedTotal: bookingData?.estimatedFare || 0,
      pendingAmount: bookingData?.estimatedFare || 0,
      paidAmount: 0,
      paymentStatus: 'PENDING'
    });
  }
};

  const vehicleOptions = {
    SEDAN: { name: 'Sedan', icon: '🚗' },
    SUV: { name: 'SUV', icon: '🚙' },
    HATCHBACK: { name: 'Hatchback', icon: '🚘' },
    LUXURY: { name: 'Luxury Car', icon: '🏎️' },
    MINI_BUS: { name: 'Mini Bus', icon: '🚐' },
    TEMPO_TRAVELLER: { name: 'Tempo Traveller', icon: '🚌' }
  };

  const calculateTotal = () => {
    if (!bookingData) return 0;
    return bookingData.estimatedFare || bookingData.fareEstimate || 0;
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateContactInfo = () => {
    if (!contactInfo.name.trim()) {
      setErrorMessage('Please enter your full name');
      return false;
    }
    
    if (!contactInfo.email.trim()) {
      setErrorMessage('Please enter your email address');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    if (!contactInfo.phone.trim()) {
      setErrorMessage('Please enter your phone number');
      return false;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactInfo.phone.replace(/\D/g, ''))) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  // Process Razorpay payment
  const handleRazorpayPayment = async (amount) => {
    if (!window.Razorpay) {
      throw new Error('Payment gateway not loaded. Please refresh the page.');
    }

    // Create payment order in backend
    const orderResponse = await customerService.createPaymentOrder({
      bookingId: bookingData._id,
      amount: amount,
      paymentType: "FULL"
    });

    if (!orderResponse.success) {
      throw new Error(orderResponse.message || 'Failed to create payment order');
    }

    const orderData = orderResponse.data;

    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100), // Convert to paise
        currency: orderData.currency || 'INR',
        name: 'Cab Booking Service',
        description: `Payment for booking #${bookingData._id}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Verify payment with backend
            const verifyResponse = await customerService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: orderData.paymentId
            });

            if (verifyResponse.success) {
              resolve({
                success: true,
                data: verifyResponse.data,
                paymentId: response.razorpay_payment_id
              });
            } else {
              reject(new Error(verifyResponse.message || 'Payment verification failed'));
            }
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: contactInfo.name,
          email: contactInfo.email,
          contact: contactInfo.phone
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          }
        },
        notes: {
          bookingId: bookingData._id
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  };

  // Process wallet payment
  const handleWalletPayment = async (amount) => {
    try {
      const response = await customerService.processWalletPayment({
        bookingId: bookingData._id,
        amount: amount
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Wallet payment successful'
        };
      } else {
        throw new Error(response.message || 'Wallet payment failed');
      }
    } catch (error) {
      throw error;
    }
  };

 const handlePaymentSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  
  if (!validateContactInfo()) {
    return;
  }

  setProcessingPayment(true);

  try {
    const totalAmount = calculateTotal();
    
    switch (paymentMethod) {
      case 'online':
        if (!razorpayLoaded) {
          throw new Error('Payment gateway is still loading. Please try again.');
        }
        await handleRazorpayPayment(totalAmount);
        // ✅ Backend already updated the booking to PAID/PAYMENT_DONE
        break;
        
      case 'wallet':
        if (walletBalance < totalAmount) {
          throw new Error(`Insufficient wallet balance. Available: ₹${walletBalance}`);
        }
        const walletResult = await handleWalletPayment(totalAmount);
        // ✅ Backend should update booking status here – check your controller
        break;
        
      case 'cash':
        // ✅ Confirm cash booking – payment pending
        const cashResponse = await customerService.completeCashPayment(bookingData._id);
        if (!cashResponse.success) {
          throw new Error(cashResponse.message || 'Failed to confirm cash booking');
        }
        break;
        
      default:
        throw new Error('Invalid payment method');
    }

    // ✅ All backend updates are done – just show success and redirect
    setConfirmedBooking(bookingData);
    setShowSuccessPopup(true);
    navigate(`/booking-status/${bookingData._id}`, { replace: true });
    
    // Clean up
    localStorage.removeItem('pendingBooking');
    sessionStorage.removeItem('pendingBookingId');
    sessionStorage.removeItem('pendingBookingData');
    
  } catch (error) {
    console.error('Payment error:', error);
    setErrorMessage(error.message || 'Failed to process payment. Please try again.');
    setShowFailurePopup(true);
  } finally {
    setProcessingPayment(false);
  }
};

//  const updateBookingStatus = async () => {
//   try {
//     const response = await bookingService.updateBookingStatus(bookingData._id, {
//       paymentStatus: 'PAID'   // only update payment status
//     });
//     if (!response.success) {
//       console.error('Failed to update booking status:', response.message);
//     }
//   } catch (error) {
//     console.error('Error updating booking status:', error);
//   }
// };

  const renderOnlinePayment = () => (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-blue-100 rounded-full mr-4">
          <CreditCard className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Pay Now Online</h4>
          <p className="text-sm text-gray-600">Pay securely with UPI, Card, Net Banking</p>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <div className="flex items-center p-3 bg-white rounded-lg border">
          <Smartphone className="h-5 w-5 text-purple-500 mr-3" />
          <div>
            <p className="font-medium text-sm">Instant Confirmation</p>
            <p className="text-xs text-gray-500">Get booking confirmed immediately</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white rounded-lg border">
          <Lock className="h-5 w-5 text-green-500 mr-3" />
          <div>
            <p className="font-medium text-sm">100% Secure</p>
            <p className="text-xs text-gray-500">Powered by Razorpay</p>
          </div>
        </div>
        
        {!razorpayLoaded && (
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Loader2 className="h-5 w-5 text-yellow-600 mr-3 animate-spin" />
            <div>
              <p className="font-medium text-sm">Loading Payment Gateway</p>
              <p className="text-xs text-gray-500">Please wait...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderWalletPayment = () => (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-purple-100 rounded-full mr-4">
          <Wallet className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Pay from Wallet</h4>
          <p className="text-sm text-gray-600">Use your wallet balance</p>
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Wallet Balance</span>
            <span className="font-bold text-purple-600">₹{walletBalance}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Required Amount</span>
            <span className="font-bold text-gray-900">₹{calculateTotal()}</span>
          </div>
          
          <div className="border-t border-gray-200 mt-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Remaining Balance</span>
              <span className={`font-bold ${
                walletBalance >= calculateTotal() 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                ₹{walletBalance - calculateTotal()}
              </span>
            </div>
          </div>
        </div>
        
        {walletBalance < calculateTotal() && (
          <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="font-medium text-sm text-red-700">Insufficient Balance</p>
              <p className="text-xs text-red-600">
                Add ₹{calculateTotal() - walletBalance} to your wallet
              </p>
            </div>
          </div>
        )}
        
        <div className="flex items-center p-3 bg-white rounded-lg border">
          <RefreshCw className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <p className="font-medium text-sm">Instant Processing</p>
            <p className="text-xs text-gray-500">No waiting time</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCashPayment = () => (
    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-green-100 rounded-full mr-4">
          <Truck className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Pay After Ride</h4>
          <p className="text-sm text-gray-600">Pay the driver after completing your journey</p>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <div className="flex items-center p-3 bg-white rounded-lg border">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <div>
            <p className="font-medium text-sm">No Advance Payment</p>
            <p className="text-xs text-gray-500">Pay directly to the driver</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white rounded-lg border">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-3" />
          <div>
            <p className="font-medium text-sm">Booking Confirmation Required</p>
            <p className="text-xs text-gray-500">Please contact support after booking</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessPopup = () => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center relative">
          <button
            onClick={() => {
              setShowSuccessPopup(false);
              navigate('/my-bookings');
            }}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-green-100">
            {paymentMethod === 'cash' ? 'Booking created successfully' : 'Payment successful'}
          </p>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-3">
              Booking ID: {confirmedBooking?._id?.slice(-8) || 'BOOKING_ID'}
            </div>
            
            <div className="space-y-4 text-left mb-6">
              <div className="flex items-center">
                <Receipt className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm">
                  Booking details sent to {contactInfo.email}
                </span>
              </div>
              
              {paymentMethod === 'online' && (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Payment completed successfully</span>
                </div>
              )}
              
              {paymentMethod === 'cash' && (
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                  <span className="text-sm">Payment pending - pay to driver after ride</span>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Driver details will be shared before pickup</li>
                <li>• Keep your phone accessible</li>
                <li>• Contact support for any changes</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/my-bookings');
              }}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              View Bookings
            </button>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/');
              }}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FailurePopup = () => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center relative">
          <button
            onClick={() => setShowFailurePopup(false)}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
          <p className="text-red-100">{errorMessage || 'Payment could not be processed'}</p>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="p-4 bg-red-50 rounded-lg mb-4">
              <p className="text-red-700">
                {errorMessage || 'There was an issue processing your payment. Please try again or use a different payment method.'}
              </p>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>If the amount was deducted, it will be refunded within 5-7 working days.</p>
              <p className="mt-2">Contact support if you need immediate assistance.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFailurePopup(false)}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setShowFailurePopup(false);
                setPaymentMethod('cash');
                setErrorMessage('');
              }}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Use Cash Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Booking Found</h2>
          <p className="text-gray-600 mb-6">
            It looks like your booking session has expired or no booking data is available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/book"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start New Booking
            </Link>
            <Link 
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedVehicle = vehicleOptions[bookingData.cabType || bookingData.vehicleType];
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate('/book')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Back to Booking
            </button>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Complete Your Booking
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Review your trip details and proceed with payment
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-blue-600 mr-1" />
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {errorMessage && !showFailurePopup && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Contact & Booking Details */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactInfo.name}
                      onChange={handleContactInfoChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactInfoChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactInfoChange}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Trip Details</h2>
                
                <div className="space-y-4">
                  {/* Vehicle Info */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{selectedVehicle?.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedVehicle?.name}</h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          {bookingData.passengers || 1} Passenger{bookingData.passengers > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {bookingData.tripType === 'ONE_WAY' ? 'One Way' : 'Round Trip'}
                    </span>
                  </div>
                  
                  {/* Pickup & Drop */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="w-0.5 h-8 bg-blue-300 mx-auto mt-1"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Pickup Location</p>
                        <p className="text-gray-600 text-sm">{bookingData.pickup?.addressText || bookingData.pickupText}</p>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {bookingData.pickupDate || 'Today'}
                          <Clock className="h-3 w-3 ml-3 mr-1" />
                          {bookingData.pickupTime || 'Now'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Drop Location</p>
                        <p className="text-gray-600 text-sm">{bookingData.drop?.addressText || bookingData.dropText}</p>
                        {bookingData.tripType === 'ROUND_TRIP' && bookingData.returnDate && (
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            Return: {bookingData.returnDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                
                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: 'online', label: 'Pay Now', icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
                    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'bg-purple-100 text-purple-600' },
                    { id: 'cash', label: 'Cash', icon: Truck, color: 'bg-green-100 text-green-600' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      disabled={method.id === 'wallet' && walletBalance < totalAmount}
                    >
                      <div className={`p-3 rounded-full mb-3 ${method.color}`}>
                        <method.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-sm text-center">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-6">
                    {paymentMethod === 'online' && renderOnlinePayment()}
                    {paymentMethod === 'wallet' && renderWalletPayment()}
                    {paymentMethod === 'cash' && renderCashPayment()}
                  </div>

                  {/* Terms and Submit */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 mr-3"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the Terms & Conditions and Privacy Policy.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={processingPayment || 
                        (paymentMethod === 'online' && !razorpayLoaded) ||
                        (paymentMethod === 'wallet' && walletBalance < totalAmount)
                      }
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                    >
                      {processingPayment ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Processing...
                        </span>
                      ) : paymentMethod === 'cash' ? (
                        `Confirm Booking - ₹${totalAmount}`
                      ) : paymentMethod === 'wallet' ? (
                        `Pay from Wallet - ₹${totalAmount}`
                      ) : (
                        `Pay Now - ₹${totalAmount}`
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Fare Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Fare Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span>₹{Math.round(totalAmount * 0.6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance Fare</span>
                    <span>₹{Math.round(totalAmount * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Tax</span>
                    <span>₹{Math.round(totalAmount * 0.1)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 text-blue-600 mr-1" />
                        <span className="text-2xl font-bold text-blue-600">{totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 mr-2" />
                  <h3 className="font-bold text-lg">Need Assistance?</h3>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  Our customer support team is available 24/7 to help you with your booking.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Instant booking confirmation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Live driver tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm">24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && <SuccessPopup />}

      {/* Failure Popup */}
      {showFailurePopup && <FailurePopup />}
    </div>
  );
};

export default CheckoutPage;