'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/auth';

export function useAuth(requiredRole = null) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const authenticated = AuthService.isAuthenticated();
      const userData = AuthService.getUser();

      if (!authenticated || !userData) {
        // Not authenticated, redirect to login
        router.push('/auth/login');
        return;
      }

      // Check role requirement
      if (requiredRole && !checkRole(userData.role, requiredRole)) {
        // User doesn't have required role
        alert('Access denied. Insufficient permissions.');
        AuthService.logout();
        return;
      }

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const checkRole = (userRole, requiredRole) => {
    if (requiredRole === 'admin') {
      return userRole === 'admin';
    }
    if (requiredRole === 'manager') {
      return userRole === 'admin' || userRole === 'manager';
    }
    if (requiredRole === 'employee') {
      return ['admin', 'manager', 'employee'].includes(userRole);
    }
    return true;
  };

  const logout = () => {
    AuthService.logout();
  };

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    isAdmin: AuthService.isAdmin(),
    isManager: AuthService.isManager(),
    isEmployee: AuthService.isEmployee(),
  };
}

// Route protection component
export function ProtectedRoute({ children, requiredRole = null }) {
  const { loading, isAuthenticated } = useAuth(requiredRole);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
}