"use client";

import { useState, useMemo } from 'react';

export default function Table({ 
  columns, 
  data, 
  sortable = true,
  searchable = true,
  selectable = false,
  bulkActions = [],
  onRowClick,
  onSelectionChange,
  className = '',
  emptyMessage = 'No data available',
  searchPlaceholder = 'Search...',
  ...props 
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Search functionality
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => {
      return columns.some(column => {
        const value = row[column.key];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Sort functionality
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(sortedData.map(row => row.id));
      setSelectedRows(allIds);
      setSelectAll(true);
    }
  };

  const handleRowSelect = (rowId) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowId)) {
      newSelectedRows.delete(rowId);
    } else {
      newSelectedRows.add(rowId);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === sortedData.length);
    
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelectedRows));
    }
  };

  const handleBulkAction = (action) => {
    if (action.onClick) {
      action.onClick(Array.from(selectedRows));
    }
  };

  return (
    <div className={`${className}`} {...props}>
      {/* Search and Bulk Actions Bar */}
      {(searchable || (selectable && bulkActions.length > 0)) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          {/* Search */}
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}

          {/* Bulk Actions */}
          {selectable && selectedRows.size > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedRows.size} selected
              </span>
              <div className="flex gap-2">
                {bulkActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleBulkAction(action)}
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      action.variant === 'danger' 
                        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                        : action.variant === 'success'
                        ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                    disabled={action.disabled}
                  >
                    {action.icon && <span className="mr-1">{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {/* Select All Checkbox */}
                {selectable && (
                  <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {sortable && column.sortable !== false && (
                        <span className="text-gray-400">
                          {sortConfig.key === column.key ? (
                            sortConfig.direction === 'asc' ? '↑' : '↓'
                          ) : (
                            '↕'
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length + (selectable ? 1 : 0)} 
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    {searchTerm ? `No results found for "${searchTerm}"` : emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((row, index) => (
                  <tr 
                    key={row.id || index}
                    className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${
                      selectedRows.has(row.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {/* Row Checkbox */}
                    {selectable && (
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                          checked={selectedRows.has(row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(row.id);
                          }}
                        />
                      </td>
                    )}
                    
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {searchable && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {sortedData.length} of {data.length} results
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      )}
    </div>
  );
}

// Table Header Component
export function TableHeader({ children, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${className}`}>
      {children}
    </div>
  );
}

// Table Actions Component (for buttons like Add, Export, etc.)
export function TableActions({ children, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
}

// Table Filters Component
export function TableFilters({ children, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}