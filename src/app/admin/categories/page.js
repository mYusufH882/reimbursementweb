'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/component/layout/MainLayout';
import Card from '@/component/ui/Card';
import { CardHeader, CardContent } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Input from '@/component/ui/Input';
import Select from '@/component/ui/Select';
import Modal from '@/component/ui/Modal';

export default function AdminCategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    limit_type: 'amount',
    limit_value: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Mock data sesuai API response: id, name, limit_type, limit_value
      const mockCategories = [
        { 
          id: 1, 
          name: 'Meals', 
          limit_type: 'amount', 
          limit_value: 500000
        },
        { 
          id: 2, 
          name: 'Transportation', 
          limit_type: 'amount', 
          limit_value: 300000
        },
        { 
          id: 3, 
          name: 'Medical', 
          limit_type: 'amount', 
          limit_value: 1500000
        },
        { 
          id: 4, 
          name: 'Training', 
          limit_type: 'quota', 
          limit_value: 2
        },
        { 
          id: 5, 
          name: 'Office Supplies', 
          limit_type: 'quota', 
          limit_value: 5
        }
      ];

      setCategories(mockCategories);
      
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryForm({
      name: '',
      limit_type: 'amount',
      limit_value: ''
    });
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      limit_type: category.limit_type,
      limit_value: category.limit_value.toString()
    });
    setShowEditModal(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const submitCreate = async () => {
    setProcessing(true);
    try {
      console.log('Creating category:', categoryForm);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCategory = {
        id: Date.now(),
        ...categoryForm,
        limit_value: parseFloat(categoryForm.limit_value)
      };
      
      setCategories(prev => [...prev, newCategory]);
      alert('Category created successfully!');
      setShowCreateModal(false);
      resetForm();
      
    } catch (error) {
      alert('Failed to create category');
    } finally {
      setProcessing(false);
    }
  };

  const submitEdit = async () => {
    setProcessing(true);
    try {
      console.log('Updating category:', selectedCategory.id, categoryForm);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, ...categoryForm, limit_value: parseFloat(categoryForm.limit_value) }
          : cat
      ));
      
      alert('Category updated successfully!');
      setShowEditModal(false);
      setSelectedCategory(null);
      resetForm();
      
    } catch (error) {
      alert('Failed to update category');
    } finally {
      setProcessing(false);
    }
  };

  const submitDelete = async () => {
    setProcessing(true);
    try {
      console.log('Deleting category:', selectedCategory.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
      
      alert('Category deleted successfully!');
      setShowDeleteModal(false);
      setSelectedCategory(null);
      
    } catch (error) {
      alert('Failed to delete category');
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

  const formatLimit = (type, value) => {
    return type === 'amount' 
      ? formatCurrency(value)
      : `${value} requests/month`;
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
            <h1 className="text-2xl font-bold">Category Management</h1>
            <p className="text-gray-600">Manage reimbursement categories and limits</p>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            Add Category
          </Button>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {categories.filter(c => c.limit_type === 'amount').length}
              </div>
              <div className="text-sm text-gray-600">Amount Limits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {categories.filter(c => c.limit_type === 'quota').length}
              </div>
              <div className="text-sm text-gray-600">Quota Limits</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Categories ({categories.length})</h3>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No categories found</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={handleCreate}
                >
                  Create First Category
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Limit Type</th>
                      <th className="text-left p-3">Limit Value</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{category.name}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            category.limit_type === 'amount' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {category.limit_type === 'amount' ? 'Amount' : 'Quota'}
                          </span>
                        </td>
                        <td className="p-3 font-medium">
                          {formatLimit(category.limit_type, category.limit_value)}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(category)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="error"
                              onClick={() => handleDelete(category)}
                            >
                              Delete
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

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Category"
        >
          <div className="p-4 space-y-4">
            <Input
              label="Category Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Transportation"
              required
            />
            
            <Select
              label="Limit Type"
              value={categoryForm.limit_type}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, limit_type: e.target.value }))}
            >
              <option value="amount">Amount (IDR)</option>
              <option value="quota">Quota (Requests)</option>
            </Select>
            
            <Input
              label={`Limit Value ${categoryForm.limit_type === 'amount' ? '(IDR)' : '(Requests)'}`}
              type="number"
              value={categoryForm.limit_value}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, limit_value: e.target.value }))}
              placeholder={categoryForm.limit_type === 'amount' ? '500000' : '5'}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={processing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={submitCreate}
                disabled={processing || !categoryForm.name || !categoryForm.limit_value}
                className="flex-1"
              >
                {processing ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Category"
        >
          <div className="p-4 space-y-4">
            <Input
              label="Category Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Transportation"
              required
            />
            
            <Select
              label="Limit Type"
              value={categoryForm.limit_type}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, limit_type: e.target.value }))}
            >
              <option value="amount">Amount (IDR)</option>
              <option value="quota">Quota (Requests)</option>
            </Select>
            
            <Input
              label={`Limit Value ${categoryForm.limit_type === 'amount' ? '(IDR)' : '(Requests)'}`}
              type="number"
              value={categoryForm.limit_value}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, limit_value: e.target.value }))}
              placeholder={categoryForm.limit_type === 'amount' ? '500000' : '5'}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={processing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={submitEdit}
                disabled={processing || !categoryForm.name || !categoryForm.limit_value}
                className="flex-1"
              >
                {processing ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Category"
        >
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this category?
            </p>
            
            {selectedCategory && (
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-red-800">
                  <p><strong>Name:</strong> {selectedCategory.name}</p>
                  <p><strong>Limit:</strong> {formatLimit(selectedCategory.limit_type, selectedCategory.limit_value)}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={processing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="error"
                onClick={submitDelete}
                disabled={processing}
                className="flex-1"
              >
                {processing ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </MainLayout>
  );
}