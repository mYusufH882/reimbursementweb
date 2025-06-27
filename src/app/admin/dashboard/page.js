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

function AdminDashboard({ user }) {
  const router = useRouter();
  const [stats, setStats] = useState({
    total_users: 0,
    total_reimbursements: 0,
    pending_reimbursements: 0,
    approved_reimbursements: 0,
    rejected_reimbursements: 0,
    total_categories: 0,
    monthly_approved_amount: 0,
    users_by_role: {},
    monthly_stats: {},
    recent_activities: [],
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
      
      // Get admin dashboard data
      const [dashboardData, users, recentRequests] = await Promise.all([
        ApiService.getAdminDashboard().catch(() => ({})),
        ApiService.getUsers().catch(() => []),
        ApiService.getAllReimbursements().catch(() => [])
      ]);

      // Handle response format - Laravel might wrap in 'data'
      const dashboard = dashboardData?.data || dashboardData || {};
      const usersData = Array.isArray(users) ? users : (users?.data || []);
      const requestsData = Array.isArray(recentRequests) ? recentRequests : (recentRequests?.data || []);

      setStats({
        total_users: dashboard.total_users || usersData.length || 0,
        total_reimbursements: dashboard.total_reimbursements || requestsData.length || 0,
        pending_reimbursements: dashboard.pending_reimbursements || 0,
        approved_reimbursements: dashboard.approved_reimbursements || 0,
        rejected_reimbursements: dashboard.rejected_reimbursements || 0,
        total_categories: dashboard.total_categories || 0,
        monthly_approved_amount: dashboard.monthly_approved_amount || 0,
        users_by_role: dashboard.users_by_role || {},
        monthly_stats: dashboard.monthly_stats || {},
        recent_activities: requestsData.slice(0, 5)
      });

    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Failed to load dashboard data');
      
      // Set empty stats on error
      setStats({
        total_users: 0,
        total_reimbursements: 0,
        pending_reimbursements: 0,
        approved_reimbursements: 0,
        rejected_reimbursements: 0,
        total_categories: 0,
        monthly_approved_amount: 0,
        users_by_role: {},
        monthly_stats: {},
        recent_activities: []
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

  const getRoleBadge = (role) => {
    const config = {
      admin: { variant: 'danger', text: 'Admin' },
      manager: { variant: 'warning', text: 'Manager' },
      employee: { variant: 'success', text: 'Employee' }
    };
    
    const { variant, text } = config[role] || { variant: 'default', text: role };
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
        currentPath="/admin/dashboard"
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
      currentPath="/admin/dashboard"
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
                System Administration
              </h1>
              <p className="text-gray-600">
                Complete overview and management of the reimbursement system.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/users')}
              >
                Manage Users
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/admin/categories')}
              >
                Manage Categories
              </Button>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.total_users}
            className="bg-blue-50 border-blue-200"
          />
          <StatsCard
            title="Total Requests"
            value={stats.total_reimbursements}
            className="bg-purple-50 border-purple-200"
          />
          <StatsCard
            title="Pending Reviews"
            value={stats.pending_reimbursements}
            className="bg-yellow-50 border-yellow-200"
          />
          <StatsCard
            title="Categories"
            value={stats.total_categories}
            className="bg-green-50 border-green-200"
          />
        </div>

        {/* Request Status Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Approved Requests"
            value={stats.approved_reimbursements}
            className="bg-green-50 border-green-200"
          />
          <StatsCard
            title="Rejected Requests"
            value={stats.rejected_reimbursements}
            className="bg-red-50 border-red-200"
          />
          <StatsCard
            title="Monthly Amount"
            value={formatCurrency(stats.monthly_approved_amount)}
            className="bg-indigo-50 border-indigo-200"
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Users by Role */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Users by Role
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.users_by_role).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getRoleBadge(role)}
                  </div>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/users')}
                className="w-full"
              >
                Manage Users
              </Button>
            </div>
          </div>

          {/* Monthly Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              This Month ({stats.monthly_stats?.current_month})
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">New Submissions:</span>
                <span className="font-semibold text-gray-900">
                  {stats.monthly_stats?.submissions_this_month || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approvals:</span>
                <span className="font-semibold text-green-600">
                  {stats.monthly_stats?.approvals_this_month || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Approved:</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(stats.monthly_approved_amount)}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/reports')}
                className="w-full"
              >
                View Reports
              </Button>
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
                onClick={() => router.push('/admin/users')}
                className="w-full"
              >
                Add New User
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/categories')}
                className="w-full"
              >
                Manage Categories
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/system')}
                className="w-full"
              >
                System Settings
              </Button>
            </div>

            {/* System Health */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Status:</span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database:</span>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <Badge variant="success">Available</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        {stats.recent_activities.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activities
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/activities')}
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {stats.recent_activities.map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.user?.name} • {formatDate(activity.created_at || activity.submitted_at)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.category?.name} • {formatCurrency(activity.amount)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category Usage Overview */}
        <CategoryUsage categories={stats.categories_usage} />
      </div>
    </DashboardLayout>
  );
}

// Export with authentication protection (admin only)
export default withAuth(AdminDashboard, 'admin');