'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/component/layout/MainLayout';
import Card, { CardHeader, CardContent } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Input from '@/component/ui/Input';
import Textarea from '@/component/ui/Textarea';
import Select from '@/component/ui/Select';
import FileUpload from '@/component/ui/FileUpload';

export default function SubmitRequest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category_id: '',
    proofs: []
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Sesuai API: id, name, limit_type, limit_value
      const mockCategories = [
        { id: 1, name: 'Transportation', limit_type: 'amount', limit_value: 1000000 },
        { id: 2, name: 'Meals', limit_type: 'amount', limit_value: 500000 },
        { id: 3, name: 'Medical', limit_type: 'amount', limit_value: 1500000 },
        { id: 4, name: 'Office Supplies', limit_type: 'quota', limit_value: 5 }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (files) => {
    setFormData(prev => ({ ...prev, proofs: files }));
    if (errors.proofs) {
      setErrors(prev => ({ ...prev, proofs: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (formData.proofs.length === 0) newErrors.proofs = 'At least one proof file is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // API call sesuai Laravel validation
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('amount', formData.amount);
      submitData.append('category_id', formData.category_id);
      
      formData.proofs.forEach((file, index) => {
        submitData.append(`proofs[${index}]`, file);
      });
      
      console.log('Submitting:', Object.fromEntries(submitData));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Request submitted successfully!');
      router.push('/employee/requests');
      
    } catch (error) {
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const selectedCategory = categories.find(c => c.id === parseInt(formData.category_id));

  return (
    <DashboardLayout
      user={{ name: 'Employee User', role: 'employee' }}
      currentPath="/employee/submit"
      onNavigate={(path) => router.push(path)}
      onLogout={() => console.log('logout')}
    >
      <div className="mx-auto p-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Submit Request</h1>
          <p className="text-gray-600">Fill the form below</p>
        </div>

        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Business lunch"
                error={errors.title}
                className="w-full text-gray-900"
                required
              />

              <Select
                label="Category"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                error={errors.category_id}
                className="w-full text-gray-900"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} - {cat.limit_type === 'amount' 
                      ? formatCurrency(cat.limit_value)
                      : `${cat.limit_value} requests`
                    }
                  </option>
                ))}
              </Select>
              
              {selectedCategory && (
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    Limit: {selectedCategory.limit_type === 'amount' 
                      ? formatCurrency(selectedCategory.limit_value)
                      : `${selectedCategory.limit_value} requests per month`
                    }
                  </p>
                </div>
              )}

              <Input
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0"
                error={errors.amount}
                className="w-full text-gray-900"
                required
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your expense..."
                rows={4}
                error={errors.description}
                className="w-full text-gray-900 p-4"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Proof Files <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  multiple
                  maxFiles={3}
                  maxSize={2 * 1024 * 1024}
                  onFilesChange={handleFileChange}
                  error={errors.proofs}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload 1-3 files (JPG, PNG, PDF). Max 2MB each.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}