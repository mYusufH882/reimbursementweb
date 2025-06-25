"use client";

import { useState, useEffect } from 'react';

// Import komponen-komponen dashboard
import DashboardStats from './components/DashboardStats';
import PendingApprovals from './components/PendingApprovals';
import TeamOverview from './components/TeamOverview';

// Import mock data
import { 
  mockManagerStats, 
  mockPendingRequests, 
  mockRecentActivity, 
  mockTeamStats 
} from './data/mockData';
import { DashboardLayout } from '@/component/layout/MainLayout';

export default function ManagerDashboard({ 
  user = { name: 'Jane Smith', role: 'manager' },
  onNavigate,
  onLogout 
}) {
  // State untuk loading dan data
  const [loading, setLoading] = useState(true);
  const [managerStats, setManagerStats] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [teamStats, setTeamStats] = useState([]);

  // Simulate API data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call dengan timeout
      setTimeout(() => {
        setManagerStats(mockManagerStats);
        setPendingRequests(mockPendingRequests);
        setRecentActivity(mockRecentActivity);
        setTeamStats(mockTeamStats);
        setLoading(false);
      }, 1200); // 1.2 detik loading
    };

    fetchDashboardData();
  }, []);

  // Handle approval actions
  const handleApproveRequest = async (requestId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update pending requests
      setPendingRequests(prev => 
        prev.filter(request => request.id !== requestId)
      );
      
      // Update stats
      setManagerStats(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests - 1,
        approvedThisMonth: prev.approvedThisMonth + 1
      }));
      
      // Add to recent activity
      const approvedRequest = pendingRequests.find(r => r.id === requestId);
      if (approvedRequest) {
        setRecentActivity(prev => [
          {
            id: Date.now(),
            type: 'approval',
            title: `Approved ${approvedRequest.title}`,
            employee: approvedRequest.employee.name,
            amount: approvedRequest.amount,
            time: new Date().toISOString(),
            description: 'Quick approval from dashboard'
          },
          ...prev.slice(0, 5)
        ]);
      }
      
      // Show success notification (in real app)
      console.log(`Request ${requestId} approved successfully`);
      
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update pending requests
      setPendingRequests(prev => 
        prev.filter(request => request.id !== requestId)
      );
      
      // Update stats
      setManagerStats(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests - 1,
        rejectedThisMonth: prev.rejectedThisMonth + 1
      }));
      
      // Add to recent activity
      const rejectedRequest = pendingRequests.find(r => r.id === requestId);
      if (rejectedRequest) {
        setRecentActivity(prev => [
          {
            id: Date.now(),
            type: 'rejection',
            title: `Rejected ${rejectedRequest.title}`,
            employee: rejectedRequest.employee.name,
            amount: rejectedRequest.amount,
            time: new Date().toISOString(),
            description: 'Quick rejection from dashboard'
          },
          ...prev.slice(0, 5)
        ]);
      }
      
      console.log(`Request ${requestId} rejected successfully`);
      
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleViewRequestDetails = (request) => {
    if (onNavigate) {
      onNavigate(`/manager/requests/${request.id}`);
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

      {/* Pending Approvals Skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Overview Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
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
        currentPath="/manager/dashboard"
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
      currentPath="/manager/dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {managerStats.pendingRequests > 0 
            ? `You have ${managerStats.pendingRequests} requests awaiting your approval`
            : "All requests are up to date. Great work!"
          }
        </p>
      </div>

      {/* Stats Cards Section */}
      <DashboardStats managerStats={managerStats} />

      {/* Pending Approvals Section */}
      <PendingApprovals 
        pendingRequests={pendingRequests}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        onViewDetails={handleViewRequestDetails}
        onNavigate={onNavigate}
      />

      {/* Team Overview Section */}
      <TeamOverview 
        teamStats={teamStats}
        recentActivity={recentActivity}
        onNavigate={onNavigate}
      />

      {/* Manager Action Summary */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-orange-800">
              Manager Action Center
            </h3>
            <div className="mt-2 text-sm text-orange-700">
              <p>
                This month you&apos;ve processed <strong>{managerStats.approvedThisMonth + managerStats.rejectedThisMonth} requests</strong> 
                with an average processing time of <strong>{managerStats.averageProcessingTime} days</strong>.
                {managerStats.urgentRequests > 0 && (
                  <span className="block mt-1">
                    ⚠️ <strong>{managerStats.urgentRequests} requests</strong> are marked as urgent (3+ days old).
                  </span>
                )}
              </p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button 
                onClick={() => onNavigate && onNavigate('/manager/pending')}
                className="text-sm font-medium text-orange-800 hover:text-orange-900"
              >
                Process all pending →
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('/manager/reports')}
                className="text-sm font-medium text-orange-800 hover:text-orange-900"
              >
                View monthly report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}