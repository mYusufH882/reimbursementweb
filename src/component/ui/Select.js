"use client";

import { forwardRef, useState } from 'react';

const Select = forwardRef(({ 
  label,
  error,
  helper,
  required = false,
  className = '',
  options = [],
  placeholder = 'Select an option',
  icon,
  size = 'md',
  disabled = false,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);

  const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';
  
  const selectClasses = `${baseClasses} ${sizeClasses[size]} ${errorClasses} ${disabledClasses} ${
    icon ? 'pl-10' : ''
  } ${className}`;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <span className={`text-gray-400 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
              {icon}
            </span>
          </div>
        )}
        
        {/* Select Field */}
        <select
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
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

Select.displayName = 'Select';

export default Select;