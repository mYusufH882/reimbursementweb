'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/component/layout/MainLayout';
import Card from '@/component/ui/Card';
import { CardHeader, CardContent } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Input from '@/component/ui/Input';
import Select from '@/component/ui/Select';

export default function PendingApprovals() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, search, categoryFilter]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      
      // Mock data sesuai API response
      const mockRequests = [
        {
          id: 1,
          title: 'Business Lunch',
          amount: 150000,
          category: { name: 'Meals' },
          user: { id: 3, name: 'Alice Employee', email: 'alice@company.com' },
          submitted_at: '2024-01-20T10:30:00Z'
        },
        {
          id: 2,
          title: 'Taxi to Airport',
          amount: 85000,
          category: { name: 'Transportation' },
          user: { id: 4, name: 'Bob Worker', email: 'bob@company.com' },
          submitted_at: '2024-01-21T08:15:00Z'
        },
        {
          id: 3,
          title: 'Medical Checkup',
          amount: 500000,
          category: { name: 'Medical' },
          user: { id: 5, name: 'Carol Staff', email: 'carol@company.com' },
          submitted_at: '2024-01-18T16:45:00Z'
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

    if (categoryFilter) {
      filtered = filtered.filter(req => req.category.name === categoryFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleApproval = async (requestId, action) => {
    setProcessing(true);
    try {
      console.log(`${action} request:`, requestId);
      
      // API call sesuai Laravel: POST /api/reimbursements/{id}/approve-reject
      const approvalData = { action }; // 'approve' or 'reject'
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from pending list
      setRequests(prev => prev.filter(r => r.id !== requestId));
      
      alert(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
    } catch (error) {
      alert(`Failed to ${action} request`);
    } finally {
      setProcessing(false);
    }
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Pending Approvals</h1>
          <p className="text-gray-600">Review and approve requests</p>
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Pending Requests ({filteredRequests.length})</h3>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending requests</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Employee</th>
                      <th className="text-left p-3">Title</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{request.user.name}</div>
                            <div className="text-sm text-gray-500">{request.user.email}</div>
                          </div>
                        </td>
                        <td className="p-3 font-medium">{request.title}</td>
                        <td className="p-3 text-gray-600">{request.category.name}</td>
                        <td className="p-3 font-medium">{formatCurrency(request.amount)}</td>
                        <td className="p-3 text-gray-600">{formatDate(request.submitted_at)}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/manager/requests/${request.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleApproval(request.id, 'approve')}
                              disabled={processing}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="error"
                              onClick={() => handleApproval(request.id, 'reject')}
                              disabled={processing}
                            >
                              Reject
                            </Button>
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