"use client";

import { StatsCard } from '@/component/ui/Card';
import { formatCurrency, formatNumber } from '../data/mockData';

export default function DashboardStats({ adminStats }) {
  const {
    totalUsers = 0,
    activeUsers = 0,
    totalRequests = 0,
    pendingRequests = 0,
    approvedRequests = 0,
    rejectedRequests = 0,
    totalAmountThisMonth = 0,
    totalAmountLastMonth = 0,
    systemUptime = 0,
    newUsersThisMonth = 0
  } = adminStats;

  // Calculate monthly change
  const monthlyChange = totalAmountLastMonth > 0 
    ? ((totalAmountThisMonth - totalAmountLastMonth) / totalAmountLastMonth) * 100 
    : 0;

  // Calculate system health
  const systemHealth = systemUptime >= 99.5 ? 'excellent' : systemUptime >= 99.0 ? 'good' : 'needs_attention';
  
  // Calculate processing efficiency
  const totalProcessed = approvedRequests + rejectedRequests;
  const processingRate = totalRequests > 0 ? (totalProcessed / totalRequests) * 100 : 0;

  // Calculate user engagement
  const userEngagement = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Total Users - Key metric for admin */}
      <StatsCard
        title="Total Users"
        value={formatNumber(totalUsers)}
        icon="👥"
        change={newUsersThisMonth > 0 
          ? `+${newUsersThisMonth} new this month`
          : "No new users this month"
        }
        changeType={newUsersThisMonth > 0 ? "positive" : "neutral"}
      />

      {/* System Activity */}
      <StatsCard
        title="Active Users"
        value={`${formatNumber(activeUsers)}/${formatNumber(totalUsers)}`}
        icon="🔥"
        change={`${userEngagement.toFixed(1)}% engagement rate`}
        changeType={userEngagement >= 80 ? "positive" : userEngagement >= 60 ? "neutral" : "negative"}
      />

      {/* Monthly Financial Overview */}
      <StatsCard
        title="Monthly Total"
        value={formatCurrency(totalAmountThisMonth)}
        icon="💰"
        change={monthlyChange > 0 
          ? `+${monthlyChange.toFixed(1)}% from last month`
          : monthlyChange < 0 
          ? `${monthlyChange.toFixed(1)}% from last month`
          : "No change from last month"
        }
        changeType={monthlyChange > 0 ? "positive" : monthlyChange < 0 ? "negative" : "neutral"}
      />

      {/* System Health */}
      <StatsCard
        title="System Health"
        value={`${systemUptime.toFixed(1)}%`}
        icon="⚡"
        change={pendingRequests > 0 
          ? `${pendingRequests} requests pending`
          : "All systems operational"
        }
        changeType={systemHealth === 'excellent' ? "positive" : 
                   systemHealth === 'good' ? "neutral" : "negative"}
      />
      
    </div>
  );
}