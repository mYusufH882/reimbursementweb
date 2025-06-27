'use client';

import { useState } from 'react';
import Button from '@/component/ui/Button';
import AuthService from '@/services/auth';

export default function LogoutButton({ 
  variant = 'outline', 
  size = 'md', 
  className = '',
  showConfirm = true,
  redirectTo = '/auth/auth/login'
}) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      // Show confirmation if enabled
      // if (showConfirm) {
      //   const confirmed = window.confirm('Are you sure you want to logout?');
      //   if (!confirmed) return;
      // }

      setLoading(true);
      
      // Call logout service
      await AuthService.logout();
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Force logout even if API fails
      AuthService.forceLogout();
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={loading}
      loading={loading}
      className={className}
    >
      {loading ? 'Signing Out...' : 'Sign Out'}
    </Button>
  );
}

// Quick logout hook for component
export function useLogout() {
  const [loading, setLoading] = useState(false);

  const logout = async (showConfirm = true) => {
    try {
      // if (showConfirm && !window.confirm('Are you sure you want to logout?')) {
      //   return false;
      // }

      setLoading(true);
      await AuthService.logout();
      return true;
      
    } catch (error) {
      console.error('Logout error:', error);
      AuthService.forceLogout();
      return true;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}