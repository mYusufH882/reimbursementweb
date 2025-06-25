"use client";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-white">💰</span>
          </div>
          
          {/* App Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ReimburseApp
          </h1>
          
          {/* Page Title */}
          {title && (
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {title}
            </h2>
          )}
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 ReimburseApp. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-400">
            <button className="hover:text-gray-600">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-gray-600">Terms of Service</button>
            <span>•</span>
            <button className="hover:text-gray-600">Help & Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}