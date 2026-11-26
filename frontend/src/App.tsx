import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from './pages/auth/AuthPages';
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import {
  CustomerProfilePage,
  CustomerServicesPage,
  CustomerTransactionsPage,
  CustomerWalletPage,
  ServicePlaceholderPage,
} from './pages/customer/CustomerPortalPages';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import {
  AdminServicesPage,
  AdminSettingsPage,
  AdminTransactionsPage,
  AdminUsersPage,
  AdminWalletsPage,
} from './pages/admin/AdminManagementPages';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

        {/* Authentication Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Customer Environment (/app/*) */}
        <Route element={<ProtectedRoute allowedRole="customer" />}>
          <Route path="/app" element={<CustomerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboardPage />} />
            <Route path="services" element={<CustomerServicesPage />} />
            <Route path="services/:slug" element={<ServicePlaceholderPage />} />
            <Route path="wallet" element={<CustomerWalletPage />} />
            <Route path="transactions" element={<CustomerTransactionsPage />} />
            <Route path="profile" element={<CustomerProfilePage />} />
          </Route>
        </Route>

        {/* Protected Administrator Environment (/admin/*) */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="transactions" element={<AdminTransactionsPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="wallets" element={<AdminWalletsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
