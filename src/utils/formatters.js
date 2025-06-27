// Format currency (Indonesian Rupiah)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

// Format number for quota display
export const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number || 0);
};

// Format category limit based on type
export const formatCategoryLimit = (limitType, limitValue) => {
  if (limitType === 'amount') {
    return formatCurrency(limitValue);
  }
  return `${formatNumber(limitValue)} requests`;
};

// Format category usage based on type
export const formatCategoryUsage = (limitType, usedValue) => {
  if (limitType === 'amount') {
    return formatCurrency(usedValue);
  }
  return `${formatNumber(usedValue)} requests`;
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format datetime
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return `${(value || 0).toFixed(decimals)}%`;
};

// Get usage color based on percentage
export const getUsageColor = (percentage) => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 75) return 'bg-yellow-500';
  if (percentage >= 50) return 'bg-blue-500';
  return 'bg-green-500';
};

// Get usage text color based on percentage
export const getUsageTextColor = (percentage) => {
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 75) return 'text-yellow-600';
  if (percentage >= 50) return 'text-blue-600';
  return 'text-green-600';
};