import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
  allowedRole: UserRole;
}

/**
 * Protects Customer and Administrator route trees.
 * Redirects unauthenticated visitors to /auth/login and enforces strict separation
 * between Customer (/app/*) and Administrator (/admin/*) environments.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.role !== allowedRole) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
