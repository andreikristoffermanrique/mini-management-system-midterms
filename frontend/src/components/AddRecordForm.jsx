import React, { useState } from 'react';

/**
 * AddRecordForm component for creating a new record.
 * 
 * Props:
 * - onSubmitRecord: Callback function (data: { title, description }) => Promise<void> | void
 * - isSubmitting: Optional boolean indicating external submission state
 * - serverError: Optional string for displaying API/server errors
 * - onCancel: Optional callback when user cancels the form
 */
export default function AddRecordForm({
  onSubmitRecord,
  isSubmitting = false,
  serverError = '',
  onCancel,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage('');
    setLocalError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const recordData = {
      title: title.trim(),
      description: description.trim(),
    };

    if (onSubmitRecord) {
      try {
        setLocalSubmitting(true);
        await onSubmitRecord(recordData);
        setTitle('');
        setDescription('');
        setSuccessMessage('Record added successfully!');
      } catch (err) {
        setLocalError(err?.message || 'Failed to add record');
      } finally {
        setLocalSubmitting(false);
      }
    }
  };

  const loading = isSubmitting || localSubmitting;
  const displayError = serverError || localError;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Add New Record</h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      {displayError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {displayError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="record-title" className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="record-title"
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
          <label htmlFor="record-description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="record-description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Enter optional description..."
            className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:bg-slate-100"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition"
            >
              Cancel
            </button>
          )}
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
            <span>{loading ? 'Adding...' : 'Add Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
