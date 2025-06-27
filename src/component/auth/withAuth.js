'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/auth';

// Higher Order Component for route protection
export function withAuth(WrappedComponent, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
      checkAuthentication();
    }, []);

    const checkAuthentication = () => {
      try {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          router.push('/auth/login');
          return;
        }

        const userData = AuthService.getUser();
        
        // Check role requirements
        if (requiredRole) {
          const userRole = userData?.role;
          
          if (!hasRequiredRole(userRole, requiredRole)) {
            alert('Access denied. Insufficient permissions.');
            AuthService.logout();
            return;
          }
        }

        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    const hasRequiredRole = (userRole, requiredRole) => {
      if (!userRole) return false;
      
      switch (requiredRole) {
        case 'admin':
          return userRole === 'admin';
        case 'manager':
          return userRole === 'admin' || userRole === 'manager';
        case 'employee':
          return ['admin', 'manager', 'employee'].includes(userRole);
        default:
          return true;
      }
    };

    // Loading state
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    // User not authenticated (will redirect)
    if (!user) {
      return null;
    }

    // Render protected component
    return <WrappedComponent {...props} user={user} />;
  };
}

// Simple hook for getting current user
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      setUser(AuthService.getUser());
    }
    setLoading(false);
  }, []);

  return { user, loading };
}