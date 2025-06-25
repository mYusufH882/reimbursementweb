export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    // Reimbursement specific statuses
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

// Status Badge specifically for reimbursement statuses
export function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    pending: { variant: 'pending', text: 'Pending', icon: '⏳' },
    approved: { variant: 'approved', text: 'Approved', icon: '✅' },
    rejected: { variant: 'rejected', text: 'Rejected', icon: '❌' },
    draft: { variant: 'draft', text: 'Draft', icon: '📝' }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant} className={className}>
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </Badge>
  );
}

// Priority Badge
export function PriorityBadge({ priority, className = '' }) {
  const priorityConfig = {
    low: { variant: 'secondary', text: 'Low' },
    medium: { variant: 'warning', text: 'Medium' },
    high: { variant: 'danger', text: 'High' },
    urgent: { variant: 'danger', text: 'Urgent' }
  };
  
  const config = priorityConfig[priority] || priorityConfig.low;
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
}