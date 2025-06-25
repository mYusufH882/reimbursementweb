"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (registrationData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user creation
      const newUser = {
        id: 'user_' + Date.now(),
        name: registrationData.name,
        email: registrationData.email,
        role: 'employee', // Default role
        department: 'general',
        monthlyLimit: 5000000, // Default 5M IDR
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      // Store registration data (mock)
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      // Show success and redirect
      alert(`Account created successfully for ${newUser.name}!\n\nYou can now login with:\nEmail: ${newUser.email}\nRole: Employee`);
      
      router.push('/auth/login');
      
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our reimbursement management system"
    >
      <RegisterForm 
        onRegister={handleRegister}
        loading={loading}
      />
    </AuthLayout>
  );
}