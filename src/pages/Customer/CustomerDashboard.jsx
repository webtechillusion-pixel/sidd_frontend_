import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  LogOut,
  Settings as SettingsIcon,
  HelpCircle,
  BarChart3,
  History,
  Menu,
  X,
  ArrowRight,
  Camera,
  Bell,
  MapPin,
  Star,
  Plus,
  Loader,
  CreditCard,
  Phone,
} from "lucide-react";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import customerService from "../../services/customerService";

// Import components
import CursorFix from "../../components/CursorFix";
import ActiveRideTracker from "./ActiveRideTracker";
import UserProfileSummary from "./UserProfileSummary";
import Overview from "./Overview";
import Statistics from "./Statistics";
import RideHistory from "./RideHistory";
import Settings from "./Settings";
import HelpSupport from "./HelpSupport";
import Notifications from "./Notifications";
import SavedLocations from "./SavedLocations";
import MyReviews from "./MyReviews";
import PaymentHistory from "./PaymentHistory";

const CustomerDashboard = ({ initialView: initialViewProp }) => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(initialViewProp || "overview");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRide, setActiveRide] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: { name: "", phone: "", relationship: "" },
  });

  // Data states
  const [bookingHistory, setBookingHistory] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [notificationPrefs, setNotificationPrefs] = useState({
    bookingUpdates: true,
    promotions: false,
    reminders: true,
    cashPaymentReminders: true,
    driverUpdates: true,
    ratingReminders: true,
  });
  const [supportTickets, setSupportTickets] = useState([]);
  const [isFetchingAdditional, setIsFetchingAdditional] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Statistics data
  const [statistics, setStatistics] = useState({
    monthlyRides: 0,
    monthlySpending: 0,
    averageRating: 0,
    carbonSaved: "0 kg",
    averageFare: "₹0",
    rideFrequency: "0 rides/week",
    totalDistance: "0 km",
  });

  const loyaltyTiers = [
    {
      name: "Silver",
      points: 500,
      benefits: ["Priority Support", "5% Discount"],
    },
    { name: "Gold", points: 1000, benefits: ["10% Discount", "Free Upgrades"] },
    {
      name: "Platinum",
      points: 2000,
      benefits: ["15% Discount", "Dedicated Support", "Free Cancellations"],
    },
  ];

  // Fix cursor issue on component mount
  useEffect(() => {
    // Force cursor to be visible
    document.body.style.cursor = 'auto';
    document.documentElement.style.cursor = 'auto';
    
    // Remove any potential cursor blocking styles
    const style = document.createElement('style');
    style.textContent = `
      * { cursor: auto !important; }
      button, a, [role="button"] { cursor: pointer !important; }
      input, textarea { cursor: text !important; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch all user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const response = await authService.getProfile();
        const user = response.data;

        if (!user) {
          throw new Error("User data not found in response");
        }

        // Create user data object using backend user schema
        const userDataObj = {
          _id: user._id || user.id,
          name: user.name || "Customer",
          email: user.email || "",
          phone: user.phone || "",
          avatar:
            user.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Customer")}&background=0D8ABC&color=fff`,
          membershipTier: user.membershipTier || "Silver",
          loyaltyPoints: user.loyaltyPoints || 0,
          walletBalance: user.walletBalance || 0,
          totalRides: user.totalRides || 0,
          averageRating: user.averageRating || 0,
          isEmailVerified: user.isEmailVerified || false,
          role:
            user.role === "USER"
              ? "customer"
              : user.role?.toLowerCase() || "customer",
        };

        setUserData(userDataObj);

        // Initialize profile form
        setProfileForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          emergencyContact: user.emergencyContact || {
            name: "",
            phone: "",
            relationship: "",
          },
        });

        // For now, skip active ride check until booking APIs are ready
        console.log("Skipping active ride fetch - API not ready");

        // Fetch additional data
        await fetchAdditionalData();

        toast.success("Dashboard loaded successfully!");
      } catch (error) {
        console.error("Failed to fetch user data:", error);

        // Try to get user from localStorage as fallback
        try {
          const storedUser = authService.getCurrentUserFromStorage();
          if (storedUser) {
            console.log("Using fallback data from localStorage:", storedUser);

            const fallbackUserData = {
              _id: storedUser._id || storedUser.id,
              name: storedUser.name || "Customer",
              email: storedUser.email || "",
              phone: storedUser.phone || "",
              avatar:
                storedUser.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(storedUser.name || "Customer")}&background=0D8ABC&color=fff`,
              membershipTier: "Silver",
              loyaltyPoints: 0,
              walletBalance: 0,
              totalRides: 0,
              averageRating: 0,
              isEmailVerified: storedUser.isEmailVerified || false,
              role:
                storedUser.role === "USER"
                  ? "customer"
                  : storedUser.role?.toLowerCase() || "customer",
            };

            setUserData(fallbackUserData);
            setProfileForm({
              name: storedUser.name || "Customer",
              email: storedUser.email || "",
              phone: storedUser.phone || "",
              emergencyContact: { name: "", phone: "", relationship: "" },
            });

            toast.info("Using cached profile data");
            return;
          }
        } catch (storageError) {
          console.error("Failed to get user from localStorage:", storageError);
        }

        // Minimal fallback if everything fails
        const fallbackUserData = {
          _id: "guest",
          name: "Customer",
          email: "",
          phone: "",
          avatar: `https://ui-avatars.com/api/?name=Customer&background=0D8ABC&color=fff`,
          membershipTier: "Silver",
          loyaltyPoints: 0,
          walletBalance: 0,
          totalRides: 0,
          averageRating: 0,
          isEmailVerified: false,
          role: "customer",
        };

        setUserData(fallbackUserData);
        setProfileForm({
          name: "Customer",
          email: "",
          phone: "",
          emergencyContact: { name: "", phone: "", relationship: "" },
        });

        toast.error(
          "Failed to load profile. Please refresh or logout/login again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch additional data

  const fetchAdditionalData = async () => {
    try {
      setIsFetchingAdditional(true);

      // Fetch bookings using the correct API
      try {
        const response = await customerService.getBookings({
          page: 1,
          limit: 100,
        });
        const bookingsData = response.data?.data || [];
        setBookingHistory(bookingsData);
        calculateStatistics(bookingsData);

        // Try to get active ride from bookings
        const activeBooking = bookingsData.find(
          (booking) =>
            booking.bookingStatus === "ACCEPTED" ||
            booking.bookingStatus === "PICKED_UP" ||
            booking.bookingStatus === "ONGOING" ||
            booking.bookingStatus === "IN_PROGRESS",
        );

        if (activeBooking) {
          setActiveRide({
            id: activeBooking._id,
            pickup: activeBooking.pickup?.addressText || "Pickup Location",
            drop: activeBooking.drop?.addressText || "Drop Location",
            eta: "15 min",
            otp: activeBooking.bookingStatus === "ACCEPTED" ? activeBooking.rideOtp : null, // Hide OTP after ride starts
            status: activeBooking.bookingStatus,
            driver: {
              name: activeBooking.riderId?.name || "Driver",
              photo:
                activeBooking.riderId?.photo ||
                `https://ui-avatars.com/api/?name=Driver&background=4F46E5&color=fff`,
              rating: 4.5,
              vehicleNumber: activeBooking.cabId?.cabNumber || "Vehicle Number",
            },
          });
        } else {
          setActiveRide(null);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast.error("Failed to load booking history");
        setBookingHistory([]);
      }

      // Fetch addresses
      try {
        const response = await customerService.getAddresses();
        const addresses = response.data?.data || [];
        setSavedLocations(addresses);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        toast.error("Failed to load saved addresses");
        setSavedLocations([]);
      }
    } catch (error) {
      console.error("Error in fetchAdditionalData:", error);
    } finally {
      setIsFetchingAdditional(false);
    }
  };

  // Calculate statistics from booking history
  const calculateStatistics = (bookings) => {
    if (!bookings || !bookings.length) {
      setStatistics({
        monthlyRides: 0,
        monthlySpending: 0,
        averageRating: 0,
        carbonSaved: "0 kg",
        averageFare: "₹0",
        rideFrequency: "0 rides/week",
        totalDistance: "0 km",
      });
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter for current month
    const monthlyBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt || booking.date || now);
      return (
        bookingDate.getMonth() === currentMonth &&
        bookingDate.getFullYear() === currentYear
      );
    });

    // Calculate total spending
    const monthlySpending = monthlyBookings.reduce((sum, booking) => {
      const fare = parseFloat(
        booking.fare?.replace(/[^0-9.]/g, "") || booking.amount || 0,
      );
      return sum + fare;
    }, 0);

    // Calculate average rating
    const averageRating =
      bookings.length > 0
        ? (
            bookings.reduce((sum, booking) => sum + (booking.rating || 0), 0) /
            bookings.length
          ).toFixed(1)
        : 0;

    // Calculate total distance
    const totalDistance = bookings.reduce(
      (sum, booking) => sum + (booking.distance || 50),
      0,
    );

    // Calculate carbon saved (approximate: 120g/km for cars)
    const carbonSaved = (totalDistance * 0.12).toFixed(1);

    // Calculate average fare
    const averageFare =
      monthlyBookings.length > 0 ? monthlySpending / monthlyBookings.length : 0;

    // Calculate ride frequency (per week)
    const firstBookingDate = new Date(
      Math.min(
        ...bookings.map((b) => new Date(b.date || b.createdAt).getTime()),
      ),
    );
    const weeks = Math.max(
      1,
      Math.floor((now - firstBookingDate) / (7 * 24 * 60 * 60 * 1000)),
    );
    const rideFrequency = (bookings.length / (weeks || 1)).toFixed(1);

    setStatistics({
      monthlyRides: monthlyBookings.length,
      monthlySpending: Math.round(monthlySpending),
      averageRating,
      carbonSaved: `${carbonSaved} kg`,
      averageFare: `₹${Math.round(averageFare)}`,
      rideFrequency: `${rideFrequency} rides/week`,
      totalDistance: `${Math.round(totalDistance)} km`,
    });
  };

  // Profile update function
  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await authService.updateProfile({
        name: updatedData.name,
        phone: updatedData.phone,
      });

      // Update local state
      if (response.data?.data) {
        setUserData((prev) => ({
          ...prev,
          name: response.data.data.name,
          phone: response.data.data.phone,
        }));
      }

      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      return false;
    }
  };

  // Profile picture update
  const handleProfilePictureUpdate = async (imageFile) => {
    try {
      const response = await authService.uploadProfileImage(imageFile);

      console.log("Upload response:", response); // Debug log

      // Try different response structures
      const newAvatar =
        response.data?.photo ||
        response.data?.user?.photo ||
        response.data?.profilePicture ||
        response.data?.user?.profilePicture ||
        response.data?.data?.photo;

      if (newAvatar) {
        setUserData((prev) => ({
          ...prev,
          avatar: newAvatar,
        }));
        toast.success("Profile picture updated successfully!");
        return true;
      } else {
        // If no URL returned, try to get it from the user profile
        const profileResponse = await authService.getProfile();
        if (profileResponse.data?.photo) {
          setUserData((prev) => ({
            ...prev,
            avatar: profileResponse.data.photo,
          }));
          toast.success("Profile picture updated successfully!");
          return true;
        } else {
          toast.error("Profile picture updated but could not get the new URL");
          return false;
        }
      }
    } catch (error) {
      console.error("Profile picture upload error:", error);
      toast.error(error.message || "Failed to upload profile picture");
      return false;
    }
  };

  // Delete profile picture
  const handleDeleteProfilePicture = async () => {
    if (
      window.confirm("Are you sure you want to remove your profile picture?")
    ) {
      try {
        await authService.deleteProfileImage();

        // Reset to default avatar
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0D8ABC&color=fff`;
        setUserData((prev) => ({
          ...prev,
          avatar: defaultAvatar,
        }));

        toast.success("Profile picture removed successfully!");
        return true;
      } catch (error) {
        console.error("Delete profile picture error:", error);
        toast.error(error.message || "Failed to remove profile picture");
        return false;
      }
    }
    return false;
  };

  // Save location
 
const handleSaveLocation = async (locationData) => {
  try {
    const response = await customerService.addAddress({
      label: locationData.type?.toUpperCase() || 'OTHER',
      title: locationData.name,
      addressLine: locationData.address,
      landmark: locationData.landmark || '',
      city: locationData.city || 'City',
      state: locationData.state || 'State',
      pincode: locationData.pincode || '000000',
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(locationData.coordinates?.lng || 0),
          parseFloat(locationData.coordinates?.lat || 0)
        ]
      },
      contactName: userData.name,
      contactPhone: userData.phone,
      isDefault: false
    });
    
    toast.success('Location saved successfully!');
    return response.data;
  } catch (error) {
    console.error('Failed to save location:', error);
    toast.error('Failed to save location');
    throw error;
  }
};

  // Submit review
 
const handleSubmitReview = async (reviewData) => {
  try {
    if (!reviewData.bookingId) {
      throw new Error('Booking ID is required');
    }
    
    const response = await customerService.rateRider(
      reviewData.bookingId,
      reviewData.rating.overall,
      reviewData.review
    );
    
    toast.success('Review submitted successfully!');
    return response.data;
  } catch (error) {
    console.error('Failed to submit review:', error);
    toast.error('Failed to submit review');
    throw error;
  }
};

  // Create support ticket (stub function)
  const handleCreateSupportTicket = async (ticketData) => {
    toast.info("Support ticket feature is coming soon!");
    return { success: true, message: "Support ticket created (stub)" };
  };

  // Update notification preferences (stub function)
  const handleUpdateNotificationPrefs = async (preferences) => {
    setNotificationPrefs(preferences);
    toast.success("Notification preferences updated (stub)!");
    return true;
  };

  // Navigation functions
  const handleTrackNow = () => {
    if (activeRide) {
      navigate("/track-ride", {
        state: {
          rideId: activeRide.id,
          driver: activeRide.driver,
          pickup: activeRide.pickup,
          drop: activeRide.drop,
        },
      });
    } else {
      toast.info("No active ride to track.");
    }
  };

const handleLogout = async () => {
    // Clear everything first
    localStorage.clear();
    sessionStorage.clear();
    // Clear context state
    authLogout();
    // Hard redirect to home to ensure clean state
    window.location.href = '/';
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return (
          <Overview
            upcomingRides={bookingHistory.filter(
              (b) => b.status === "upcoming" || b.status === "confirmed",
            )}
            recentActivity={[]}
            statistics={statistics}
            loyaltyTiers={loyaltyTiers}
            userData={userData}
            onViewRideHistory={() => setActiveView("ride-history")}
            onViewDetailedStats={() => setActiveView("statistics")}
            onViewHelp={() => setActiveView("help")}
            bookingHistory={bookingHistory}
          />
        );
      case "ride-history":
        return (
          <RideHistory
            rideHistory={bookingHistory}
            onBack={() => setActiveView("overview")}
            onSubmitReview={handleSubmitReview}
          />
        );
      case "settings":
        return (
          <Settings
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            onUpdate={handleProfileUpdate}
            onProfilePictureUpdate={handleProfilePictureUpdate}
            onDeleteProfilePicture={handleDeleteProfilePicture}
            currentAvatar={userData?.avatar}
            onBack={() => setActiveView("overview")}
          />
        );
      case "help":
        return (
          <HelpSupport
            onBack={() => setActiveView("overview")}
            supportTickets={supportTickets}
            onCreateTicket={handleCreateSupportTicket}
          />
        );
      case "statistics":
        return (
          <Statistics
            statistics={statistics}
            bookingHistory={bookingHistory}
            onBack={() => setActiveView("overview")}
          />
        );
      case "notifications":
        return (
          <Notifications
            preferences={notificationPrefs}
            onUpdate={handleUpdateNotificationPrefs}
            onBack={() => setActiveView("overview")}
          />
        );
      case "locations":
        return (
          <SavedLocations
            locations={savedLocations}
            onSave={handleSaveLocation}
            onBack={() => setActiveView("overview")}
          />
        );
      case "reviews":
        return (
          <MyReviews
            reviews={[]}
            onSubmitReview={handleSubmitReview}
            onBack={() => setActiveView("overview")}
          />
        );

      case "payment-history":
        return <PaymentHistory onBack={() => setActiveView("overview")} />;
      default:
        return (
          <Overview
            upcomingRides={bookingHistory.filter(
              (b) => b.status === "upcoming" || b.status === "confirmed",
            )}
            recentActivity={[]}
            statistics={statistics}
            loyaltyTiers={loyaltyTiers}
            userData={userData}
            onViewRideHistory={() => setActiveView("ride-history")}
            onViewDetailedStats={() => setActiveView("statistics")}
            onViewHelp={() => setActiveView("help")}
            bookingHistory={bookingHistory}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            User Data Not Found
          </h3>
          <p className="text-gray-600 mb-4">Please login again</p>
          <button
            onClick={() => navigate("/login/customer")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CursorFix />
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <Link to="/" className="text-xl font-bold text-red-600">
          MyTravelRide
        </Link>
        <div className="w-10"></div>
      </div>

      <div className="pt-16 lg:pt-0 lg:grid lg:grid-cols-[288px_1fr]">
        {/* Sidebar Navigation */}
        <div
          className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:min-h-screen
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          h-full
        `}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-200 flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold text-red-600 block mb-1"
              >
                MyTravelRide
              </Link>
              <p className="text-sm text-gray-500">Customer Dashboard</p>
            </div>

            {/* User Profile Section */}
            <div className="p-5 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-12 h-12 rounded-full border-2 border-white"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0D8ABC&color=fff`;
                    }}
                  />
                  <button
                    onClick={() => setActiveView("settings")}
                    className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
                    title="Edit profile"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {userData.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {userData.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <div
                      className={`text-xs px-2 py-0.5 rounded ${userData.isEmailVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {userData.isEmailVerified ? "Verified" : "Not Verified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="p-4">
                <nav className="space-y-1 mb-6">
                  <button
                    onClick={() => setActiveView("overview")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "overview" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    <span className="font-medium">Dashboard</span>
                    {isFetchingAdditional && activeView === "overview" && (
                      <Loader className="w-4 h-4 ml-auto animate-spin text-gray-400" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveView("ride-history")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "ride-history" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <History className="w-5 h-5 mr-3" />
                    <span className="font-medium">Ride History</span>
                  </button>

                  <button
                    onClick={() => setActiveView("statistics")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "statistics" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    <span className="font-medium">Statistics</span>
                  </button>

                  <button
                    onClick={() => setActiveView("locations")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "locations" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <MapPin className="w-5 h-5 mr-3" />
                    <span className="font-medium">Saved Locations</span>
                  </button>

                  <button
                    onClick={() => setActiveView("payment-history")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "payment-history" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span className="font-medium">Payment History</span>
                  </button>
                </nav>

                <div className="mb-8">
                  <h4 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Account
                  </h4>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveView("settings")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "settings" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <SettingsIcon className="w-5 h-5 mr-3" />
                      <span className="font-medium">Settings</span>
                    </button>

                    <button
                      onClick={() => setActiveView("notifications")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "notifications" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <Bell className="w-5 h-5 mr-3" />
                      <span className="font-medium">Notifications</span>
                    </button>

                    <button
                      onClick={() => setActiveView("reviews")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "reviews" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <Star className="w-5 h-5 mr-3" />
                      <span className="font-medium">My Reviews</span>
                    </button>

                    <button
                      onClick={() => setActiveView("help")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeView === "help" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <HelpCircle className="w-5 h-5 mr-3" />
                      <span className="font-medium">Help & Support</span>
                    </button>

                    <button
                      onClick={() => navigate("/")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gray-50`}
                    >
                      <Home className="w-5 h-5 mr-3" />
                      <span className="font-medium">Go to Home</span>
                      <ArrowRight className="w-4 h-4 ml-auto text-gray-400" />
                    </button>
                  </nav>
                </div>

                {/* Active Ride Card in Sidebar */}
                {activeRide && (
                  <div className="mx-2">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
                      <h3 className="font-semibold text-lg mb-3">
                        Active Ride
                      </h3>
                      <div className="space-y-3">
                        {/* Driver Status */}
                        <div className="bg-white bg-opacity-20 rounded-lg p-2">
                          <div className="flex items-center">
                            <span className="text-sm mr-2">
                              {activeRide.status === 'ACCEPTED' ? '🚗' : 
                               activeRide.status === 'ONGOING' ? '🛣️' : '✅'}
                            </span>
                            <span className="text-xs font-medium">
                              {activeRide.status === 'ACCEPTED' ? 'Driver is coming to pickup' :
                               activeRide.status === 'ONGOING' ? 'Trip in progress' : 'Ride completed'}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs opacity-90 mb-1">From</p>
                          <p className="font-medium text-sm">
                            {activeRide.pickup}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-90 mb-1">To</p>
                          <p className="font-medium text-sm">
                            {activeRide.drop}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <div>
                            <p className="text-xs opacity-90">ETA</p>
                            <p className="text-xl font-bold">
                              {activeRide.eta}
                            </p>
                          </div>
                          <span className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                            Live
                          </span>
                        </div>
                        <div className="pt-3 border-t border-red-400 flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={
                                activeRide.driver?.photo ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(activeRide.driver?.name || "Driver")}&background=4F46E5&color=fff`
                              }
                              alt={activeRide.driver?.name || "Driver"}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {activeRide.driver?.name || "Driver"}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs opacity-90 mr-2">
                                  Rating
                                </span>
                                <span className="bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold">
                                  {activeRide.driver?.rating || "4.5"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* OTP Display - Prominent */}
                          {activeRide.otp && (
                            <div className="bg-white rounded-lg p-3 text-center border-2 border-yellow-400">
                              <p className="text-xs text-red-600 font-semibold mb-1">SHARE OTP</p>
                              <div className="text-2xl font-bold text-red-600 tracking-widest">
                                {activeRide.otp}
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleTrackNow}
                          className="w-full bg-white text-red-600 py-2.5 rounded-lg font-semibold mt-2 hover:bg-gray-100 transition-colors text-sm"
                        >
                          Track Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {activeView === "overview" && (
            <UserProfileSummary userData={userData} />
          )}

          <div className={activeView === "overview" ? "mt-4" : ""}>
            {renderActiveView()}
          </div>
        </div>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          ></div>
        )}
      </div>
      
      {/* Simple Chat for Active Ride */}
      {activeRide && (
        <button
          onClick={() => window.location.href = `tel:${activeRide.driver?.phone}`}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-40"
        >
          <Phone className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default CustomerDashboard;
