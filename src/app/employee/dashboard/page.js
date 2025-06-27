'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/component/layout/MainLayout';
import { StatsCard } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import { withAuth } from '@/component/auth/withAuth';
import ApiService from '@/services/api';
import AuthService from '@/services/auth';
import CategoryUsage from '@/component/dashboard/CategoryUsage';

function EmployeeDashboard({ user }) {
  const router = useRouter();
  const [stats, setStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    approved_requests: 0,
    rejected_requests: 0,
    total_amount: 0,
    monthly_limit_usage: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get employee requests and category usage
      const [requests, categoryUsage] = await Promise.all([
        ApiService.getEmployeeRequests().catch(err => {
          console.error('Failed to get requests:', err);
          return [];
        }),
        ApiService.getCategoryUsage().catch(err => {
          console.error('Failed to get category usage:', err);
          return [];
        })
      ]);

      // Calculate stats using the helper method
      const calculatedStats = ApiService.calculateEmployeeStats(requests);

      setStats({
        ...calculatedStats,
        monthly_limit_usage: Array.isArray(categoryUsage) ? categoryUsage : (categoryUsage?.data || [])
      });

    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data: ' + err.message);
      
      // Set empty stats on error
      setStats({
        total_requests: 0,
        pending_requests: 0,
        approved_requests: 0,
        rejected_requests: 0,
        total_amount: 0,
        monthly_limit_usage: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleLogout = () => {
    AuthService.logout();
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  if (loading) {
    return (
      <DashboardLayout
        user={user}
        currentPath="/employee/dashboard"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={user}
      currentPath="/employee/dashboard"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">
                Manage your reimbursement requests and track your submissions.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push('/employee/submit')}
            >
              Submit New Request
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Requests"
            value={stats.total_requests}
            className="bg-blue-50 border-blue-200"
          />
          <StatsCard
            title="Pending"
            value={stats.pending_requests}
            className="bg-yellow-50 border-yellow-200"
          />
          <StatsCard
            title="Approved"
            value={stats.approved_requests}
            className="bg-green-50 border-green-200"
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected_requests}
            className="bg-red-50 border-red-200"
          />
        </div>

        {/* Amount Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Total Approved Amount
            </h3>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(stats.total_amount)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              All time approved reimbursements
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => router.push('/employee/submit')}
                className="w-full"
              >
                Submit New Request
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/employee/requests')}
                className="w-full"
              >
                View All Requests
              </Button>
            </div>
          </div>
        </div>

        {/* Category Usage */}
        <CategoryUsage categories={stats.monthly_limit_usage} />
      </div>
    </DashboardLayout>
  );
}

// Export with authentication protection
export default withAuth(EmployeeDashboard, 'employee');