import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { UserRole } from '@/types/user';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export function RoleBasedRoute({ allowedRoles, fallbackPath = '/unauthorized' }: RoleBasedRouteProps) {
  const { user } = useUser();

  // Check if user's role is in the allowed roles
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    // User doesn't have access, redirect to fallback or unauthorized page
    return <Navigate to={fallbackPath} replace />;
  }

  // User has access, render the protected content
  return <Outlet />;
}

// Convenience components for specific roles
export function AdminOnlyRoute() {
  return <RoleBasedRoute allowedRoles={['main-admin']} />;
}

export function PartnerOnlyRoute() {
  return <RoleBasedRoute allowedRoles={['partner-admin']} />;
}

export function AdminAndPartnerRoute() {
  return <RoleBasedRoute allowedRoles={['main-admin', 'partner-admin']} />;
}
