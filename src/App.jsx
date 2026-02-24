import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import { SocketProvider } from "./context/SocketContext";

// Lazy load main pages
const HomePage = React.lazy(() => import("./pages/HomePage"));
const CustomerLogin = React.lazy(() => import("./pages/auth/CustomerLogin"));
const RiderLogin = React.lazy(() => import("./pages/auth/RiderLogin"));
const CustomerRegister = React.lazy(
  () => import("./pages/auth/CustomerRegister"),
);
const RiderRegister = React.lazy(() => import("./pages/auth/RiderRegister"));
const RiderRegistrationSuccess = React.lazy(
  () => import("./pages/auth/RiderRegistrationSuccess"),
);
const CustomerDashboard = React.lazy(
  () => import("./pages/Customer/CustomerDashboard"),
);
const RiderDashboard = React.lazy(() => import("./pages/Rider/RiderDashboard"));
// const BookingPage = React.lazy(() => import("./pages/Customer/BookingPage"));
const MyBookings = React.lazy(() => import("./pages/Customer/MyBookings"));
const ServicesPage = React.lazy(() => import("./pages/ServicesPage"));
const GalleryPage = React.lazy(() => import("./pages/GalleryPage"));
const AboutUsPage = React.lazy(() => import("./pages/About"));
const ContactUsPage = React.lazy(() => import("./pages/Contact"));
const AllVehicles = React.lazy(() => import("./components/home/AllVehicles"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const VerifyEmail = React.lazy(() => import('./pages/auth/VerifyEmail'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const BookingFlowTest = React.lazy(() => import('./components/BookingFlowTest'));
const RideTrackingPage = React.lazy(() => import('./pages/Customer/RideTrackingPage'));
const PaymentPage = React.lazy(() => import('./pages/Customer/PaymentPage'));

// Admin Routes (whole admin section - lazy loaded)
const AdminRoutes = React.lazy(() => import("./routes/AdminRoutes"));

// Protected Route
import ProtectedRoute from "./components/auth/ProtectedRoutes";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <SocketProvider>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {/* Wrap Routes with Suspense for lazy loading */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
              <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
              <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactUsPage /></Layout>} />
              <Route path="/fleet" element={<Layout><AllVehicles /></Layout>} />
              
              {/* Auth Routes (Without Layout) */}
              <Route path="/login/customer" element={<CustomerLogin />} />
              <Route path="/login/rider" element={<RiderLogin />} />
              <Route path="/register/customer" element={<CustomerRegister />} />
              <Route path="/rider/register" element={<RiderRegister />} />
              <Route path="/rider/registration-success" element={<RiderRegistrationSuccess />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/checkout" element={<CheckoutPage />} />
             
              <Route path="/ride-tracking" element={<RideTrackingPage />} />
              <Route path="/customer/payment" element={
                <ProtectedRoute roles={["USER", "customer"]}>
                  <Layout>
                    <PaymentPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/test-booking" element={<Layout><BookingFlowTest /></Layout>} />
              
              {/* Protected Customer Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["USER", "customer"]}>
                    <Layout>
                      <CustomerDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute roles={["USER", "customer"]}>
                    <Layout>
                      <CustomerDashboard initialView="settings" />
                    </Layout>
                  </ProtectedRoute>
                }
              />
             
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute roles={["USER", "customer"]}>
                    <Layout>
                      <MyBookings />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Protected Rider Routes */}
              <Route
                path="/rider/dashboard"
                element={
                  <ProtectedRoute roles={["RIDER", "rider"]}>
                    <Layout>
                      <RiderDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* ── Admin section ── separate layout & protection ── */}
              <Route path="/admin/*" element={<AdminRoutes />} />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          </SocketProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;