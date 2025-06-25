"use client";

import { useState, useEffect } from 'react';

// Import komponen-komponen dashboard
import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import RecentRequests from './components/RecentRequests';

// Import mock data
import { mockUserStats, mockRecentRequests } from './data/mockData';
import { DashboardLayout } from '@/component/layout/MainLayout';

export default function EmployeeDashboard({ 
  user = { name: 'John Doe', role: 'employee' },
  onNavigate,
  onLogout 
}) {
  // State untuk loading dan data
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({});
  const [recentRequests, setRecentRequests] = useState([]);

  // Simulate API data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call dengan timeout
      setTimeout(() => {
        setUserStats(mockUserStats);
        setRecentRequests(mockRecentRequests);
        setLoading(false);
      }, 1000); // 1 detik loading
    };

    fetchDashboardData();
  }, []);

  // Handle view specific request
  const handleViewRequest = (request) => {
    if (onNavigate) {
      onNavigate(`/employee/requests/${request.id}`);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests Skeleton */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout
        user={user}
        currentPath="/employee/dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <LoadingSkeleton />
      </DashboardLayout>
    );
  }

  // Main dashboard render
  return (
    <DashboardLayout
      user={user}
      currentPath="/employee/dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s an overview of your reimbursement activity
        </p>
      </div>

      {/* Stats Cards Section */}
      <DashboardStats userStats={userStats} />

      {/* Quick Actions Section */}
      <QuickActions 
        onNavigate={onNavigate}
        monthlyUsage={userStats.monthlyUsage}
        monthlyLimit={userStats.monthlyLimit}
      />

      {/* Recent Requests Section */}
      <RecentRequests 
        requests={recentRequests}
        onNavigate={onNavigate}
        onViewRequest={handleViewRequest}
      />

      {/* Monthly Summary Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">📊</span>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Monthly Summary
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                You&apos;ve used <strong>{((userStats.monthlyUsage / userStats.monthlyLimit) * 100).toFixed(1)}%</strong> of your monthly limit.
                {userStats.pendingRequests > 0 && (
                  <span> You have <strong>{userStats.pendingRequests} pending requests</strong> awaiting approval.</span>
                )}
              </p>
            </div>
            <div className="mt-4">
              <button 
                onClick={() => onNavigate && onNavigate('/employee/reports')}
                className="text-sm font-medium text-blue-800 hover:text-blue-900"
              >
                View detailed monthly report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}