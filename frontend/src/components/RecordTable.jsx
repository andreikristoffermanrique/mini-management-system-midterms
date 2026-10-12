import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';

/**
 * RecordTable component for displaying records in a structured, responsive table.
 * Supports case-insensitive client-side search, pagination, loading states, and error handling.
 * 
 * Props:
 * - records: Array of record objects ({ id, title, description, created_at, user_id })
 * - onEdit: Optional callback function invoked when Edit action is clicked (record) => void
 * - onDelete: Optional callback function invoked when Delete action is clicked (record) => void
 * - emptyMessage: Optional custom empty state message
 * - externalSearchQuery: Optional controlled search string from parent
 * - onSearchChange: Optional callback when search string changes
 * - pageSize: Number of records displayed per page (default: 5)
 * - showPagination: Boolean to toggle pagination controls (default: true)
 * - isLoading: Boolean indicating data fetching state (default: false)
 * - loadingMessage: String displayed during loading state (default: 'Loading records...')
 * - error: String or Error object for displaying fetch failure (default: null)
 * - onRetry: Optional callback when user clicks retry after error
 */
export default function RecordTable({
  records = [],
  onEdit,
  onDelete,
  emptyMessage = 'No records available.',
  externalSearchQuery,
  onSearchChange,
  pageSize = 5,
  showPagination = true,
  isLoading = false,
  loadingMessage = 'Loading records...',
  error = null,
  onRetry,
}) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Support controlled or uncontrolled search
  const isControlledSearch = typeof externalSearchQuery === 'string';
  const searchQuery = isControlledSearch ? externalSearchQuery : internalSearchQuery;

  const handleSearchChange = (value) => {
    if (!isControlledSearch) {
      setInternalSearchQuery(value);
    }
    setCurrentPage(1); // Reset to first page when search criteria change
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleClearSearch = () => {
    handleSearchChange('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Case-insensitive client-side search across title, description, and id
  const filteredRecords = useMemo(() => {
    const list = Array.isArray(records) ? records : [];
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return list;

    return list.filter((rec) => {
      const titleMatch = (rec.title || '').toLowerCase().includes(trimmed);
      const descMatch = (rec.description || '').toLowerCase().includes(trimmed);
      const idMatch = String(rec.id ?? '').toLowerCase().includes(trimmed);
      return titleMatch || descMatch || idMatch;
    });
  }, [records, searchQuery]);

  const originalRecords = Array.isArray(records) ? records : [];
  const showActions = Boolean(onEdit || onDelete);
  const isSearching = searchQuery.trim().length > 0;
  const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : null);

  // Pagination calculation
  const totalItems = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedRecords = useMemo(() => {
    if (!showPagination) return filteredRecords;
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredRecords.slice(startIndex, startIndex + pageSize);
  }, [filteredRecords, showPagination, safeCurrentPage, pageSize]);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Search Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={isLoading}
            placeholder="Search records by title, description, or ID..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          {searchQuery && !isLoading && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Counter badge / loading indicator */}
        <div className="text-xs text-slate-500 flex items-center">
          {isLoading ? (
            <LoadingSpinner size="sm" message="Fetching..." inline />
          ) : isSearching ? (
            <span>
              Showing <span className="font-semibold text-slate-700">{filteredRecords.length}</span> of {originalRecords.length} records
            </span>
          ) : (
            <span>
              Total records: <span className="font-semibold text-slate-700">{originalRecords.length}</span>
            </span>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider w-16">
                ID
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Description
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                Created At
              </th>
              {showActions && (
                <th scope="col" className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              /* Loading state */
              <tr>
                <td
                  colSpan={showActions ? 5 : 4}
                  className="px-6 py-12 text-center"
                >
                  <LoadingSpinner message={loadingMessage} size="md" />
                </td>
              </tr>
            ) : errorMessage ? (
              /* Error state */
              <tr>
                <td
                  colSpan={showActions ? 5 : 4}
                  className="px-6 py-12 text-center text-red-600"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-base font-semibold text-red-700">Failed to load records</p>
                    <p className="text-xs text-red-500 max-w-md">{errorMessage}</p>
                    {onRetry && (
                      <button
                        type="button"
                        onClick={onRetry}
                        className="mt-2 inline-flex items-center px-3.5 py-1.5 text-xs font-medium rounded text-white bg-red-600 hover:bg-red-500 transition shadow-sm"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : originalRecords.length === 0 ? (
              /* Empty state (no records in dataset) */
              <tr>
                <td
                  colSpan={showActions ? 5 : 4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="w-10 h-10 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-base font-medium text-slate-600">{emptyMessage}</p>
                    <p className="text-xs text-slate-400">Records added to the system will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              /* Search yielded no matches */
              <tr>
                <td
                  colSpan={showActions ? 5 : 4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="w-10 h-10 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-base font-medium text-slate-700">
                      No matching records found for "{searchQuery}"
                    </p>
                    <p className="text-xs text-slate-400">
                      Try checking for typos or searching for a different keyword.
                    </p>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                    >
                      Clear search
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              /* Populated records display */
              paginatedRecords.map((record, index) => {
                const rowKey = record.id ?? `record-${index}`;
                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs whitespace-nowrap">
                      #{record.id ?? '—'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-900 font-medium">
                      <div>{record.title || 'Untitled'}</div>
                      <div className="text-xs text-slate-500 sm:hidden mt-0.5 line-clamp-1">
                        {record.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 hidden sm:table-cell max-w-xs truncate">
                      {record.description ? (
                        <span title={record.description}>{record.description}</span>
                      ) : (
                        <span className="text-slate-400 italic">No description</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs hidden md:table-cell whitespace-nowrap">
                      {formatDate(record.created_at)}
                    </td>
                    {showActions && (
                      <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-2">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(record)}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(record)}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && !errorMessage && showPagination && filteredRecords.length > 0 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
