'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/component/layout/MainLayout';
import Card from '@/component/ui/Card';
import { CardHeader, CardContent } from '@/component/ui/Card';
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-8">
          <span>Loading...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Requests</h1>
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
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Requests ({filteredRequests.length})</h3>
          </CardHeader>
          <CardContent>
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Title</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{request.title}</td>
                        <td className="p-3 text-gray-600">{request.category.name}</td>
                        <td className="p-3 font-medium">{formatCurrency(request.amount)}</td>
                        <td className="p-3">{getStatusBadge(request.status)}</td>
                        <td className="p-3 text-gray-600">{formatDate(request.submitted_at)}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/employee/requests/${request.id}`)}
                            >
                              View
                            </Button>
                            {request.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="secondary"
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
    </MainLayout>
  );
}