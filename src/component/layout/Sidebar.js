"use client";

import { useState } from 'react';

export default function Sidebar({ userRole = 'employee', currentPath = '/', onNavigate, collapsed = false, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) onToggle(!isCollapsed);
  };

  // Menu items based on user role
  const menuItems = {
    employee: [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: '🏠', 
        path: '/employee/dashboard',
        // description: 'Overview & Stats'
      },
      { 
        id: 'submit', 
        label: 'New Reimbursement', 
        icon: '➕', 
        path: '/employee/submit',
        // description: 'New Reimbursement'
      },
      { 
        id: 'requests', 
        label: 'My Requests', 
        icon: '📋', 
        path: '/employee/requests',
        // description: 'View All Requests'
      },
      { 
        id: 'profile', 
        label: 'Profile', 
        icon: '👤', 
        path: '/employee/profile',
        // description: 'Account Settings'
      }
    ],
    manager: [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: '🏠', 
        path: '/manager/dashboard',
        // description: 'Overview & Pending'
      },
      { 
        id: 'pending', 
        label: 'Pending Approvals', 
        icon: '⏳', 
        path: '/manager/pending',
        // description: 'Needs Review',
        badge: '5' // Dynamic pending count
      },
      { 
        id: 'requests', 
        label: 'All Requests', 
        icon: '📊', 
        path: '/manager/requests',
        // description: 'Complete History'
      },
      { 
        id: 'team', 
        label: 'Team Overview', 
        icon: '👥', 
        path: '/manager/team',
        // description: 'Team Analytics'
      },
      { 
        id: 'reports', 
        label: 'Reports', 
        icon: '📈', 
        path: '/manager/reports',
        // description: 'Monthly Reports'
      }
    ],
    admin: [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: '🏠', 
        path: '/admin/dashboard',
        // description: 'System Overview'
      },
      { 
        id: 'users', 
        label: 'User Management', 
        icon: '👥', 
        path: '/admin/users',
        // description: 'Manage Users'
      },
      { 
        id: 'requests', 
        label: 'All Requests', 
        icon: '📋', 
        path: '/admin/requests',
        // description: 'Global View'
      },
      { 
        id: 'categories', 
        label: 'Categories', 
        icon: '🏷️', 
        path: '/admin/categories',
        // description: 'Manage Categories'
      },
      { 
        id: 'settings', 
        label: 'System Settings', 
        icon: '⚙️', 
        path: '/admin/settings',
        // description: 'Configuration'
      },
      { 
        id: 'reports', 
        label: 'Analytics', 
        icon: '📊', 
        path: '/admin/analytics',
        // description: 'System Analytics'
      }
    ]
  };

  const currentMenuItems = menuItems[userRole] || menuItems.employee;

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-gray-900">ReimburseApp</h1>
            <p className="text-xs text-gray-500 capitalize">{userRole} Portal</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg 
            className={`w-5 h-5 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Role Badge */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            userRole === 'admin' ? 'bg-purple-100 text-purple-800' :
            userRole === 'manager' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {userRole === 'admin' && '👑'}
            {userRole === 'manager' && '👔'}
            {userRole === 'employee' && '👨‍💼'}
            <span className="ml-1 capitalize">{userRole}</span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {currentMenuItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {userRole.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userRole === 'admin' ? 'Admin User' : 
                 userRole === 'manager' ? 'Manager User' : 
                 'Employee User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userRole}@company.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}