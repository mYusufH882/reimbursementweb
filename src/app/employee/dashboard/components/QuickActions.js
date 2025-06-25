"use client";

import Button from '@/component/ui/Button';
import { formatCurrency } from '../data/mockData';
import Card, { CardContent, CardHeader, CardTitle } from '@/component/ui/Card';

export default function QuickActions({ onNavigate, monthlyUsage, monthlyLimit }) {
  const usagePercentage = monthlyLimit > 0 ? (monthlyUsage / monthlyLimit) * 100 : 0;
  const remainingAmount = monthlyLimit - monthlyUsage;
  const canSubmit = remainingAmount > 0;

  const handleSubmitRequest = () => {
    if (onNavigate) {
      onNavigate('/employee/submit');
    }
  };

  const handleViewRequests = () => {
    if (onNavigate) {
      onNavigate('/employee/requests');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Submit New Request Card */}
      <Card>
        <CardHeader>
          <CardTitle>Submit New Request</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            {/* Monthly Limit Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Monthly Usage</span>
                <span>{usagePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usagePercentage >= 90 ? 'bg-red-500' :
                    usagePercentage >= 75 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatCurrency(monthlyUsage)}</span>
                <span>{formatCurrency(monthlyLimit)}</span>
              </div>
            </div>

            {/* Remaining Amount Info */}
            <div className={`p-3 rounded-lg ${
              canSubmit ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                <span className="text-lg mr-2">
                  {canSubmit ? '✅' : '⚠️'}
                </span>
                <div>
                  <p className={`text-sm font-medium ${
                    canSubmit ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {canSubmit 
                      ? `${formatCurrency(remainingAmount)} remaining`
                      : 'Monthly limit reached'
                    }
                  </p>
                  <p className={`text-xs ${
                    canSubmit ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {canSubmit 
                      ? 'You can submit new requests'
                      : 'Wait for next month or contact your manager'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmitRequest}
              disabled={!canSubmit}
              className="w-full"
            >
              <span className="mr-2">➕</span>
              {canSubmit ? 'Submit New Request' : 'Limit Reached'}
            </Button>
            
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            
            {/* View All Requests */}
            <Button
              variant="outline"
              onClick={handleViewRequests}
              className="w-full justify-start"
            >
              <span className="mr-3">📋</span>
              <div className="text-left">
                <div className="font-medium">My Requests</div>
                <div className="text-xs text-gray-500">View all submissions</div>
              </div>
            </Button>

            {/* Categories Overview */}
            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate('/employee/categories')}
              className="w-full justify-start"
            >
              <span className="mr-3">🏷️</span>
              <div className="text-left">
                <div className="font-medium">Categories & Limits</div>
                <div className="text-xs text-gray-500">View reimbursement categories</div>
              </div>
            </Button>

            {/* Profile Settings */}
            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate('/employee/profile')}
              className="w-full justify-start"
            >
              <span className="mr-3">👤</span>
              <div className="text-left">
                <div className="font-medium">Profile Settings</div>
                <div className="text-xs text-gray-500">Update your information</div>
              </div>
            </Button>

            {/* Help & Support */}
            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate('/employee/help')}
              className="w-full justify-start"
            >
              <span className="mr-3">❓</span>
              <div className="text-left">
                <div className="font-medium">Help & Support</div>
                <div className="text-xs text-gray-500">Get help with requests</div>
              </div>
            </Button>

          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}