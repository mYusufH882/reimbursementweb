"use client";

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ 
  children, 
  user = { name: 'John Doe', role: 'employee', avatar: null },
  currentPath = '/',
  onNavigate,
  onLogout,
  onSearch,
  className = ''
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Sample notifications - in real app would come from API
  const [notifications] = useState([
    {
      id: 1,
      type: 'approval',
      title: 'Request Approved',
      message: 'Your transportation request has been approved.',
      time: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Monthly Limit Warning',
      message: 'You have used 80% of your monthly limit.',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false
    },
    {
      id: 3,
      type: 'rejection',
      title: 'Request Needs Review',
      message: 'Please provide additional documentation.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true
    }
  ]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    if (isMobile) {
      setShowMobileSidebar(false);
    }
    if (onNavigate) {
      onNavigate(path);
    }
  };

  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Get page title based on current path
  const getPageTitle = () => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    if (pathSegments.length < 2) return 'Dashboard';
    
    const page = pathSegments[pathSegments.length - 1];
    return page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
  };

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({ label, path, isLast: index === pathSegments.length - 1 });
    });
    
    return breadcrumbs;
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex ${className}`}>
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} ${
        isMobile && !showMobileSidebar ? 'hidden' : ''
      }`}>
        <Sidebar
          userRole={user.role}
          currentPath={currentPath}
          onNavigate={handleNavigation}
          collapsed={sidebarCollapsed && !isMobile}
          onToggle={handleSidebarToggle}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <Header
          user={user}
          notifications={notifications}
          onLogout={onLogout}
          onSearch={onSearch}
          showSearch={!isMobile}
        />

        {/* Mobile Header Controls */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
            
            <div className="w-10" /> {/* Spacer for center alignment */}
          </div>
        )}

        {/* Page Header with Breadcrumbs */}
        {!isMobile && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
                
                {/* Breadcrumbs */}
                <nav className="flex mt-2" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    {getBreadcrumbs().map((breadcrumb, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && (
                          <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <button
                          onClick={() => !breadcrumb.isLast && handleNavigation(breadcrumb.path)}
                          className={`text-sm font-medium ${
                            breadcrumb.isLast 
                              ? 'text-gray-500 cursor-default' 
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          {breadcrumb.label}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* Page Actions */}
              <div className="flex items-center space-x-3">
                {/* Role-specific quick actions */}
                {user.role === 'employee' && currentPath.includes('/employee') && (
                  <button 
                    onClick={() => handleNavigation('/employee/submit')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <span className="mr-2">➕</span>
                    New Request
                  </button>
                )}
                
                {user.role === 'manager' && currentPath.includes('/manager') && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleNavigation('/manager/pending')}
                      className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100"
                    >
                      <span className="mr-2">⏳</span>
                      Pending Approvals
                    </button>
                    <button 
                      onClick={() => handleNavigation('/manager/reports')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <span className="mr-2">📊</span>
                      Reports
                    </button>
                  </div>
                )}
                
                {user.role === 'admin' && currentPath.includes('/admin') && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleNavigation('/admin/users')}
                      className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100"
                    >
                      <span className="mr-2">👥</span>
                      Manage Users
                    </button>
                    <button 
                      onClick={() => handleNavigation('/admin/settings')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <span className="mr-2">⚙️</span>
                      Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>© 2024 ReimburseApp</span>
              <span>•</span>
              <button className="hover:text-gray-700">Privacy Policy</button>
              <span>•</span>
              <button className="hover:text-gray-700">Terms of Service</button>
            </div>
            
            <div className="mt-2 sm:mt-0 flex items-center space-x-4 text-sm text-gray-500">
              <span>Version 1.0.0</span>
              <span>•</span>
              <button className="hover:text-gray-700">Help & Support</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Layout Wrapper for different page types
export function DashboardLayout({ children, ...props }) {
  return (
    <MainLayout {...props}>
      <div className="space-y-6">
        {children}
      </div>
    </MainLayout>
  );
}

export function FormLayout({ children, ...props }) {
  return (
    <MainLayout {...props}>
      <div className="max-w-3xl mx-auto">
        {children}
      </div>
    </MainLayout>
  );
}

export function TableLayout({ children, ...props }) {
  return (
    <MainLayout {...props}>
      <div className="space-y-6">
        {children}
      </div>
    </MainLayout>
  );
}