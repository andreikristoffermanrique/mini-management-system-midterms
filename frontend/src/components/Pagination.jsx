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
    <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
      {/* Information text */}
      <div className="text-slate-600 text-xs sm:text-sm flex items-center flex-wrap gap-1.5">
        <span>
          Showing <span className="font-semibold text-slate-800">{startIndex}</span>–<span className="font-semibold text-slate-800">{endIndex}</span> of <span className="font-semibold text-slate-800">{totalItems}</span> records
        </span>
        {totalPages > 1 && (
          <span className="px-2 py-0.5 text-xs bg-slate-200/70 text-slate-700 rounded-md font-medium">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            aria-label="Previous page"
          >
            <svg className="w-3.5 h-3.5 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {pages.map((p) => {
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange && onPageChange(p)}
                  className={`min-w-[32px] h-8 px-2 text-xs font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            aria-label="Next page"
          >
            Next
            <svg className="w-3.5 h-3.5 ml-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
