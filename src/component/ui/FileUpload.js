"use client";

import { useState, useRef } from 'react';
import Button from './Button';

export default function FileUpload({
  label,
  error,
  helper,
  required = false,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 2 * 1024 * 1024, // 2MB default
  maxFiles = 1,
  onFileSelect,
  className = '',
  disabled = false
}) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const allowedTypes = accept.split(',').map(type => type.trim());
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      errors.push(`File type not allowed. Allowed: ${allowedTypes.join(', ')}`);
    }
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size too large. Max: ${formatFileSize(maxSize)}`);
    }
    
    return errors;
  };

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    const validFiles = [];
    const errors = [];

    fileList.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push({
          file,
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        });
      } else {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    });

    // Check max files limit
    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      errors.push(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      
      if (onFileSelect) {
        onFileSelect(updatedFiles);
      }

      // Simulate upload progress
      validFiles.forEach(fileObj => {
        simulateUpload(fileObj.id);
      });
    }

    if (errors.length > 0) {
      console.error('File upload errors:', errors);
    }
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));
    }, 200);
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    
    // Clean up progress
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    
    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (disabled) return;
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'doc':
      case 'docx': return '📝';
      default: return '📎';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="text-center">
          <div className="text-4xl mb-4">
            {dragActive ? '📤' : '📁'}
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span>
            {' '}or drag and drop
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {allowedTypes.join(', ')} up to {formatFileSize(maxSize)}
            {maxFiles > 1 && ` (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((fileObj) => (
            <div key={fileObj.id} className="flex items-center p-3 bg-gray-50 rounded-lg border">
              
              {/* File Info */}
              <div className="flex items-center flex-1">
                <span className="text-lg mr-3">{getFileIcon(fileObj.name)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileObj.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileObj.size)}
                  </p>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress[fileObj.id] !== undefined && uploadProgress[fileObj.id] < 100 && (
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[fileObj.id]}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(uploadProgress[fileObj.id])}% uploaded
                  </p>
                </div>
              )}

              {/* Success/Remove */}
              {uploadProgress[fileObj.id] === 100 && (
                <span className="text-green-500 mr-2">✅</span>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(fileObj.id);
                }}
                disabled={disabled}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="mr-1">❌</span>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helper && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
}