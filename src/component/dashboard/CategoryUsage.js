'use client';

import { 
  formatCategoryLimit, 
  formatCategoryUsage, 
  formatPercentage,
  getUsageColor,
  getUsageTextColor 
} from '@/utils/formatters';

export default function CategoryUsage({ categories = [] }) {
  if (!categories.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Category Usage
        </h3>
        <div className="text-center py-8 text-gray-500">
          No category usage data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Monthly Category Usage
      </h3>
      <div className="space-y-4">
        {categories.map((category, index) => {
          const percentage = category.usage?.percentage_used || 0;
          const usedValue = category.usage?.used || 0;
          const limitValue = category.limit_value || 0;
          const limitType = category.limit_type || 'quota';
          const categoryName = category.category_name || category.name || 'Unknown';
          
          return (
            <div key={category.id || index} className="border-b border-gray-200 pb-4 last:border-0">
              {/* Category Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {categoryName}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {limitType === 'amount' ? 'Amount' : 'Quota'}
                  </span>
                </div>
                <span className={`text-sm font-medium ${getUsageTextColor(percentage)}`}>
                  {formatPercentage(percentage)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>

              {/* Usage Details */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Used: {formatCategoryUsage(limitType, usedValue)}
                </span>
                <span>
                  Limit: {formatCategoryLimit(limitType, limitValue)}
                </span>
              </div>

              {/* Warning for high usage */}
              {percentage >= 90 && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  ⚠️ Near limit - consider reducing usage
                </div>
              )}
              {percentage >= 75 && percentage < 90 && (
                <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                  ⚡ High usage - monitor carefully
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Individual category usage item
export function CategoryUsageItem({ category }) {
  const percentage = category.usage?.percentage_used || 0;
  const usedValue = category.usage?.used || 0;
  const limitValue = category.limit_value || 0;
  const limitType = category.limit_type || 'quota';
  const categoryName = category.category_name || category.name || 'Unknown';

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-900">{categoryName}</h4>
        <span className={`text-sm font-semibold ${getUsageTextColor(percentage)}`}>
          {formatPercentage(percentage)}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className={`h-3 rounded-full ${getUsageColor(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Used:</span>
          <div className="font-medium text-gray-900">
            {formatCategoryUsage(limitType, usedValue)}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Limit:</span>
          <div className="font-medium text-gray-900">
            {formatCategoryLimit(limitType, limitValue)}
          </div>
        </div>
      </div>
    </div>
  );
}