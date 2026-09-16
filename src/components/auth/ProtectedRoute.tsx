import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If it's a sub_admin trying to access root_admin, and root_admin is allowed, let them pass if they have permission
    // Wait, since we are doing permission check in the sidebar and components, allowing sub_admin to access root_admin routes is fine.
    // We just need to check if the role is allowed.
    if (allowedRoles.includes('root_admin') && user.role === 'sub_admin') {
      return <Outlet />;
    }

    // Otherwise redirect them to their dashboard
    if (user.role === 'root_admin' || user.role === 'sub_admin') return <Navigate to="/admin/root/dashboard" replace />;
    if (user.role === 'club_admin') return <Navigate to="/admin/club/dashboard" replace />;
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const RoleGuard: React.FC<{ allowedRoles: Role[], children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) return null;
  if (allowedRoles.includes('root_admin') && user.role === 'sub_admin') return <>{children}</>;
  if (!allowedRoles.includes(user.role)) return null;
  return <>{children}</>;
};
