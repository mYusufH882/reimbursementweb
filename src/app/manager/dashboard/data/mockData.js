export const mockManagerStats = {
  totalRequests: 156,
  pendingRequests: 8,
  approvedThisMonth: 42,
  rejectedThisMonth: 3,
  totalTeamMembers: 12,
  activeTeamMembers: 11,
  totalAmountThisMonth: 18500000, // 18.5M IDR
  totalAmountLastMonth: 16200000, // 16.2M IDR
  averageProcessingTime: 2.3, // days
  urgentRequests: 3 // requests > 3 days old
};

export const mockPendingRequests = [
  {
    id: 1,
    title: 'Conference Registration Fee',
    amount: 2500000,
    category: 'Training',
    status: 'pending',
    employee: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering'
    },
    submitted_at: '2024-01-12T09:30:00Z', // 4 days ago - urgent
    days_pending: 4,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Client Meeting Lunch',
    amount: 450000,
    category: 'Meals',
    status: 'pending',
    employee: {
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Sales'
    },
    submitted_at: '2024-01-14T14:15:00Z', // 2 days ago
    days_pending: 2,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Transportation to Airport',
    amount: 200000,
    category: 'Transportation',
    status: 'pending',
    employee: {
      name: 'Bob Wilson',
      email: 'bob.wilson@company.com',
      department: 'Marketing'
    },
    submitted_at: '2024-01-15T16:45:00Z', // 1 day ago
    days_pending: 1,
    priority: 'low'
  },
  {
    id: 4,
    title: 'Medical Checkup',
    amount: 800000,
    category: 'Health',
    status: 'pending',
    employee: {
      name: 'Alice Brown',
      email: 'alice.brown@company.com',
      department: 'HR'
    },
    submitted_at: '2024-01-10T11:20:00Z', // 6 days ago - urgent
    days_pending: 6,
    priority: 'high'
  },
  {
    id: 5,
    title: 'Office Supplies',
    amount: 150000,
    category: 'Office Supplies',
    status: 'pending',
    employee: {
      name: 'Charlie Davis',
      email: 'charlie.davis@company.com',
      department: 'Operations'
    },
    submitted_at: '2024-01-15T10:00:00Z', // 1 day ago
    days_pending: 1,
    priority: 'low'
  }
];

export const mockRecentActivity = [
  {
    id: 1,
    type: 'approval',
    title: 'Approved transportation request',
    employee: 'Sarah Johnson',
    amount: 180000,
    time: '2024-01-15T15:30:00Z',
    description: 'Approved Grab ride to client office'
  },
  {
    id: 2,
    type: 'rejection',
    title: 'Rejected meal expense',
    employee: 'Mike Chen',
    amount: 350000,
    time: '2024-01-15T11:20:00Z',
    description: 'Personal dining, not business related'
  },
  {
    id: 3,
    type: 'approval',
    title: 'Approved training expense',
    employee: 'Lisa Wang',
    amount: 1200000,
    time: '2024-01-14T16:45:00Z',
    description: 'Online course certification'
  },
  {
    id: 4,
    type: 'approval',
    title: 'Approved office supplies',
    employee: 'David Kim',
    amount: 85000,
    time: '2024-01-14T09:15:00Z',
    description: 'Stationery for team'
  }
];

export const mockTeamStats = [
  {
    department: 'Engineering',
    totalMembers: 5,
    pendingRequests: 3,
    monthlyTotal: 8500000,
    monthlyLimit: 12000000
  },
  {
    department: 'Sales',
    totalMembers: 4,
    pendingRequests: 2,
    monthlyTotal: 6200000,
    monthlyLimit: 10000000
  },
  {
    department: 'Marketing',
    totalMembers: 2,
    pendingRequests: 2,
    monthlyTotal: 2800000,
    monthlyLimit: 5000000
  },
  {
    department: 'HR',
    totalMembers: 1,
    pendingRequests: 1,
    monthlyTotal: 1000000,
    monthlyLimit: 3000000
  }
];

// Helper functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};