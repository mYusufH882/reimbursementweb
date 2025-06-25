"use client";

import Card, { CardHeader, CardTitle } from '@/component/ui/Card';
import { formatCurrency } from '../data/mockData';
import Button from '@/component/ui/Button';

export default function TeamOverview({ 
  teamStats = [], 
  recentActivity = [], 
  onNavigate 
}) {

  const getUsagePercentage = (used, limit) => {
    return limit > 0 ? (used / limit) * 100 : 0;
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'approval': return '✅';
      case 'rejection': return '❌';
      case 'submission': return '📝';
      default: return '📋';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'approval': return 'text-green-600';
      case 'rejection': return 'text-red-600';
      case 'submission': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Team Department Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Overview</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate && onNavigate('/manager/team')}
            >
              View Details
            </Button>
          </div>
        </CardHeader>
        
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {teamStats.map((dept, index) => {
              const usagePercentage = getUsagePercentage(dept.monthlyTotal, dept.monthlyLimit);
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{dept.department}</h4>
                      <p className="text-sm text-gray-600">
                        {dept.totalMembers} members • {dept.pendingRequests} pending
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(dept.monthlyTotal)}
                      </p>
                      <p className="text-xs text-gray-500">
                        of {formatCurrency(dept.monthlyLimit)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Usage Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(usagePercentage)}`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{usagePercentage.toFixed(1)}% used</span>
                    {dept.pendingRequests > 0 && (
                      <span className="text-orange-600">
                        {dept.pendingRequests} need approval
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {teamStats.length === 0 && (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-gray-500">No team data available</p>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate && onNavigate('/manager/activity')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {recentActivity.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-lg">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.time).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity.employee} • {formatCurrency(activity.amount)}
                  </p>
                  {activity.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {recentActivity.length === 0 && (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </Card>
      
    </div>
  );
}