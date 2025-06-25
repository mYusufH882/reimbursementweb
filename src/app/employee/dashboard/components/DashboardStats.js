"use client";

import { StatsCard } from '@/component/ui/Card';
import { formatCurrency } from '../data/mockData';

export default function DashboardStats({ userStats }) {
  const {
    totalRequests = 0,
    pendingRequests = 0,
    approvedRequests = 0,
    rejectedRequests = 0,
    monthlyUsage = 0,
    monthlyLimit = 5000000,
    thisMonthAmount = 0,
    lastMonthAmount = 0
  } = userStats;

  // Calculate percentages and changes
  const usagePercentage = monthlyLimit > 0 ? (monthlyUsage / monthlyLimit) * 100 : 0;
  const monthlyChange = lastMonthAmount > 0 
    ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 
    : 0;

  const getUsageStatus = () => {
    if (usagePercentage >= 90) return { color: 'negative', message: 'Near limit!' };
    if (usagePercentage >= 75) return { color: 'neutral', message: 'High usage' };
    return { color: 'positive', message: 'On track' };
  };

  const usageStatus = getUsageStatus();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Total Requests */}
      <StatsCard
        title="Total Requests"
        value={totalRequests}
        icon="📋"
        change="All time submissions"
        changeType="neutral"
      />

      {/* Pending Requests */}
      <StatsCard
        title="Pending Approval"
        value={pendingRequests}
        icon="⏳"
        change={pendingRequests > 0 ? "Awaiting review" : "All caught up!"}
        changeType={pendingRequests > 0 ? "neutral" : "positive"}
      />

      {/* This Month Amount */}
      <StatsCard
        title="This Month"
        value={formatCurrency(thisMonthAmount)}
        icon="💰"
        change={monthlyChange > 0 
          ? `+${monthlyChange.toFixed(1)}% from last month`
          : monthlyChange < 0 
          ? `${monthlyChange.toFixed(1)}% from last month`
          : "No change from last month"
        }
        changeType={monthlyChange > 0 ? "positive" : monthlyChange < 0 ? "negative" : "neutral"}
      />

      {/* Monthly Limit Usage */}
      <StatsCard
        title="Monthly Limit"
        value={`${usagePercentage.toFixed(1)}%`}
        icon="📊"
        change={`${formatCurrency(monthlyUsage)} of ${formatCurrency(monthlyLimit)}`}
        changeType={usageStatus.color}
      />
      
    </div>
  );
}