"use client";

import { StatsCard } from '@/component/ui/Card';
import { formatCurrency } from '../data/mockData';

export default function DashboardStats({ managerStats }) {
  const {
    totalRequests = 0,
    pendingRequests = 0,
    approvedThisMonth = 0,
    rejectedThisMonth = 0,
    totalTeamMembers = 0,
    activeTeamMembers = 0,
    totalAmountThisMonth = 0,
    totalAmountLastMonth = 0,
    averageProcessingTime = 0,
    urgentRequests = 0
  } = managerStats;

  // Calculate monthly change
  const monthlyChange = totalAmountLastMonth > 0 
    ? ((totalAmountThisMonth - totalAmountLastMonth) / totalAmountLastMonth) * 100 
    : 0;

  // Calculate approval rate
  const totalProcessed = approvedThisMonth + rejectedThisMonth;
  const approvalRate = totalProcessed > 0 ? (approvedThisMonth / totalProcessed) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Pending Requests - Most important for managers */}
      <StatsCard
        title="Pending Approvals"
        value={pendingRequests}
        icon="⏳"
        change={urgentRequests > 0 ? `${urgentRequests} urgent (3+ days)` : "All up to date"}
        changeType={urgentRequests > 0 ? "negative" : "positive"}
      />

      {/* Team Activity */}
      <StatsCard
        title="Team Members"
        value={`${activeTeamMembers}/${totalTeamMembers}`}
        icon="👥"
        change="Active team members"
        changeType="neutral"
      />

      {/* Monthly Amount */}
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

      {/* Approval Rate */}
      <StatsCard
        title="Approval Rate"
        value={`${approvalRate.toFixed(1)}%`}
        icon="✅"
        change={`${approvedThisMonth} approved, ${rejectedThisMonth} rejected`}
        changeType={approvalRate >= 80 ? "positive" : approvalRate >= 60 ? "neutral" : "negative"}
      />
      
    </div>
  );
}