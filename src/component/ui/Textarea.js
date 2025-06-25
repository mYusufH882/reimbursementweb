"use client";

import { forwardRef, useState } from 'react';

const Textarea = forwardRef(({ 
  label,
  error,
  helper,
  required = false,
  className = '',
  rows = 4,
  maxLength,
  showCharCount = false,
  resize = 'vertical',
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(props.value?.length || 0);

  const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };
  
  const textareaClasses = `${baseClasses} ${errorClasses} ${resizeClasses[resize]} ${className}`;

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          className={textareaClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          {...props}
        />
        
        {/* Focus Ring Effect */}
        {focused && !error && (
          <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 ring-opacity-20 pointer-events-none" />
        )}
      </div>
      
      {/* Character Count & Helper/Error */}
      <div className="mt-1 flex justify-between items-start">
        <div className="flex-1">
          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <span className="mr-1">❌</span>
              {error}
            </p>
          )}
          
          {/* Helper Text */}
          {helper && !error && (
            <p className="text-sm text-gray-500">
              {helper}
            </p>
          )}
        </div>
        
        {/* Character Count */}
        {(showCharCount || maxLength) && (
          <p className={`text-xs ml-2 ${
            maxLength && charCount > maxLength * 0.9 
              ? charCount >= maxLength 
                ? 'text-red-500' 
                : 'text-orange-500'
              : 'text-gray-400'
          }`}>
            {charCount}{maxLength && `/${maxLength}`}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;