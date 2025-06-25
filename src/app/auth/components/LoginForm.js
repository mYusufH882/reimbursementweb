"use client";

import Button from '@/component/ui/Button';
import Input from '@/component/ui/Input';
import { useState } from 'react';

export default function LoginForm({ onLogin, loading = false }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Demo users untuk testing UI
  const demoUsers = [
    { role: 'employee', email: 'employee@company.com', name: 'John Doe' },
    { role: 'manager', email: 'manager@company.com', name: 'Jane Smith' },
    { role: 'admin', email: 'admin@company.com', name: 'Bob Wilson' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate login logic (UI only)
    if (onLogin) {
      // Find demo user by email
      const demoUser = demoUsers.find(user => user.email === formData.email);
      if (demoUser) {
        onLogin({
          email: formData.email,
          password: formData.password,
          remember: formData.remember,
          user: demoUser
        });
      } else {
        setErrors({ email: 'User not found. Try demo emails below.' });
      }
    }
  };

  const handleDemoLogin = (demoUser) => {
    setFormData({
      email: demoUser.email,
      password: 'password123',
      remember: false
    });
    
    // Auto login after short delay
    setTimeout(() => {
      if (onLogin) {
        onLogin({
          email: demoUser.email,
          password: 'password123',
          remember: false,
          user: demoUser
        });
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email Input */}
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
          className="w-full"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            className="w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
        </div>
      </div>

      {/* Demo Login Buttons */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600 text-center">Quick demo access:</p>
        
        {demoUsers.map((user) => (
          <Button
            key={user.role}
            variant="outline"
            onClick={() => handleDemoLogin(user)}
            className="w-full justify-start"
            disabled={loading}
          >
            <span className="mr-3">
              {user.role === 'admin' ? '👑' : 
               user.role === 'manager' ? '👔' : '👨‍💼'}
            </span>
            <div className="text-left">
              <div className="font-medium capitalize">{user.role} - {user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <span className="text-blue-500 mr-2">💡</span>
          <div className="text-sm text-blue-700">
            <p className="font-medium">Demo Information:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• <strong>Employee:</strong> Submit and track reimbursement requests</li>
              <li>• <strong>Manager:</strong> Approve/reject team requests</li>
              <li>• <strong>Admin:</strong> System management and oversight</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button 
            type="button"
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => window.location.href = '/auth/register'}
          >
            Create new account
          </button>
        </p>
      </div>
    </div>
  );
}