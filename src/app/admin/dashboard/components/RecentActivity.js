"use client";

import Card, { CardHeader, CardTitle } from '@/component/ui/Card';
import { formatCurrency, formatDateTime, getTimeAgo } from '../data/mockData';
import Button from '@/component/ui/Button';
import { StatusBadge } from '@/component/ui/Badge';

export default function RecentActivity({ 
  recentRequests = [], 
  systemActivity = [], 
  onNavigate,
  onViewRequest 
}) {

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_created': return '👤';
      case 'policy_updated': return '📋';
      case 'bulk_approval': return '✅';
      case 'system_maintenance': return '🔧';
      case 'security_alert': return '🚨';
      case 'backup_completed': return '💾';
      default: return '📄';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'security_alert': return 'text-red-600';
      case 'system_maintenance': return 'text-blue-600';
      case 'user_created': return 'text-green-600';
      case 'policy_updated': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const handleViewRequest = (request) => {
    if (onViewRequest) {
      onViewRequest(request);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* High-Value Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>High-Value Requests</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate && onNavigate('/admin/requests?filter=high-value')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {recentRequests.slice(0, 5).map((request) => (
              <div 
                key={request.id}
                className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 cursor-pointer ${
                  request.flagged ? 'border-orange-200 bg-orange-50' : ''
                }`}
                onClick={() => handleViewRequest(request)}
              >
                <div className="flex items-start justify-between">
                  
                  {/* Request Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {request.title}
                      </h4>
                      {request.flagged && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                          🚩 Flagged
                        </span>
                      )}
                      <StatusBadge status={request.status} />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center">
                        <span className="mr-1">👤</span>
                        {request.employee.name}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">🏢</span>
                        {request.employee.department}
                      </span>
                      <span className="flex items-center font-medium">
                        <span className="mr-1">💰</span>
                        {formatCurrency(request.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Manager: {request.manager.name}</span>
                      <span>Submitted: {getTimeAgo(request.submitted_at)}</span>
                    </div>

                    {request.flagged && request.flagReason && (
                      <div className="mt-2 p-2 bg-orange-100 border border-orange-200 rounded text-xs text-orange-700">
                        <span className="font-medium">Flag Reason:</span> {request.flagReason}
                      </div>
                    )}

                    {request.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        <span className="font-medium">Rejection:</span> {request.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRequest(request);
                      }}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {recentRequests.length === 0 && (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-gray-500">No high-value requests</p>
            </div>
          )}
        </div>
      </Card>

      {/* System Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>System Activity</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate && onNavigate('/admin/activity-log')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {systemActivity.slice(0, 8).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
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
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity.details}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    By: {activity.actor}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {systemActivity.length === 0 && (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}

          {/* System Health Summary */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">✅</span>
              <div>
                <p className="text-sm font-medium text-green-800">System Status</p>
                <p className="text-sm text-green-700">
                  All systems operational • Last backup: 
                  {systemActivity.find(a => a.type === 'system_maintenance') 
                    ? ` ${getTimeAgo(systemActivity.find(a => a.type === 'system_maintenance').timestamp)}`
                    : ' Recently'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
    </div>
  );
}