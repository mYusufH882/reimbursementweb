'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/component/layout/MainLayout';
import Card, { CardHeader, CardContent } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Badge from '@/component/ui/Badge';
import Input from '@/component/ui/Input';
import Select from '@/component/ui/Select';

export default function AdminAllRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchAllRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, search, statusFilter, categoryFilter]);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      
      // Mock data sesuai API response
      const mockRequests = [
        {
          id: 1,
          title: 'Business Lunch',
          amount: 150000,
          status: 'approved',
          category: { name: 'Meals' },
          user: { id: 3, name: 'Alice Employee', email: 'alice@company.com' },
          submitted_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Taxi to Airport',
          amount: 85000,
          status: 'pending',
          category: { name: 'Transportation' },
          user: { id: 4, name: 'Bob Worker', email: 'bob@company.com' },
          submitted_at: '2024-01-21T08:15:00Z'
        },
        {
          id: 3,
          title: 'Office Supplies',
          amount: 45000,
          status: 'rejected',
          category: { name: 'Office Supplies' },
          user: { id: 5, name: 'Carol Staff', email: 'carol@company.com' },
          submitted_at: '2024-01-12T16:45:00Z'
        },
        {
          id: 4,
          title: 'Hotel Accommodation',
          amount: 750000,
          status: 'approved',
          category: { name: 'Accommodation' },
          user: { id: 6, name: 'David Worker', email: 'david@company.com' },
          submitted_at: '2024-01-10T12:00:00Z'
        },
        {
          id: 5,
          title: 'Medical Checkup',
          amount: 200000,
          status: 'pending',
          category: { name: 'Medical' },
          user: { id: 7, name: 'Eve Assistant', email: 'eve@company.com' },
          submitted_at: '2024-01-20T11:30:00Z'
        },
        {
          id: 6,
          title: 'Training Workshop',
          amount: 850000,
          status: 'approved',
          category: { name: 'Training' },
          user: { id: 8, name: 'Frank Developer', email: 'frank@company.com' },
          submitted_at: '2024-01-05T14:20:00Z'
        }
      ];

      setRequests(mockRequests);
      
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(req =>
        req.title.toLowerCase().includes(searchLower) ||
        req.user.name.toLowerCase().includes(searchLower) ||
        req.category.name.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(req => req.category.name === categoryFilter);
    }

    setFilteredRequests(filtered);
  };

  const exportData = () => {
    const csvData = filteredRequests.map(req => ({
      ID: req.id,
      Employee: req.user.name,
      Email: req.user.email,
      Title: req.title,
      Category: req.category.name,
      Amount: req.amount,
      Status: req.status,
      Submitted: req.submitted_at
    }));
    
    console.log('Exporting data:', csvData);
    alert(`Exporting ${csvData.length} records to CSV...`);
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { variant: 'warning', text: 'Pending' },
      approved: { variant: 'success', text: 'Approved' },
      rejected: { variant: 'error', text: 'Rejected' }
    };
    
    const { variant, text } = config[status] || { variant: 'default', text: status };
    return <Badge variant={variant}>{text}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const uniqueCategories = [...new Set(requests.map(r => r.category.name))];

  // Simple stats
  const stats = {
    total: filteredRequests.length,
    pending: filteredRequests.filter(r => r.status === 'pending').length,
    approved: filteredRequests.filter(r => r.status === 'approved').length,
    rejected: filteredRequests.filter(r => r.status === 'rejected').length,
    totalAmount: filteredRequests.reduce((sum, r) => sum + r.amount, 0),
    approvedAmount: filteredRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0)
  };

  if (loading) {
    return (
      <DashboardLayout
        user={{ name: 'Admin User', role: 'admin' }}
        currentPath="/admin/requests"
        onNavigate={(path) => router.push(path)}
        onLogout={() => console.log('logout')}
      >
        <div className="flex justify-center items-center py-8">
          <span>Loading...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={{ name: 'Admin User', role: 'admin' }}
      currentPath="/admin/requests"
      onNavigate={(path) => router.push(path)}
      onLogout={() => console.log('logout')}
    >
      <div className="p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Requests</h1>
            <p className="text-gray-600">All reimbursement requests in the system</p>
          </div>
          <Button
            variant="outline"
            onClick={exportData}
            disabled={filteredRequests.length === 0}
          >
            Export ({filteredRequests.length})
          </Button>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-yellow-600">{stats.pending} Pending</div>
                  <div className="text-green-600">{stats.approved} Approved</div>
                  <div className="text-red-600">{stats.rejected} Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(stats.approvedAmount)}</div>
                  <div className="text-sm text-gray-600">Approved Amount</div>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900">All Requests ({filteredRequests.length})</h3>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{request.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{request.user.name}</div>
                            <div className="text-sm text-gray-500">{request.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{request.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{request.category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{formatCurrency(request.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(request.submitted_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/requests/${request.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}