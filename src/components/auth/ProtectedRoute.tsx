import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { refreshTokenApi } from '@/api/auth';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('jwt-token');
        
        if (!token) {
          // No token, try to refresh from cookies
          const [userData, err] = await refreshTokenApi();
          
          if (err || !userData) {
            // No valid session, redirect to signin
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
          
          // Valid session found, update user context
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists, try to validate it by refreshing
          const [userData, err] = await refreshTokenApi();
          
          if (err || !userData) {
            // Token is invalid, remove it and redirect to signin
            localStorage.removeItem('jwt-token');
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
          
          // Token is valid, update user context with real data
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, [setUser]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to signin with return URL
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <Outlet />;
}
