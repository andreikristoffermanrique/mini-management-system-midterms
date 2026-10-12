import React, { useState } from 'react';

/**
 * Internal form component keyed by record.id so state automatically resets
 * whenever a different record is selected without needing useEffect.
 */
function EditRecordFormContent({
  record,
  onClose,
  onUpdateRecord,
  isUpdating = false,
  serverError = '',
}) {
  const [title, setTitle] = useState(record?.title || '');
  const [description, setDescription] = useState(record?.description || '');
  const [errors, setErrors] = useState({});
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    } else if (title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const updatedData = {
      id: record.id,
      title: title.trim(),
      description: description.trim(),
    };

    if (onUpdateRecord) {
      try {
        setLocalSubmitting(true);
        await onUpdateRecord(updatedData);
        if (onClose) onClose();
      } catch (err) {
        setLocalError(err?.message || 'Failed to update record');
      } finally {
        setLocalSubmitting(false);
      }
    }
  };

  const loading = isUpdating || localSubmitting;
  const displayError = serverError || localError;

  return (
    <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
      {displayError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {displayError}
        </div>
      )}

      <div>
        <label htmlFor="edit-record-title" className="block text-sm font-medium text-slate-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="edit-record-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          disabled={loading}
          placeholder="Enter record title"
          className={`w-full px-3 py-2 border rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:bg-slate-100 ${
            errors.title ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="edit-record-description" className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          id="edit-record-description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          placeholder="Enter optional description..."
          className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:bg-slate-100"
        />
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded transition disabled:opacity-50 flex items-center space-x-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
}

/**
 * EditRecordModal component for editing an existing record.
 * 
 * Props:
 * - isOpen: Boolean indicating whether modal is visible
 * - record: Object representing the record being edited ({ id, title, description })
 * - onClose: Callback invoked when modal is closed/cancelled () => void
 * - onUpdateRecord: Callback invoked on form submission (updatedData: { id, title, description }) => Promise<void> | void
 * - isUpdating: Optional boolean indicating external loading state
 * - serverError: Optional string for displaying API/server errors
 */
export default function EditRecordModal({
  isOpen = true,
  record,
  onClose,
  onUpdateRecord,
  isUpdating = false,
  serverError = '',
}) {
  if (!isOpen || !record) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 id="edit-modal-title" className="text-lg font-semibold text-slate-800">
              Edit Record
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Record #{record.id ?? '—'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md text-sm transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <EditRecordFormContent
          key={record.id ?? 'edit-form'}
          record={record}
          onClose={onClose}
          onUpdateRecord={onUpdateRecord}
          isUpdating={isUpdating}
          serverError={serverError}
        />
      </div>
    </div>
  );
}
