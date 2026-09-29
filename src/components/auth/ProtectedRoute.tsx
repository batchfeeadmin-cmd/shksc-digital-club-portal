import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  requiredPermission?: string;
  requireRoot?: boolean;
}

const getDashboardPath = (role: Role): string => {
  if (role === 'root_admin' || role === 'sub_admin') return '/admin/root/dashboard';
  if (role === 'club_admin') return '/admin/club/dashboard';
  if (role === 'student') return '/student/dashboard';
  return '/';
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requiredPermission,
  requireRoot = false
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  if (requireRoot && user.role !== 'root_admin') {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  if (
    requiredPermission &&
    user.role === 'sub_admin' &&
    !user.permissions?.includes(requiredPermission)
  ) {
    return <Navigate to="/admin/root/dashboard" replace />;
  }

  return <Outlet />;
};

export const RoleGuard: React.FC<{ allowedRoles: Role[], children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) return null;
  if (!allowedRoles.includes(user.role)) return null;
  return <>{children}</>;
};
