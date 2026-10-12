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
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.md;

  if (inline) {
    return (
      <span className="inline-flex items-center space-x-2 text-slate-500 text-xs font-medium" role="status" aria-live="polite">
        <svg
          className={`animate-spin ${spinnerClass} text-indigo-600 flex-shrink-0`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        {message && <span>{message}</span>}
      </span>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center py-10 px-4 space-y-3"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        <svg
          className={`animate-spin ${spinnerClass} text-indigo-600`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
      {message && (
        <p className="text-xs font-medium text-slate-600 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}
