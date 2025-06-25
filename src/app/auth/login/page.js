"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (loginData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data in localStorage (mock)
      const userData = {
        name: loginData.user.name,
        email: loginData.user.email,
        role: loginData.user.role,
        loginTime: new Date().toISOString(),
        remember: loginData.remember
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
      
      // Role-based redirect
      const redirectPath = getRoleBasedRedirect(loginData.user.role);
      
      // Show success message (optional)
      console.log(`Login successful! Redirecting to ${redirectPath}...`);
      
      // Redirect to appropriate dashboard
      router.push(redirectPath);
      
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
    }
  };

  const getRoleBasedRedirect = (role) => {
    switch (role) {
      case 'employee':
        return '/employee/dashboard';
      case 'manager':
        return '/manager/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/employee/dashboard';
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm 
        onLogin={handleLogin}
        loading={loading}
      />
    </AuthLayout>
  );
}