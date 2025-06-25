"use client"; // Add client directive

import { useState, useEffect } from 'react';

// Import komponen-komponen dashboard
import DashboardStats from './components/DashboardStats';
import SystemOverview from './components/SystemOverview';
import RecentActivity from './components/RecentActivity';

// Import mock data
import { 
  mockAdminStats, 
  mockUserStats, 
  mockCategoryStats, 
  mockRecentRequests,
  mockSystemActivity,
  mockDepartmentStats
} from './data/mockData';
import { DashboardLayout } from '@/component/layout/MainLayout';

export default function AdminDashboard({ 
  user = { name: 'Bob Wilson', role: 'admin' },
  onNavigate,
  onLogout 
}) {
  // State untuk loading dan data
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({});
  const [userStats, setUserStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [systemActivity, setSystemActivity] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);

  // Simulate API data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call dengan timeout
      setTimeout(() => {
        setAdminStats(mockAdminStats);
        setUserStats(mockUserStats);
        setCategoryStats(mockCategoryStats);
        setRecentRequests(mockRecentRequests);
        setSystemActivity(mockSystemActivity);
        setDepartmentStats(mockDepartmentStats);
        setLoading(false);
      }, 1500); // 1.5 detik loading (slightly longer for admin)
    };

    fetchDashboardData();
  }, []);

  // Handle view request details
  const handleViewRequest = (request) => {
    if (onNavigate) {
      onNavigate(`/admin/requests/${request.id}`);
    }
  };

  // Handle system actions
  const handleSystemAction = (action) => {
    console.log(`Admin action: ${action}`);
    // In real app, would trigger API calls
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

      {/* System Overview Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout
        user={user}
        currentPath="/admin/dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <LoadingSkeleton />
      </DashboardLayout>
    );
  }

  // Calculate some summary metrics for display
  const totalSystemUsers = userStats.reduce((sum, stat) => sum + stat.count, 0);
  const flaggedRequests = recentRequests.filter(r => r.flagged).length;
  const securityAlerts = systemActivity.filter(a => a.type === 'security_alert').length;

  // Main dashboard render
  return (
    <DashboardLayout
      user={user}
      currentPath="/admin/dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          System Administration 👑
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user.name.split(' ')[0]}! Here&apos;s your system overview
        </p>
        
        {/* Quick System Status */}
        <div className="mt-4 flex items-center space-x-6">
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-600">System Online</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600">{totalSystemUsers} Total Users</span>
          </div>
          {flaggedRequests > 0 && (
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <span className="text-orange-600">{flaggedRequests} Flagged Requests</span>
            </div>
          )}
          {securityAlerts > 0 && (
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span className="text-red-600">{securityAlerts} Security Alerts</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards Section */}
      <DashboardStats adminStats={adminStats} />

      {/* System Overview Section */}
      <SystemOverview 
        userStats={userStats}
        categoryStats={categoryStats}
        departmentStats={departmentStats}
        onNavigate={onNavigate}
      />

      {/* Recent Activity Section */}
      <RecentActivity 
        recentRequests={recentRequests}
        systemActivity={systemActivity}
        onNavigate={onNavigate}
        onViewRequest={handleViewRequest}
      />

      {/* Admin Action Center */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">🛠️</span>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-purple-800">
              Administrative Actions
            </h3>
            <div className="mt-2 text-sm text-purple-700">
              <p>
                System uptime: <strong>{adminStats.systemUptime}%</strong> • 
                Total processing: <strong>{adminStats.totalRequests} requests</strong> • 
                Monthly volume: <strong>{adminStats.totalAmountThisMonth ? `IDR ${(adminStats.totalAmountThisMonth / 1000000).toFixed(1)}M` : 'N/A'}</strong>
              </p>
              {flaggedRequests > 0 && (
                <p className="mt-1">
                  ⚠️ <strong>{flaggedRequests} high-value requests</strong> require administrative review
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                onClick={() => onNavigate && onNavigate('/admin/users')}
                className="text-sm font-medium text-purple-800 hover:text-purple-900 bg-white px-3 py-1 rounded border border-purple-300"
              >
                Manage Users
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('/admin/categories')}
                className="text-sm font-medium text-purple-800 hover:text-purple-900 bg-white px-3 py-1 rounded border border-purple-300"
              >
                Category Settings
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('/admin/reports')}
                className="text-sm font-medium text-purple-800 hover:text-purple-900 bg-white px-3 py-1 rounded border border-purple-300"
              >
                System Reports
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('/admin/settings')}
                className="text-sm font-medium text-purple-800 hover:text-purple-900 bg-white px-3 py-1 rounded border border-purple-300"
              >
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}