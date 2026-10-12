import React from 'react';

/**
 * Reusable Pagination component.
 * 
 * Props:
 * - currentPage: Current active page number (1-indexed)
 * - totalPages: Total number of pages
 * - totalItems: Total number of records across all pages
 * - pageSize: Number of items per page
 * - onPageChange: Callback invoked when page changes (newPage: number) => void
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 5,
  onPageChange,
}) {
  if (totalItems <= 0) return null;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with windowing
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
      {/* Information */}
      <div className="text-slate-600 text-xs sm:text-sm">
        Showing <span className="font-semibold text-slate-800">{startIndex}</span> to{' '}
        <span className="font-semibold text-slate-800">{endIndex}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> records
        {totalPages > 1 && (
          <span className="text-slate-400 ml-1.5 font-normal">
            (Page {currentPage} of {totalPages})
          </span>
        )}
      </div>

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="inline-flex items-center -space-x-px rounded-md shadow-sm">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Previous page"
          >
            Previous
          </button>

          {/* Page numbers */}
          {pages.map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange && onPageChange(p)}
                className={`px-3 py-1.5 text-xs font-medium border border-slate-300 transition ${
                  isActive
                    ? 'z-10 bg-indigo-600 text-white border-indigo-600 font-semibold'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-r-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
