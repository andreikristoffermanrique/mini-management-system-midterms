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
        setSuccessMessage('Record created successfully!');
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Create New Record</h3>
            <p className="text-xs text-slate-500">Provide record details to register in the system</p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Error Feedback */}
        {displayError && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start space-x-2.5">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="flex-1 font-medium">{displayError}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-start space-x-2.5">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="flex-1 font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="record-title" className="block text-sm font-medium text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-normal">Min 2 characters</span>
            </div>
            <input
              id="record-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                if (successMessage) setSuccessMessage('');
              }}
              disabled={loading}
              placeholder="e.g., Annual Quarterly Inventory"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition disabled:bg-slate-50 disabled:text-slate-400 ${
                errors.title ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center space-x-1">
                <span>⚠</span>
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="record-description" className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </div>
            <textarea
              id="record-description"
              rows="3"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (successMessage) setSuccessMessage('');
              }}
              disabled={loading}
              placeholder="Brief details or remarks regarding this record..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-50 flex items-center space-x-2 active:scale-[0.99]"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              <span>{loading ? 'Adding...' : 'Add Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
