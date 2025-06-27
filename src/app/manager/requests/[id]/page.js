'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/component/layout/MainLayout';
import Card, { CardHeader, CardContent } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Badge from '@/component/ui/Badge';
import Textarea from '@/component/ui/Textarea';
import Modal from '@/component/ui/Modal';

export default function ManagerRequestDetail() {
  const router = useRouter();
  const params = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchRequestDetail();
    }
  }, [params.id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      
      // Mock data sesuai API response
      const mockRequest = {
        id: parseInt(params.id),
        title: 'Business Lunch with Client',
        description: 'Client meeting at restaurant to discuss project requirements and timeline.',
        amount: 150000,
        category: { name: 'Meals' },
        user: { 
          id: 3, 
          name: 'Alice Employee', 
          email: 'alice@company.com' 
        },
        status: 'pending',
        submitted_at: '2024-01-20T10:30:00Z',
        proofs: [
          {
            id: 1,
            original_name: 'receipt.jpg',
            file_type: 'image/jpeg',
            file_size: 1024000
          },
          {
            id: 2,
            original_name: 'photo.jpg',
            file_type: 'image/jpeg',
            file_size: 2048000
          }
        ]
      };

      setRequest(mockRequest);
      
    } catch (error) {
      console.error('Failed to fetch request:', error);
      router.push('/manager/pending');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      console.log('Approving request:', request.id);
      
      // API call sesuai Laravel
      const approvalData = { action: 'approve' };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Request approved successfully!');
      router.push('/manager/pending');
      
    } catch (error) {
      alert('Failed to approve request');
    } finally {
      setProcessing(false);
      setShowApprovalModal(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      console.log('Rejecting request:', request.id, 'Reason:', rejectionReason);
      
      // API call sesuai Laravel
      const rejectionData = { 
        action: 'reject',
        reason: rejectionReason 
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Request rejected successfully!');
      router.push('/manager/pending');
      
    } catch (error) {
      alert('Failed to reject request');
    } finally {
      setProcessing(false);
      setShowRejectionModal(false);
      setRejectionReason('');
    }
  };

  const downloadProof = (proof) => {
    console.log('Downloading:', proof.original_name);
    alert(`Downloading: ${proof.original_name}`);
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <DashboardLayout
        user={{ name: 'Manager User', role: 'manager' }}
        currentPath={`/manager/requests/${params.id}`}
        onNavigate={(path) => router.push(path)}
        onLogout={() => console.log('logout')}
      >
        <div className="flex justify-center items-center py-8">
          <span>Loading...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout
        user={{ name: 'Manager User', role: 'manager' }}
        currentPath={`/manager/requests/${params.id}`}
        onNavigate={(path) => router.push(path)}
        onLogout={() => console.log('logout')}
      >
        <div className="text-center py-8">
          <span>Request not found</span>
        </div>
      </DashboardLayout>
    );
  }

  const isPending = request.status === 'pending';

  return (
    <DashboardLayout
      user={{ name: 'Manager User', role: 'manager' }}
      currentPath={`/manager/requests/${params.id}`}
      onNavigate={(path) => router.push(path)}
      onLogout={() => console.log('logout')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Request #{request.id} • Submitted {formatDateTime(request.submitted_at)}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Amount</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(request.amount)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                    <p className="text-lg text-gray-800">{request.category.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {request.description && (
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900">Description</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed">{request.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Proof Files */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900">
                  Proof Files ({request.proofs.length})
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                {request.proofs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No proof files</p>
                ) : (
                  <div className="space-y-3">
                    {request.proofs.map((proof) => (
                      <div
                        key={proof.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-sm text-gray-900">{proof.original_name}</div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(proof.file_size)} • {proof.file_type}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => downloadProof(proof)}
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Actions */}
            {isPending && (
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900">Review Actions</h3>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  
                  <Button
                    variant="success"
                    onClick={() => setShowApprovalModal(true)}
                    disabled={processing}
                    className="w-full"
                  >
                    Approve Request
                  </Button>
                  
                  <Button
                    variant="danger"
                    onClick={() => setShowRejectionModal(true)}
                    disabled={processing}
                    className="w-full"
                  >
                    Reject Request
                  </Button>

                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900">Info</h3>
              </CardHeader>
              <CardContent className="p-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium text-gray-900">{request.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-medium text-gray-900">{request.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{request.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Files:</span>
                  <span className="font-medium text-gray-900">{request.proofs.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-4">
                <Button
                  variant="primary"
                  onClick={() => router.push('/manager/pending')}
                  className="w-full"
                >
                  Back to Pending
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Approval Modal */}
        <Modal
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          title="Approve Request"
          size="md"
        >
          <p className="text-gray-700 mb-4">
            Are you sure you want to approve this request?
          </p>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800">
              <p><strong>Employee:</strong> {request.user.name}</p>
              <p><strong>Amount:</strong> {formatCurrency(request.amount)}</p>
              <p><strong>Category:</strong> {request.category.name}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowApprovalModal(false)}
              disabled={processing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleApprove}
              disabled={processing}
              className="flex-1"
            >
              {processing ? 'Approving...' : 'Approve'}
            </Button>
          </div>
        </Modal>

        {/* Rejection Modal */}
        <Modal
          isOpen={showRejectionModal}
          onClose={() => {
            setShowRejectionModal(false);
            setRejectionReason('');
          }}
          title="Reject Request"
          size="md"
        >
          <p className="text-gray-700 mb-4">
            Please provide a reason for rejecting this request:
          </p>
          
          <div className="mb-6">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionModal(false);
                setRejectionReason('');
              }}
              disabled={processing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
              className="flex-1"
            >
              {processing ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        </Modal>

      </div>
    </DashboardLayout>
  );
}