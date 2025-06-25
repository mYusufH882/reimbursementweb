// Mock data untuk Admin Dashboard

export const mockAdminStats = {
  totalUsers: 156,
  activeUsers: 142,
  totalRequests: 1248,
  pendingRequests: 23,
  approvedRequests: 1089,
  rejectedRequests: 136,
  totalAmountThisMonth: 125500000, // 125.5M IDR
  totalAmountLastMonth: 118200000, // 118.2M IDR
  totalAmountThisYear: 1450000000, // 1.45B IDR
  averageRequestAmount: 485000,
  systemUptime: 99.8, // percentage
  newUsersThisMonth: 8
};

export const mockUserStats = [
  {
    role: 'employee',
    count: 120,
    activeThisMonth: 98,
    totalRequests: 956,
    totalAmount: 98500000,
    averagePerUser: 821000
  },
  {
    role: 'manager',
    count: 24,
    activeThisMonth: 22,
    totalRequests: 245,
    totalAmount: 22800000,
    averagePerUser: 950000
  },
  {
    role: 'admin',
    count: 12,
    activeThisMonth: 8,
    totalRequests: 47,
    totalAmount: 4200000,
    averagePerUser: 525000
  }
];

export const mockCategoryStats = [
  {
    id: 1,
    name: 'Transportation',
    totalRequests: 387,
    totalAmount: 45600000,
    monthlyLimit: 2000000,
    averageAmount: 117800,
    topUsers: ['John Doe', 'Jane Smith', 'Bob Wilson']
  },
  {
    id: 2,
    name: 'Meals',
    totalRequests: 298,
    totalAmount: 38200000,
    monthlyLimit: 1500000,
    averageAmount: 128200,
    topUsers: ['Alice Brown', 'Charlie Davis', 'Eva Martinez']
  },
  {
    id: 3,
    name: 'Training',
    totalRequests: 156,
    totalAmount: 28500000,
    monthlyLimit: 5000000,
    averageAmount: 182700,
    topUsers: ['David Kim', 'Lisa Wang', 'Mike Chen']
  },
  {
    id: 4,
    name: 'Health',
    totalRequests: 89,
    totalAmount: 18900000,
    monthlyLimit: 3000000,
    averageAmount: 212400,
    topUsers: ['Sarah Johnson', 'Tom Anderson', 'Maria Garcia']
  },
  {
    id: 5,
    name: 'Office Supplies',
    totalRequests: 245,
    totalAmount: 12800000,
    monthlyLimit: 1000000,
    averageAmount: 52200,
    topUsers: ['Kevin Lee', 'Nancy White', 'Paul Brown']
  }
];

export const mockRecentRequests = [
  {
    id: 1,
    title: 'Medical Emergency Treatment',
    amount: 2500000,
    category: 'Health',
    status: 'pending',
    employee: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      role: 'employee'
    },
    manager: {
      name: 'Jane Smith',
      email: 'jane.smith@company.com'
    },
    submitted_at: '2024-01-15T09:30:00Z',
    priority: 'high',
    flagged: true,
    flagReason: 'High amount requires admin review'
  },
  {
    id: 2,
    title: 'Annual Conference Registration',
    amount: 3200000,
    category: 'Training',
    status: 'approved',
    employee: {
      name: 'Alice Brown',
      email: 'alice.brown@company.com',
      department: 'HR',
      role: 'employee'
    },
    manager: {
      name: 'Bob Wilson',
      email: 'bob.wilson@company.com'
    },
    submitted_at: '2024-01-14T14:15:00Z',
    approved_at: '2024-01-15T10:30:00Z',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Team Building Event',
    amount: 1800000,
    category: 'Meals',
    status: 'rejected',
    employee: {
      name: 'Charlie Davis',
      email: 'charlie.davis@company.com',
      department: 'Marketing',
      role: 'employee'
    },
    manager: {
      name: 'Diana Martinez',
      email: 'diana.martinez@company.com'
    },
    submitted_at: '2024-01-13T16:45:00Z',
    rejected_at: '2024-01-14T09:20:00Z',
    priority: 'low',
    rejectionReason: 'Not within company policy'
  }
];

export const mockSystemActivity = [
  {
    id: 1,
    type: 'user_created',
    title: 'New user registered',
    details: 'Eva Martinez joined as Marketing employee',
    timestamp: '2024-01-15T11:30:00Z',
    actor: 'System'
  },
  {
    id: 2,
    type: 'policy_updated',
    title: 'Category limit updated',
    details: 'Transportation monthly limit increased to 2.5M',
    timestamp: '2024-01-15T09:15:00Z',
    actor: 'Admin User'
  },
  {
    id: 3,
    type: 'bulk_approval',
    title: 'Bulk approval processed',
    details: '15 requests approved by Manager Jane Smith',
    timestamp: '2024-01-14T16:20:00Z',
    actor: 'Jane Smith'
  },
  {
    id: 4,
    type: 'system_maintenance',
    title: 'System backup completed',
    details: 'Daily backup completed successfully',
    timestamp: '2024-01-14T02:00:00Z',
    actor: 'System'
  },
  {
    id: 5,
    type: 'security_alert',
    title: 'Multiple failed login attempts',
    details: 'IP 192.168.1.100 - account locked',
    timestamp: '2024-01-13T22:45:00Z',
    actor: 'Security System'
  }
];

export const mockDepartmentStats = [
  {
    department: 'Engineering',
    totalUsers: 45,
    totalRequests: 387,
    totalAmount: 52800000,
    averagePerUser: 1173000,
    monthlyBudget: 60000000,
    budgetUsage: 88.0
  },
  {
    department: 'Sales',
    totalUsers: 32,
    totalRequests: 298,
    totalAmount: 41200000,
    averagePerUser: 1287500,
    monthlyBudget: 45000000,
    budgetUsage: 91.6
  },
  {
    department: 'Marketing',
    totalUsers: 28,
    totalRequests: 245,
    totalAmount: 18500000,
    averagePerUser: 660700,
    monthlyBudget: 25000000,
    budgetUsage: 74.0
  },
  {
    department: 'HR',
    totalUsers: 18,
    totalRequests: 156,
    totalAmount: 8900000,
    averagePerUser: 494400,
    monthlyBudget: 15000000,
    budgetUsage: 59.3
  },
  {
    department: 'Operations',
    totalUsers: 22,
    totalRequests: 189,
    totalAmount: 12400000,
    averagePerUser: 563600,
    monthlyBudget: 18000000,
    budgetUsage: 68.9
  },
  {
    department: 'Finance',
    totalUsers: 11,
    totalRequests: 89,
    totalAmount: 6200000,
    averagePerUser: 563600,
    monthlyBudget: 12000000,
    budgetUsage: 51.7
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

export const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
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
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
};