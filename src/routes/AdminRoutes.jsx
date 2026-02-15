import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load admin pages
const AdminLogin = React.lazy(() => import('../pages/Admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('../components/Admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('../pages/Admin/AdminDashboard'));
const ManageRiders = React.lazy(() => import('../pages/Admin/ManageRiders'));
const ManageCabs = React.lazy(() => import('../pages/Admin/ManageCabs'));
const ManageBookings = React.lazy(() => import('../pages/Admin/ManageBookings'));
const ManageUsers = React.lazy(() => import('../pages/Admin/ManageUsers'));
const ManagePricing = React.lazy(() => import('../pages/Admin/ManagePricing'));
const ManagePayouts = React.lazy(() => import('../pages/Admin/ManagePayouts'));
const AdminAnalytics = React.lazy(() => import('../pages/Admin/AdminAnalytics'));
const AdminSettings = React.lazy(() => import('../pages/Admin/AdminSettings'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Admin Routes Component
const AdminRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Admin Login */}
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="riders" element={<ManageRiders />} />
          <Route path="cabs" element={<ManageCabs />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="pricing" element={<ManagePricing />} />
          <Route path="payouts" element={<ManagePayouts />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;