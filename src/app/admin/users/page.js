'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/component/layout/MainLayout';
import Card, { CardHeader, CardContent } from '@/component/ui/Card';
import Button from '@/component/ui/Button';
import Badge from '@/component/ui/Badge';
import Input from '@/component/ui/Input';
import Select from '@/component/ui/Select';
import Modal from '@/component/ui/Modal';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'employee'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Mock data sesuai API response: id, name, email, role
      const mockUsers = [
        {
          id: 1,
          name: 'John Admin',
          email: 'john.admin@company.com',
          role: 'admin'
        },
        {
          id: 2,
          name: 'Jane Manager',
          email: 'jane.manager@company.com',
          role: 'manager'
        },
        {
          id: 3,
          name: 'Alice Employee',
          email: 'alice@company.com',
          role: 'employee'
        },
        {
          id: 4,
          name: 'Bob Worker',
          email: 'bob@company.com',
          role: 'employee'
        },
        {
          id: 5,
          name: 'Carol Staff',
          email: 'carol@company.com',
          role: 'employee'
        }
      ];

      setUsers(mockUsers);
      
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = search === '' || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'employee'
    });
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const submitCreate = async () => {
    setProcessing(true);
    try {
      console.log('Creating user:', userForm);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        ...userForm
      };
      
      setUsers(prev => [...prev, newUser]);
      alert('User created successfully!');
      setShowCreateModal(false);
      resetForm();
      
    } catch (error) {
      alert('Failed to create user');
    } finally {
      setProcessing(false);
    }
  };

  const submitEdit = async () => {
    setProcessing(true);
    try {
      console.log('Updating user:', selectedUser.id, userForm);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...userForm }
          : user
      ));
      
      alert('User updated successfully!');
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      
    } catch (error) {
      alert('Failed to update user');
    } finally {
      setProcessing(false);
    }
  };

  const submitDelete = async () => {
    setProcessing(true);
    try {
      console.log('Deleting user:', selectedUser.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      
      alert('User deleted successfully!');
      setShowDeleteModal(false);
      setSelectedUser(null);
      
    } catch (error) {
      alert('Failed to delete user');
    } finally {
      setProcessing(false);
    }
  };

  const getRoleBadge = (role) => {
    const config = {
      admin: { variant: 'error', text: 'Admin' },
      manager: { variant: 'warning', text: 'Manager' },
      employee: { variant: 'default', text: 'Employee' }
    };
    
    const { variant, text } = config[role] || config.employee;
    return <Badge variant={variant}>{text}</Badge>;
  };

  // Simple stats
  const stats = {
    total: filteredUsers.length,
    admins: filteredUsers.filter(u => u.role === 'admin').length,
    managers: filteredUsers.filter(u => u.role === 'manager').length,
    employees: filteredUsers.filter(u => u.role === 'employee').length
  };

  if (loading) {
    return (
      <DashboardLayout
        user={{ name: 'Admin User', role: 'admin' }}
        currentPath="/admin/users"
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
      currentPath="/admin/users"
      onNavigate={(path) => router.push(path)}
      onLogout={() => console.log('logout')}
    >
      <div className="p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage system users and roles</p>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            Add User
          </Button>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
              <div className="text-sm text-gray-600">Admins</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.managers}</div>
              <div className="text-sm text-gray-600">Managers</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.employees}</div>
              <div className="text-sm text-gray-600">Employees</div>
            </CardContent>
          </Card>
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
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900">Users ({filteredUsers.length})</h3>
          </CardHeader>
          <CardContent className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="error"
                              onClick={() => handleDelete(user)}
                              disabled={user.role === 'admin'}
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
          title="Create User"
        >
          <div className="p-4 space-y-4">
            <Input
              label="Name"
              value={userForm.name}
              onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
              required
            />
            
            <Input
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email"
              required
            />
            
            <Select
              label="Role"
              value={userForm.role}
              onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Select>

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
                disabled={processing || !userForm.name || !userForm.email}
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
          title="Edit User"
        >
          <div className="p-4 space-y-4">
            <Input
              label="Name"
              value={userForm.name}
              onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
              required
            />
            
            <Input
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email"
              required
            />
            
            <Select
              label="Role"
              value={userForm.role}
              onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Select>

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
                disabled={processing || !userForm.name || !userForm.email}
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
          title="Delete User"
        >
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this user?
            </p>
            
            {selectedUser && (
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-red-800">
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
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
    </DashboardLayout>
  );
}