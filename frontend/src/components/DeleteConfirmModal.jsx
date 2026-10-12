import React, { useState } from 'react';

/**
 * DeleteConfirmModal component for explicit confirmation before deleting a record.
 * 
 * Props:
 * - isOpen: Boolean indicating whether modal is open
 * - record: Object representing the record to be deleted ({ id, title })
 * - onCancel: Callback when deletion is cancelled () => void
 * - onConfirmDelete: Callback to execute deletion (record) => Promise<void> | void
 * - isDeleting: Optional boolean indicating external deletion loading state
 * - deleteError: Optional string for displaying error message from server
 */
export default function DeleteConfirmModal({
  isOpen = true,
  record,
  onCancel,
  onConfirmDelete,
  isDeleting = false,
  deleteError = '',
}) {
  const [localDeleting, setLocalDeleting] = useState(false);
  const [localError, setLocalError] = useState('');

  if (!isOpen || !record) {
    return null;
  }

  const handleConfirm = async () => {
    setLocalError('');
    if (onConfirmDelete) {
      try {
        setLocalDeleting(true);
        await onConfirmDelete(record);
        if (onCancel) onCancel();
      } catch (err) {
        setLocalError(err?.message || 'Failed to delete record. Please try again.');
      } finally {
        setLocalDeleting(false);
      }
    }
  };

  const loading = isDeleting || localDeleting;
  const displayError = deleteError || localError;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-3.5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="delete-dialog-title" className="text-base font-semibold text-slate-800">
                Confirm Record Deletion
              </h3>
              <p id="delete-dialog-description" className="text-xs text-slate-500 mt-0.5">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>

          {/* Record Identity Highlight Box */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Selected Record
            </div>
            <div className="text-sm font-semibold text-slate-800 mt-0.5 truncate">
              {record.title || 'Untitled Record'}
            </div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">
              ID: #{record.id ?? '—'}
            </div>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mt-3.5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start space-x-2">
              <span className="font-bold">⚠</span>
              <span>{displayError}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            {loading && (
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            <span>{loading ? 'Deleting...' : 'Delete Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
