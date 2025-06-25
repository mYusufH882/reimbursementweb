export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md',
  ...props 
}) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg'
  };
  
  const classes = `${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// Card Header Component
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

// Card Title Component  
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

// Card Content Component
export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

// Stats Card Component (for dashboard)
export function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  className = '' 
}) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600', 
    neutral: 'text-gray-600'
  };
  
  return (
    <Card className={className}>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeColors[changeType]} mt-1`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4">
            <div className="w-8 h-8 text-gray-400">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}