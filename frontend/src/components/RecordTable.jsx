import React from 'react';

/**
 * RecordTable component for displaying records in a structured, responsive table.
 * 
 * Props:
 * - records: Array of record objects ({ id, title, description, created_at, user_id })
 * - onEdit: Optional callback function invoked when Edit action is clicked (record) => void
 * - onDelete: Optional callback function invoked when Delete action is clicked (record) => void
 * - emptyMessage: Optional custom empty state message
 */
export default function RecordTable({
  records = [],
  onEdit,
  onDelete,
  emptyMessage = 'No records available.',
}) {
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

  const hasRecords = Array.isArray(records) && records.length > 0;
  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
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
            {!hasRecords ? (
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
            ) : (
              records.map((record, index) => {
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
                      {/* Mobile fallback for description */}
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
    </div>
  );
}
