'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Input from '@/component/ui/Input';
import AuthService from '@/services/auth';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already authenticated
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getUser();
      // Add null check
      if (user && user.role) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'manager') {
          router.push('/manager/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
      }
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await AuthService.login(formData.email, formData.password);
      
      // Add null checks
      if (response && response.user && response.user.role) {
        const user = response.user;
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'manager') {
          router.push('/manager/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your reimbursement account
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-600">
                  {error}
                </div>
              </div>
            )}

            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-3">
              Demo Accounts:
            </p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span>admin@mail.com / password</span>
              </div>
              <div className="flex justify-between">
                <span>Manager:</span>
                <span>manager@mail.com / password</span>
              </div>
              <div className="flex justify-between">
                <span>Employee:</span>
                <span>employee@mail.com / password</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Reimbursement Management System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}