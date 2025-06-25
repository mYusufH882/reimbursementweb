'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/component/layout/MainLayout';
import Card from '@/component/ui/Card';
import { CardHeader, CardContent } from '@/component/ui/Card';
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
      <MainLayout>
        <div className="flex justify-center items-center py-8">
          <span>Loading...</span>
        </div>
      </MainLayout>
    );
  }

  if (!request) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Request Not Found</h1>
          <Button onClick={() => router.push('/manager/pending')}>
            Back to Pending
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isPending = request.status === 'pending';

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-3"
            >
              ← Back
            </Button>
            <h1 className="text-2xl font-bold">{request.title}</h1>
          </div>
          <div className="text-right">
            {getStatusBadge(request.status)}
            <div className="mt-2 text-sm text-gray-500">
              Submitted: {formatDateTime(request.submitted_at)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Employee Info */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Employee</h2>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="text-lg font-medium">{request.user.name}</div>
                  <div className="text-blue-600">{request.user.email}</div>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Request Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Amount</label>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(request.amount)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <div className="text-lg font-medium">{request.category.name}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{request.description}</p>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Proof Files */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Proof Files ({request.proofs.length})</h2>
              </CardHeader>
              <CardContent>
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
                          <div className="font-medium text-sm">{proof.original_name}</div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(proof.file_size)} • {proof.file_type}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
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
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Review Actions</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  <Button
                    variant="success"
                    onClick={() => setShowApprovalModal(true)}
                    disabled={processing}
                    className="w-full"
                  >
                    Approve Request
                  </Button>
                  
                  <Button
                    variant="error"
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
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Info</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span>{request.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span>{request.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span>{request.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Files:</span>
                  <span>{request.proofs.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardContent className="p-4">
                <Button
                  variant="outline"
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
        >
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to approve this request?
            </p>
            
            <div className="bg-green-50 rounded-lg p-4 mb-4">
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
          </div>
        </Modal>

        {/* Rejection Modal */}
        <Modal
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          title="Reject Request"
        >
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Please provide a reason for rejecting this request:
            </p>
            
            <div className="mb-4">
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
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
                variant="error"
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1"
              >
                {processing ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </MainLayout>
  );
}