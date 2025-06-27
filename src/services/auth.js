const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Laravel API response might be wrapped in 'data' property
      const responseData = data.data || data;
      
      // Debug log
      console.log('API Response:', data);
      console.log('Response Data:', responseData);
      console.log('User:', responseData.user);

      if (!responseData.user || !responseData.token) {
        throw new Error('Invalid response format from server');
      }

      // Store token and user info
      localStorage.setItem('auth_token', responseData.token);
      localStorage.setItem('user_data', JSON.stringify(responseData.user));

      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Network error');
    }
  }

  // Logout user
  async logout() {
    try {
      const token = this.getToken();
      
      if (token) {
        // Call logout API to invalidate token on server
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
        }).catch(() => {
          // Ignore API errors, still clear local storage
          console.log('Server logout failed, clearing local session anyway');
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage regardless of API success/failure
      this.clearSession();
    }
  }

  // Clear session data
  clearSession() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/auth/login';
  }

  // Force logout (immediate clear without API call)
  forceLogout() {
    this.clearSession();
  }

  // Get stored token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Get user data
  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          console.log('Getting user from localStorage:', parsed); // DEBUG
          return parsed;
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user_data');
          return null;
        }
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Get user role
  getUserRole() {
    const user = this.getUser();
    return user?.role || null;
  }

  // Check if user has specific role
  hasRole(role) {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin');
  }

  // Check if user is manager (admin can also act as manager)
  isManager() {
    const userRole = this.getUserRole();
    return userRole === 'manager' || userRole === 'admin';
  }

  // Check if user is employee
  isEmployee() {
    return this.hasRole('employee');
  }

  // Get auth headers for API calls
  getAuthHeaders() {
    const token = this.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    } : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
}

// Export singleton instance
export default new AuthService();