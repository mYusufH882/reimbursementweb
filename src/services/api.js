// /services/api.js
import AuthService from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  // Generic API call method
  async apiCall(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
        headers: AuthService.getAuthHeaders(),
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Handle Laravel response format (data wrapper)
      return data.data || data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Employee Dashboard API calls
  async getEmployeeDashboard() {
    // No specific endpoint, calculate from requests
    const requests = await this.getEmployeeRequests();
    return this.calculateEmployeeStats(requests);
  }

  async getEmployeeRequests(page = 1) {
    return this.apiCall(`/reimbursements?page=${page}`);
  }

  async getCategoryUsage() {
    return this.apiCall('/reimbursements/category-usage');
  }

  // Helper method to calculate employee stats
  calculateEmployeeStats(requests) {
    const requestsArray = Array.isArray(requests) ? requests : (requests?.data || []);
    
    return {
      total_requests: requestsArray.length,
      pending_requests: requestsArray.filter(r => r.status === 'pending').length,
      approved_requests: requestsArray.filter(r => r.status === 'approved').length,
      rejected_requests: requestsArray.filter(r => r.status === 'rejected').length,
      total_amount: requestsArray
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)
    };
  }

  // Manager Dashboard API calls
  async getManagerDashboard() {
    return this.apiCall('/manager/dashboard');
  }

  async getPendingReimbursements() {
    return this.apiCall('/manager/pending-reimbursements');
  }

  async getManagerReimbursements() {
    return this.apiCall('/manager/reimbursements');
  }

  async getManagerStatistics() {
    return this.apiCall('/manager/statistics');
  }

  // Admin Dashboard API calls
  async getAdminDashboard() {
    return this.apiCall('/admin/dashboard');
  }

  async getAdminUsers() {
    return this.apiCall('/admin/users');
  }

  async getAdminSystemStats() {
    return this.apiCall('/admin/system-stats');
  }

  // Legacy method names for compatibility
  async getUsers() {
    return this.getAdminUsers();
  }

  async getAllReimbursements() {
    return this.getManagerReimbursements();
  }

  // Categories
  async getCategories() {
    return this.apiCall('/categories');
  }

  // Reimbursement operations
  async getReimbursement(id) {
    return this.apiCall(`/reimbursements/${id}`);
  }

  async submitReimbursement(data) {
    return this.apiCall('/reimbursements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReimbursement(id, data) {
    return this.apiCall(`/reimbursements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async approveReimbursement(id) {
    return this.apiCall(`/reimbursements/${id}/approve-reject`, {
      method: 'POST',
      body: JSON.stringify({ action: 'approve' }),
    });
  }

  async rejectReimbursement(id, reason) {
    return this.apiCall(`/reimbursements/${id}/approve-reject`, {
      method: 'POST',
      body: JSON.stringify({ action: 'reject', reason }),
    });
  }
}

export default new ApiService();