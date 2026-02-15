import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  Eye, 
  ChevronRight,
  X,
  Car,
  Phone,
  Mail,
  User,
  CreditCard,
  FileText,
  Shield,
  Navigation,
  Wallet,
  Loader2,
  Star,
  Truck,
  Map
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import bookingService from '../../services/bookingService';
import customerService from '../../services/customerService';
import { useAuth } from '../../context/AuthContext';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState({
    upcoming: [],
    completed: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState(null);
  const [otp, setOtp] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingRides: 0,
    completedRides: 0,
    totalSpent: 0
  });

  // Load bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Get user bookings from API
      const response = await customerService.getUserBookings();
      
      if (response.data.success) {
        const allBookings = response.data.data || [];
        
        // Categorize bookings by status
        const categorized = {
          upcoming: allBookings.filter(b => 
            ['PENDING', 'CONFIRMED', 'ASSIGNED', 'ARRIVED', 'ONGOING'].includes(b.bookingStatus)
          ),
          completed: allBookings.filter(b => 
            ['COMPLETED'].includes(b.bookingStatus)
          ),
          cancelled: allBookings.filter(b => 
            ['CANCELLED', 'REJECTED'].includes(b.bookingStatus)
          )
        };
        
        setBookings(categorized);
        
        // Calculate stats
        const totalSpent = allBookings
          .filter(b => b.bookingStatus === 'COMPLETED')
          .reduce((sum, b) => sum + (b.actualFare || b.estimatedFare || 0), 0);
        
        setStats({
          totalBookings: allBookings.length,
          upcomingRides: categorized.upcoming.length,
          completedRides: categorized.completed.length,
          totalSpent: totalSpent
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to localStorage if API fails
      const confirmedBooking = localStorage.getItem('confirmedBooking');
      if (confirmedBooking) {
        const booking = JSON.parse(confirmedBooking);
        setBookings({
          upcoming: [booking],
          completed: [],
          cancelled: []
        });
        setStats({
          totalBookings: 1,
          upcomingRides: 1,
          completedRides: 0,
          totalSpent: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking);
    
    try {
      // Get latest booking details
      const detailsResponse = await bookingService.getBookingDetails(booking._id);
      if (detailsResponse.data.success) {
        setSelectedBooking(detailsResponse.data.data.booking);
        
        // Get tracking data if booking is ongoing
        if (booking.bookingStatus === 'ONGOING') {
          const trackResponse = await bookingService.trackBooking(booking._id);
          if (trackResponse.data.success) {
            setTrackingData(trackResponse.data.data);
          }
        }
        
        // Get OTP if available
        if (['ASSIGNED', 'ARRIVED', 'ONGOING'].includes(booking.bookingStatus)) {
          const otpResponse = await bookingService.getBookingOTP(booking._id);
          if (otpResponse.data.success) {
            setOtp(otpResponse.data.data.otp);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setShowBookingDetails(true);
    }
  };

  const handleCloseDetails = () => {
    setShowBookingDetails(false);
    setSelectedBooking(null);
    setTrackingData(null);
    setOtp('');
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setCancelling(true);
      await customerService.cancelBooking(selectedBooking._id);
      alert('Booking cancelled successfully');
      fetchBookings(); // Refresh bookings
      handleCloseDetails();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const downloadInvoice = (booking) => {
    const doc = new jsPDF();
    
    // Company Details
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243);
    doc.text('Cab Booking Service', 105, 20, null, null, 'center');
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Your Reliable Travel Partner', 105, 28, null, null, 'center');
    doc.text('contact@cabservice.com | +91 9876543210', 105, 34, null, null, 'center');
    doc.text('www.cabservice.com', 105, 40, null, null, 'center');
    
    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('BOOKING INVOICE', 105, 50, null, null, 'center');
    
    // Invoice Details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice Number: ${booking._id}`, 20, 60);
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 20, 66);
    doc.text(`Time: ${new Date(booking.createdAt).toLocaleTimeString()}`, 20, 72);
    
    // Customer Details
    doc.text('Bill To:', 140, 60);
    doc.text(booking.contactName || 'Customer', 140, 66);
    doc.text(booking.contactPhone || 'N/A', 140, 72);
    
    // Ride Details Table
    doc.autoTable({
      startY: 90,
      head: [['Description', 'Details']],
      body: [
        ['Booking ID', booking._id],
        ['Pickup Location', booking.pickup?.addressText || 'N/A'],
        ['Drop Location', booking.drop?.addressText || 'N/A'],
        ['Date & Time', booking.scheduledTime ? 
          new Date(booking.scheduledTime).toLocaleString() : 
          new Date(booking.createdAt).toLocaleString()],
        ['Vehicle Type', booking.cabType || 'SEDAN'],
        ['Trip Type', booking.tripType || 'ONE_WAY'],
        ['Booking Type', booking.bookingType || 'IMMEDIATE'],
        ['Booking Status', booking.bookingStatus || 'PENDING'],
        ['Payment Type', booking.paymentType || 'CASH'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] },
    });
    
    // Fare Breakdown
    const tableY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Fare Breakdown', 20, tableY);
    
    doc.autoTable({
      startY: tableY + 5,
      head: [['Description', 'Amount']],
      body: [
        ['Distance', `${booking.distanceKm || 0} km`],
        ['Base Fare', `₹${booking.estimatedFare || 0}`],
        ['GST (18%)', `₹${Math.round((booking.estimatedFare || 0) * 0.18)}`],
        ['Total Amount', `₹${booking.estimatedFare || 0}`],
      ],
      foot: [['Total', `₹${booking.estimatedFare || 0}`]],
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] },
      footStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    });
    
    // Terms and Conditions
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Terms & Conditions:', 20, finalY);
    doc.text('1. This is a computer-generated invoice.', 20, finalY + 8);
    doc.text('2. Payment due upon receipt.', 20, finalY + 16);
    doc.text('3. Cancellation charges apply as per policy.', 20, finalY + 24);
    doc.text('4. GST included in the fare.', 20, finalY + 32);
    
    // Thank you message
    doc.setFontSize(12);
    doc.setTextColor(33, 150, 243);
    doc.text('Thank you for choosing our service!', 105, finalY + 50, null, null, 'center');
    
    // Save the PDF
    doc.save(`Invoice_${booking._id}.pdf`);
    
    // Show success message
    alert(`Invoice for booking ${booking._id} downloaded successfully!`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED':
      case 'ARRIVED':
        return 'bg-blue-100 text-blue-800';
      case 'ONGOING':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'CANCELLED':
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const BookingDetailsPopup = ({ booking, onClose }) => {
    if (!booking) return null;

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4 animate-scaleIn">
        <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Details</h2>
              <p className="text-sm text-gray-600">Booking ID: {booking._id}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Ride Details */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${getStatusColor(booking.bookingStatus).split(' ')[0]}`}>
                        {getStatusIcon(booking.bookingStatus)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Status</h3>
                        <p className={`text-sm font-medium ${getStatusColor(booking.bookingStatus).split(' ')[1]}`}>
                          {booking.bookingStatus}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">₹{booking.estimatedFare || 0}</div>
                      <p className="text-sm text-gray-500">Estimated Fare</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date</span>
                      <span className="font-medium">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Type</span>
                      <span className="font-medium flex items-center">
                        {booking.paymentType === 'CASH' ? <Wallet className="h-4 w-4 mr-2" /> :
                         booking.paymentType === 'ONLINE' ? <CreditCard className="h-4 w-4 mr-2" /> :
                         <Navigation className="h-4 w-4 mr-2" />}
                        {booking.paymentType}
                      </span>
                    </div>
                    {booking.distanceKm && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance</span>
                        <span className="font-medium">{booking.distanceKm} km</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ride Route */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Ride Route</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <div className="w-0.5 h-12 bg-blue-200 my-1"></div>
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Pickup</p>
                          <p className="font-medium text-gray-900">{booking.pickup?.addressText || 'N/A'}</p>
                          {booking.scheduledTime && (
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(booking.scheduledTime).toLocaleDateString()}
                              <Clock className="h-4 w-4 ml-4 mr-2" />
                              {new Date(booking.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Drop</p>
                          <p className="font-medium text-gray-900">{booking.drop?.addressText || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Vehicle Details</h3>
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{booking.cabType || 'SEDAN'}</p>
                      <p className="text-sm text-gray-600">Trip Type: {booking.tripType || 'ONE_WAY'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Driver & Actions */}
              <div className="space-y-6">
                {/* OTP Section */}
                {['ASSIGNED', 'ARRIVED', 'ONGOING'].includes(booking.bookingStatus) && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-yellow-100">
                    <h3 className="font-bold text-gray-900 mb-4">Ride OTP</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-4 tracking-widest">
                        {otp || booking.rideOtp || '----'}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Share this OTP with the driver to start your ride
                      </p>
                      <button
                        onClick={async () => {
                          try {
                            const response = await bookingService.getBookingOTP(booking._id);
                            if (response.data.success) {
                              setOtp(response.data.data.otp);
                            }
                          } catch (error) {
                            console.error('Error getting OTP:', error);
                          }
                        }}
                        className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
                      >
                        Refresh OTP
                      </button>
                    </div>
                  </div>
                )}

                {/* Tracking Section */}
                {trackingData && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-100">
                    <h3 className="font-bold text-gray-900 mb-4">Live Tracking</h3>
                    <div className="space-y-4">
                      {trackingData.riderLocation && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Rider Location</span>
                          <span className="font-medium text-sm">
                            Lat: {trackingData.riderLocation.lat.toFixed(4)}, 
                            Lng: {trackingData.riderLocation.lng.toFixed(4)}
                          </span>
                        </div>
                      )}
                      {trackingData.estimatedArrival && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Estimated Arrival</span>
                          <span className="font-medium">
                            {trackingData.estimatedArrival.time} {trackingData.estimatedArrival.unit}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/track/${booking._id}`)}
                        className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
                      >
                        <Map className="h-4 w-4 mr-2" />
                        Open Live Tracking
                      </button>
                    </div>
                  </div>
                )}

                {/* Fare Breakdown */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Fare Breakdown</h3>
                  <div className="space-y-3">
                    {booking.distanceKm && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance</span>
                        <span>{booking.distanceKm.toFixed(1)} km</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Fare</span>
                      <span>₹{booking.estimatedFare || 0}</span>
                    </div>
                    {booking.actualFare && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual Fare</span>
                        <span className="font-bold">₹{booking.actualFare}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{booking.actualFare || booking.estimatedFare || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => downloadInvoice(booking)}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Invoice
                  </button>
                  {['PENDING', 'CONFIRMED', 'ASSIGNED'].includes(booking.bookingStatus) && (
                    <button
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      className="flex-1 py-3 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-70"
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  const totalBookings = stats.totalBookings;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">My Bookings</h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base">Manage your rides and upcoming journeys</p>
            </div>
            <Link 
              to="/book" 
              className="mt-4 md:mt-0 bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm sm:text-base flex items-center"
            >
              <Car className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Book New Ride
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.totalBookings}</div>
                  <div className="text-blue-200 text-sm">Total Bookings</div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-blue-100 text-xs mt-2">All Time</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.upcomingRides}</div>
                  <div className="text-blue-200 text-sm">Upcoming Rides</div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-blue-100 text-xs mt-2">Active</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.completedRides}</div>
                  <div className="text-blue-200 text-sm">Completed Rides</div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-blue-100 text-xs mt-2">History</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">₹{stats.totalSpent}</div>
                  <div className="text-blue-200 text-sm">Total Spent</div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-blue-100 text-xs mt-2">All Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          {['upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 sm:px-6 sm:py-3 font-medium rounded-t-lg transition-colors capitalize whitespace-nowrap text-sm sm:text-base
                ${activeTab === tab 
                  ? 'bg-white border-t border-x border-gray-200 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }
              `}
            >
              {tab} ({bookings[tab].length})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4 sm:space-y-6">
          {bookings[activeTab].length > 0 ? (
            bookings[activeTab].map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row">
                  {/* Booking Info */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                          <span className="ml-3 text-sm text-gray-500">ID: {booking._id.slice(-8)}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {booking.pickup?.addressText || 'Pickup'} → {booking.drop?.addressText || 'Drop'}
                        </h3>
                      </div>
                      <div className="mt-3 sm:mt-0 text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          ₹{booking.estimatedFare || 0}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">Estimated Fare</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Date</div>
                          <div className="font-medium text-sm sm:text-base">
                            {booking.scheduledTime 
                              ? new Date(booking.scheduledTime).toLocaleDateString()
                              : new Date(booking.createdAt).toLocaleDateString()
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Time</div>
                          <div className="font-medium text-sm sm:text-base">
                            {booking.scheduledTime 
                              ? new Date(booking.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'ASAP'
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Car className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Vehicle</div>
                          <div className="font-medium text-sm sm:text-base">{booking.cabType}</div>
                        </div>
                      </div>
                      
                      {booking.distanceKm && (
                        <div className="flex items-center">
                          <Map className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <div>
                            <div className="text-xs sm:text-sm text-gray-600">Distance</div>
                            <div className="font-medium text-sm sm:text-base">{booking.distanceKm} km</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleViewDetails(booking)}
                        className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      <button 
                        onClick={() => downloadInvoice(booking)}
                        className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </button>
                      {['PENDING', 'CONFIRMED', 'ASSIGNED'].includes(booking.bookingStatus) && (
                        <button 
                          onClick={async () => {
                            setSelectedBooking(booking);
                            if (window.confirm('Are you sure you want to cancel this booking?')) {
                              try {
                                await customerService.cancelBooking(booking._id);
                                fetchBookings();
                              } catch (error) {
                                console.error('Error cancelling booking:', error);
                              }
                            }
                          }}
                          className="flex items-center px-3 sm:px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors ml-auto text-sm sm:text-base"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Car className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} bookings
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                {activeTab === 'upcoming' 
                  ? 'Book your next ride and start your journey!'
                  : `You haven't ${activeTab} any rides yet.`
                }
              </p>
              {activeTab === 'upcoming' && (
                <Link
                  to="/book"
                  className="inline-flex items-center bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Book a Ride
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recommended Section for Upcoming Tab */}
        {activeTab === 'upcoming' && bookings.upcoming.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recommended for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { 
                  name: 'Airport Transfer Package', 
                  description: 'Hassle-free airport transfers with flight tracking',
                  price: 'Starts from ₹899',
                  icon: '✈️'
                },
                { 
                  name: 'Outstation Ride', 
                  description: 'Comfortable long-distance travel packages',
                  price: 'Starts from ₹12/km',
                  icon: '🚙'
                },
                { 
                  name: 'City Tour Package', 
                  description: 'Explore the city with our guided tours',
                  price: 'Starts from ₹1,499',
                  icon: '🏙️'
                },
              ].map((rec, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">{rec.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{rec.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-blue-600">{rec.price}</div>
                    <Link to="/services" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                      Explore <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Popup */}
      {showBookingDetails && selectedBooking && (
        <BookingDetailsPopup 
          booking={selectedBooking} 
          onClose={handleCloseDetails} 
        />
      )}

      
    </div>
  );
};

export default MyBookings;