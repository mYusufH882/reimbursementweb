'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/component/layout/MainLayout';
import Card, { CardHeader, CardContent } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Badge from '@/component/ui/Badge';
import Input from '@/component/ui/Input';
import Select from '@/component/ui/Select';

export default function MyRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, search, statusFilter]);

  const fetchRequests = async () => {
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
          submitted_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Taxi to Airport',
          amount: 85000,
          status: 'pending',
          category: { name: 'Transportation' },
          submitted_at: '2024-01-21T08:15:00Z'
        },
        {
          id: 3,
          title: 'Medical Checkup',
          amount: 200000,
          status: 'rejected',
          category: { name: 'Medical' },
          submitted_at: '2024-01-12T16:45:00Z'
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
        req.category.name.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { variant: 'warning', text: 'Pending' },
      approved: { variant: 'success', text: 'Approved' },
      rejected: { variant: 'danger', text: 'Rejected' }
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

  if (loading) {
    return (
      <DashboardLayout
        user={{ name: 'Employee User', role: 'employee' }}
        currentPath="/employee/requests"
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
      user={{ name: 'Employee User', role: 'employee' }}
      currentPath="/employee/requests"
      onNavigate={(path) => router.push(path)}
      onLogout={() => console.log('logout')}
    >
      <div className="p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
            <p className="text-gray-600">Track your submissions</p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/employee/submit')}
          >
            New Request
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900">Requests ({filteredRequests.length})</h3>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No requests found</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => router.push('/employee/submit')}
                >
                  Submit Your First Request
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
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
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{request.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{request.category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{formatCurrency(request.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(request.submitted_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => router.push(`/employee/requests/${request.id}`)}
                            >
                              View
                            </Button>
                            {request.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={() => router.push(`/employee/requests/${request.id}/edit`)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
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