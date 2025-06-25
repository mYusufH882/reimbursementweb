"use client";


import Card, { CardHeader, CardTitle } from '@/component/ui/Card';
import { formatCurrency, getTimeAgo } from '../data/mockData';
import Button from '@/component/ui/Button';
import { PriorityBadge } from '@/component/ui/Badge';

export default function PendingApprovals({ 
  pendingRequests = [], 
  onApprove, 
  onReject, 
  onViewDetails,
  onNavigate 
}) {
  
  // Show only top 5 pending requests in dashboard
  const topPendingRequests = pendingRequests.slice(0, 5);

  const handleQuickApprove = async (request) => {
    if (onApprove) {
      await onApprove(request.id);
    }
  };

  const handleQuickReject = async (request) => {
    if (onReject) {
      await onReject(request.id);
    }
  };

  const handleViewDetails = (request) => {
    if (onViewDetails) {
      onViewDetails(request);
    }
  };

  const getPriorityLevel = (daysPending) => {
    if (daysPending >= 3) return 'high';
    if (daysPending >= 2) return 'medium';
    return 'low';
  };

  const getPriorityColor = (daysPending) => {
    if (daysPending >= 3) return 'bg-red-50 border-red-200';
    if (daysPending >= 2) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Approvals</CardTitle>
          <div className="flex items-center space-x-2">
            {pendingRequests.length > 5 && (
              <span className="text-sm text-gray-500">
                Showing 5 of {pendingRequests.length}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate && onNavigate('/manager/pending')}
            >
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        {topPendingRequests.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-500">
              No pending requests at the moment. Great job!
            </p>
          </div>
        ) : (
          // Pending requests list
          <div className="space-y-4">
            {topPendingRequests.map((request) => (
              <div 
                key={request.id}
                className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 ${getPriorityColor(request.days_pending)}`}
              >
                <div className="flex items-start justify-between">
                  
                  {/* Request Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {request.title}
                      </h4>
                      <PriorityBadge priority={getPriorityLevel(request.days_pending)} />
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
                      <span className="flex items-center">
                        <span className="mr-1">💰</span>
                        {formatCurrency(request.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Category: {request.category}</span>
                      <span>Submitted: {getTimeAgo(request.submitted_at)}</span>
                      {request.days_pending >= 3 && (
                        <span className="text-red-600 font-medium">
                          ⚠️ {request.days_pending} days pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(request)}
                    >
                      View
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleQuickApprove(request)}
                    >
                      <span className="mr-1">✅</span>
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleQuickReject(request)}
                    >
                      <span className="mr-1">❌</span>
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions Footer */}
        {topPendingRequests.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {pendingRequests.filter(r => r.days_pending >= 3).length > 0 && (
                  <span className="text-red-600 font-medium">
                    ⚠️ {pendingRequests.filter(r => r.days_pending >= 3).length} urgent requests need attention
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate && onNavigate('/manager/bulk-approve')}
                >
                  Bulk Actions
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate && onNavigate('/manager/pending')}
                >
                  Process All
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}