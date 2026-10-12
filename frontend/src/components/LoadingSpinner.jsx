import React from 'react';

/**
 * Reusable LoadingSpinner component.
 * 
 * Props:
 * - message: Optional text message displayed below or beside the spinner (default: 'Loading...')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - inline: Boolean indicating whether to render inline or centered block (default: false)
 */
export default function LoadingSpinner({
  message = 'Loading...',
  size = 'md',
  inline = false,
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  if (inline) {
    return (
      <span className="inline-flex items-center space-x-2 text-slate-500 text-sm" role="status" aria-live="polite">
        <svg
          className={`animate-spin ${spinnerSize} text-indigo-600`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        {message && <span>{message}</span>}
      </span>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center p-8 space-y-3"
      role="status"
      aria-live="polite"
    >
      <svg
        className={`animate-spin ${spinnerSize} text-indigo-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {message && (
        <p className="text-sm font-medium text-slate-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
