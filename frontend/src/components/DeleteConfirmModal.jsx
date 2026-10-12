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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
        {/* Header / Warning Icon */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 id="delete-dialog-title" className="text-lg font-semibold text-slate-800">
                Delete Record
              </h3>
              <p id="delete-dialog-description" className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-800">
                  "{record.title || `Record #${record.id}`}"
                </span>
                {record.id !== undefined && (
                  <span className="text-xs text-slate-400 font-mono ml-1">
                    (#{record.id})
                  </span>
                )}
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          {displayError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {displayError}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded transition disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            <span>{loading ? 'Deleting...' : 'Delete Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
