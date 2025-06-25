"use client";

import Card, { CardHeader, CardTitle } from '@/component/ui/Card';
import { formatCurrency, formatNumber } from '../data/mockData';
import Button from '@/component/ui/Button';

export default function SystemOverview({ 
  userStats = [], 
  categoryStats = [], 
  departmentStats = [],
  onNavigate 
}) {

  const getTotalUsers = () => {
    return userStats.reduce((total, stat) => total + stat.count, 0);
  };

  const getTotalAmount = () => {
    return userStats.reduce((total, stat) => total + stat.totalAmount, 0);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBudgetUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* User Management Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate && onNavigate('/admin/users')}
            >
              Manage Users
            </Button>
          </div>
        </CardHeader>
        
        <div className="px-6 pb-6">
          {/* User Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(getTotalUsers())}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spending</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalAmount())}</p>
              </div>
            </div>
          </div>

          {/* Role Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">By Role</h4>
            {userStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(stat.role)}`}>
                    {stat.role}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{formatNumber(stat.count)} users</p>
                    <p className="text-sm text-gray-600">{formatNumber(stat.activeThisMonth)} active</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(stat.totalAmount)}</p>
                  <p className="text-sm text-gray-600">{formatNumber(stat.totalRequests)} requests</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 space-y-2">
            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate('/admin/users/add')}
              className="w-full justify-start"
            >
              <span className="mr-2">➕</span>
              Add New User
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate('/admin/users/bulk')}
              className="w-full justify-start"
            >
              <span className="mr-2">📥</span>
              Bulk Import Users
            </Button>
          </div>
        </div>
      </Card>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Department Overview</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate && onNavigate('/admin/departments')}
            >
              Manage Budgets
            </Button>
          </div>
        </CardHeader>
        
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {departmentStats.slice(0, 6).map((dept, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{dept.department}</h4>
                    <p className="text-sm text-gray-600">
                      {formatNumber(dept.totalUsers)} users • {formatNumber(dept.totalRequests)} requests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(dept.totalAmount)}</p>
                    <p className="text-sm text-gray-600">
                      {dept.budgetUsage.toFixed(1)}% of budget
                    </p>
                  </div>
                </div>
                
                {/* Budget Usage Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getBudgetUsageColor(dept.budgetUsage)}`}
                    style={{ width: `${Math.min(dept.budgetUsage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatCurrency(dept.totalAmount)}</span>
                  <span>{formatCurrency(dept.monthlyBudget)}</span>
                </div>
                
                {dept.budgetUsage >= 90 && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    ⚠️ Budget limit approaching
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Department Summary */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">📊</span>
              <div>
                <p className="text-sm font-medium text-blue-800">Department Performance</p>
                <p className="text-sm text-blue-700">
                  {departmentStats.filter(d => d.budgetUsage >= 90).length} departments over 90% budget usage
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
    </div>
  );
}