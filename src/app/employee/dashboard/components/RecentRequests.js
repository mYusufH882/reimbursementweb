"use client";

import { StatusBadge } from '@/component/ui/Badge';
import { formatCurrency, formatDate } from '../data/mockData';
import Button from '@/component/ui/Button';
import Card, { CardHeader, CardTitle } from '@/component/ui/Card';
import Table, { TableActions } from '@/component/ui/Table';

export default function RecentRequests({ requests = [], onNavigate, onViewRequest }) {
  // Show only recent 5 requests for dashboard
  const recentRequests = requests.slice(0, 5);

  // Table columns configuration
  const columns = [
    {
      key: 'title',
      title: 'Request Title',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.category}</div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'submitted_at',
      title: 'Date',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      sortable: false,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (onViewRequest) onViewRequest(row);
          }}
        >
          View
        </Button>
      )
    }
  ];

  const handleRowClick = (row) => {
    if (onViewRequest) {
      onViewRequest(row);
    }
  };

  const handleViewAllRequests = () => {
    if (onNavigate) {
      onNavigate('/employee/requests');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Requests</CardTitle>
          <TableActions>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAllRequests}
            >
              View All
            </Button>
          </TableActions>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        {recentRequests.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
            <p className="text-gray-500 mb-6">
              You haven&apos;t submitted any reimbursement requests yet.
            </p>
            <Button
              variant="primary"
              onClick={() => onNavigate && onNavigate('/employee/submit')}
            >
              <span className="mr-2">➕</span>
              Submit Your First Request
            </Button>
          </div>
        ) : (
          // Requests Table
          <Table
            columns={columns}
            data={recentRequests}
            onRowClick={handleRowClick}
            searchable={false}
            sortable={true}
            emptyMessage="No recent requests found"
          />
        )}
      </div>
    </Card>
  );
}