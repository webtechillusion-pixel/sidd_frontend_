import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Wallet, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  User,
  Receipt,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get booking data from navigation state
  const bookingData = location.state?.bookingData || {};
  
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // If no booking data in state, try to get from URL params or redirect
    if (!bookingData.bookingId) {
      const urlParams = new URLSearchParams(location.search);
      const bookingId = urlParams.get('bookingId');
      
      if (bookingId) {
        fetchBookingDetails(bookingId);
      } else {
        toast.error('No booking information found');
        navigate('/customer/dashboard');
      }
    } else {
      setBookingDetails(bookingData);
    }
  }, [bookingData, location.search, navigate]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await api.get(`/api/bookings/${bookingId}`);
      if (response.data.success) {
        setBookingDetails(response.data.data);
      } else {
        toast.error('Failed to fetch booking details');
        navigate('/customer/dashboard');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to fetch booking details');
      navigate('/customer/dashboard');
    }
  };

  const handleCashPayment = async () => {
    if (!bookingDetails?.bookingId) {
      toast.error('Booking information not found');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/payments/complete-cash', {
        bookingId: bookingDetails.bookingId
      });

      if (response.data.success) {
        setPaymentStatus('SUCCESS');
        toast.success('Cash payment confirmed successfully!');
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate('/customer/bookings', {
            state: { 
              paymentSuccess: true,
              bookingId: bookingDetails.bookingId 
            }
          });
        }, 2000);
      } else {
        toast.error(response.data.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Cash payment error:', error);
      toast.error(error.response?.data?.message || 'Payment confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!bookingDetails?.bookingId) {
      toast.error('Booking information not found');
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await api.post('/api/payments/create-order', {
        bookingId: bookingDetails.bookingId,
        amount: bookingDetails.finalFare || bookingDetails.estimatedFare,
        paymentType: 'FULL'
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create payment order');
      }

      const { orderId, amount } = orderResponse.data.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Tour & Travel',
        description: `Payment for Booking #${bookingDetails.bookingId}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await api.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: orderResponse.data.data.paymentId
            });

            if (verifyResponse.data.success) {
              setPaymentStatus('SUCCESS');
              toast.success('Payment successful!');
              
              setTimeout(() => {
                navigate('/customer/bookings', {
                  state: { 
                    paymentSuccess: true,
                    bookingId: bookingDetails.bookingId 
                  }
                });
              }, 2000);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Online payment error:', error);
      toast.error(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment of ₹{bookingDetails.finalFare || bookingDetails.estimatedFare} has been confirmed.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/customer/bookings')}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              View Bookings
            </button>
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Complete Payment</h1>
            <p className="text-gray-600">Choose your payment method</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Trip Summary</h3>
              
              {/* Trip Route */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Pickup</p>
                    <p className="font-medium text-gray-900">
                      {bookingDetails.pickup?.addressText || 'Pickup Location'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Drop</p>
                    <p className="font-medium text-gray-900">
                      {bookingDetails.drop?.addressText || 'Drop Location'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium">{bookingDetails.distanceKm?.toFixed(1) || '0.0'} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle Type</span>
                  <span className="font-medium">{bookingDetails.vehicleType || 'SEDAN'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="font-medium text-sm">#{bookingDetails.bookingId}</span>
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-medium">₹{bookingDetails.baseFare || 50}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance Fare</span>
                  <span className="font-medium">₹{bookingDetails.distanceFare || 100}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{bookingDetails.finalFare || bookingDetails.estimatedFare || 150}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h3>
              
              <div className="space-y-4 mb-8">
                {/* Cash Payment */}
                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'CASH' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-400'
                  }`}
                  onClick={() => setPaymentMethod('CASH')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Cash Payment</h4>
                        <p className="text-sm text-gray-600">Pay with cash to the driver</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      paymentMethod === 'CASH' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'CASH' && (
                        <CheckCircle className="h-3 w-3 text-white m-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Online Payment */}
                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'ONLINE' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                  onClick={() => setPaymentMethod('ONLINE')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Online Payment</h4>
                        <p className="text-sm text-gray-600">Pay securely with UPI, Card, or Net Banking</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      paymentMethod === 'ONLINE' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'ONLINE' && (
                        <CheckCircle className="h-3 w-3 text-white m-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Wallet Payment - Disabled for now */}
                <div className="p-4 border-2 border-gray-200 rounded-xl opacity-50 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <Wallet className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-500">Wallet Payment</h4>
                        <p className="text-sm text-gray-400">Coming soon</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    {paymentMethod === 'CASH' ? (
                      <div>
                        <p className="font-medium mb-1">Cash Payment Instructions:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Please have exact change ready</li>
                          <li>Payment is due at the end of the trip</li>
                          <li>You'll receive a digital receipt</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium mb-1">Secure Online Payment:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Your payment is processed securely</li>
                          <li>Supports UPI, Cards, and Net Banking</li>
                          <li>Instant confirmation and receipt</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={paymentMethod === 'CASH' ? handleCashPayment : handleOnlinePayment}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    `${paymentMethod === 'CASH' ? 'Confirm Cash Payment' : 'Pay Online'} - ₹${bookingDetails.finalFare || bookingDetails.estimatedFare || 150}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            🔒 Your payment is secure and encrypted. We never store your payment information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;