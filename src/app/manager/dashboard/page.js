'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/component/layout/MainLayout';
import { StatsCard } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Badge from '@/component/ui/Badge';
import { withAuth } from '@/component/auth/withAuth';
import ApiService from '@/services/api';
import AuthService from '@/services/auth';
import CategoryUsage from '@/component/dashboard/CategoryUsage';
import { formatCurrency, formatDate } from '@/utils/formatters';

function ManagerDashboard({ user }) {
  const router = useRouter();
  const [stats, setStats] = useState({
    pending_count: 0,
    approved_this_month: 0,
    rejected_this_month: 0,
    total_approved_amount: 0,
    recent_requests: [],
    categories_usage: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('Loading manager dashboard data...'); // DEBUG
      
      // Get manager dashboard data
      const [dashboardData, pendingRequests, categoriesStats] = await Promise.all([
        ApiService.getManagerDashboard().catch(err => {
          console.error('Failed to get manager dashboard:', err);
          return {};
        }),
        ApiService.getPendingReimbursements().catch(err => {
          console.error('Failed to get pending requests:', err);
          return [];
        }),
        ApiService.getCategories().catch(err => {
          console.error('Failed to get categories:', err);
          return [];
        })
      ]);

      console.log('Dashboard data:', dashboardData); // DEBUG
      console.log('Pending requests:', pendingRequests); // DEBUG
      console.log('Categories:', categoriesStats); // DEBUG

      // Handle response format - Laravel might wrap in 'data'
      const dashboard = dashboardData?.data || dashboardData || {};
      const pending = Array.isArray(pendingRequests) ? pendingRequests : (pendingRequests?.data || []);
      const categories = Array.isArray(categoriesStats) ? categoriesStats : (categoriesStats?.data || []);

      setStats({
        pending_count: dashboard.pending_count || pending.length || 0,
        approved_this_month: dashboard.approved_this_month || 0,
        rejected_this_month: dashboard.rejected_this_month || 0,
        total_approved_amount: dashboard.total_approved_amount || 0,
        recent_requests: pending.slice(0, 5),
        categories_usage: dashboard.categories_usage || categories || []
      });

    } catch (err) {
      console.error('Failed to load manager dashboard:', err);
      setError('Failed to load dashboard data: ' + err.message);
      
      // Set empty stats on error
      setStats({
        pending_count: 0,
        approved_this_month: 0,
        rejected_this_month: 0,
        total_approved_amount: 0,
        recent_requests: [],
        categories_usage: []
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
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { variant: 'warning', text: 'Pending' },
      approved: { variant: 'success', text: 'Approved' },
      rejected: { variant: 'danger', text: 'Rejected' }
    };
    
    const { variant, text } = config[status] || { variant: 'default', text: status };
    return <Badge variant={variant}>{text}</Badge>;
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
        currentPath="/manager/dashboard"
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
      currentPath="/manager/dashboard"
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
                Manager Dashboard
              </h1>
              <p className="text-gray-600">
                Review and manage reimbursement requests from your team.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push('/manager/pending')}
            >
              Review Pending ({stats.pending_count})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Pending Reviews"
            value={stats.pending_count}
            className="bg-yellow-50 border-yellow-200"
          />
          <StatsCard
            title="Approved This Month"
            value={stats.approved_this_month}
            className="bg-green-50 border-green-200"
          />
          <StatsCard
            title="Rejected This Month"
            value={stats.rejected_this_month}
            className="bg-red-50 border-red-200"
          />
          <StatsCard
            title="Total Amount (Month)"
            value={formatCurrency(stats.total_approved_amount)}
            className="bg-blue-50 border-blue-200"
          />
        </div>

        {/* Recent Requests & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Pending Requests */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Pending Requests
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/manager/pending')}
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {stats.recent_requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending requests at the moment
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recent_requests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {request.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {request.user?.name} • {formatDate(request.submitted_at)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {request.category?.name}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-green-600">
                            {formatCurrency(request.amount)}
                          </span>
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => router.push(`/manager/requests/${request.id}`)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => router.push('/manager/pending')}
                className="w-full"
              >
                Review Pending Requests
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/manager/requests')}
                className="w-full"
              >
                View All Requests
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/manager/reports')}
                className="w-full"
              >
                Generate Reports
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">This Month</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved:</span>
                  <span className="font-medium">{stats.approved_this_month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rejected:</span>
                  <span className="font-medium">{stats.rejected_this_month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{formatCurrency(stats.total_approved_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Usage */}
        <CategoryUsage categories={stats.categories_usage} />
      </div>
    </DashboardLayout>
  );
}

// Export with authentication protection
export default withAuth(ManagerDashboard, 'manager');