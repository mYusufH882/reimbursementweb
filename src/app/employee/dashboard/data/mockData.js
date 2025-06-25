// File ini berisi data dummy untuk testing dashboard

export const mockUserStats = {
  totalRequests: 24,
  pendingRequests: 3,
  approvedRequests: 18,
  rejectedRequests: 3,
  monthlyUsage: 3750000, // 3.75M IDR
  monthlyLimit: 5000000,  // 5M IDR
  thisMonthAmount: 3750000,
  lastMonthAmount: 3200000
};

export const mockRecentRequests = [
  {
    id: 1,
    title: 'Transportation to Client Meeting',
    amount: 150000,
    category: 'Transportation',
    status: 'pending',
    submitted_at: '2024-01-15T08:30:00Z',
    description: 'Uber ride to client office for project discussion'
  },
  {
    id: 2,
    title: 'Team Lunch Expense',
    amount: 450000,
    category: 'Meals',
    status: 'approved',
    submitted_at: '2024-01-14T12:15:00Z',
    description: 'Team building lunch at restaurant'
  },
  {
    id: 3,
    title: 'Office Supplies Purchase',
    amount: 85000,
    category: 'Office Supplies',
    status: 'approved',
    submitted_at: '2024-01-13T09:45:00Z',
    description: 'Notebooks and pens for team'
  },
  {
    id: 4,
    title: 'Parking Fee',
    amount: 25000,
    category: 'Transportation',
    status: 'rejected',
    submitted_at: '2024-01-12T17:20:00Z',
    description: 'Parking at mall during personal time'
  },
  {
    id: 5,
    title: 'Conference Registration',
    amount: 800000,
    category: 'Training',
    status: 'pending',
    submitted_at: '2024-01-11T14:10:00Z',
    description: 'Tech conference registration fee'
  }
];

// Helper functions untuk formatting
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