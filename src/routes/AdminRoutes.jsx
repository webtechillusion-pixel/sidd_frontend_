import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Import admin pages directly
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageRiders from '../pages/Admin/ManageRiders';
import ManageCabs from '../pages/Admin/ManageCabs';
import ManageBookings from '../pages/Admin/ManageBookings';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManagePricing from '../pages/Admin/ManagePricing';
import ManagePayouts from '../pages/Admin/ManagePayouts';
import AdminAnalytics from '../pages/Admin/AdminAnalytics';
import AdminSettings from '../pages/Admin/AdminSettings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Additional check to ensure admin is valid
  try {
    if (!admin || typeof admin !== 'object') {
      return <Navigate to="/admin/login" replace />;
    }
    if (!admin._id) {
      return <Navigate to="/admin/login" replace />;
    }
  } catch (e) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Admin Routes Component
const AdminRoutes = () => {
  return (
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
  );
};

export default AdminRoutes;
