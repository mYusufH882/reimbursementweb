"use client";

import { forwardRef, useState } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helper,
  required = false,
  className = '',
  type = 'text',
  icon,
  rightIcon,
  size = 'md',
  variant = 'default',
  disabled = false,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);

  const baseClasses = 'block w-full rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm', 
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    default: `border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
      error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
    }`,
    filled: `border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500 ${
      error ? 'bg-red-50 focus:border-red-500 focus:ring-red-500' : ''
    }`,
    outlined: `border-2 border-gray-300 bg-transparent focus:border-blue-500 focus:ring-blue-500 ${
      error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
    }`
  };

  const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';
  
  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${
    icon ? 'pl-10' : ''
  } ${rightIcon ? 'pr-10' : ''} ${className}`;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`text-gray-400 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
              {icon}
            </span>
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className={`text-gray-400 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
              {rightIcon}
            </span>
          </div>
        )}
        
        {/* Focus Ring Effect */}
        {focused && !error && (
          <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 ring-opacity-20 pointer-events-none" />
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">❌</span>
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;