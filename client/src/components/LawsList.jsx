import React from 'react';
import PropTypes from 'prop-types';
import LawCard from './LawCard';

/**
 * LawsList Component - Displays a collection of law cards with loading and empty states
 * 
 * @param {Object} props - Component props
 * @param {Array} props.laws - Array of law objects to display
 * @param {boolean} [props.isLoading] - Loading state indicator
 * @param {string} [props.searchQuery] - Search query for highlighting in cards
 * @param {string} [props.emptyMessage] - Custom message for empty state
 * @param {string} [props.className] - Additional CSS classes
 */
const LawsList = ({ 
  laws = [], 
  isLoading = false, 
  searchQuery = '', 
  emptyMessage = 'No laws found',
  className = '' 
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Loading skeleton cards */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg shadow-md border border-slate-600 p-6 animate-pulse">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="h-6 bg-slate-600 rounded w-3/4"></div>
                <div className="h-5 bg-slate-600 rounded-full w-20"></div>
              </div>
              <div className="h-5 bg-slate-600 rounded w-1/3"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-slate-600 rounded w-full"></div>
              <div className="h-4 bg-slate-600 rounded w-full"></div>
              <div className="h-4 bg-slate-600 rounded w-3/4"></div>
            </div>
            <div className="pt-4 border-t border-slate-600">
              <div className="flex justify-between">
                <div className="h-3 bg-slate-600 rounded w-20"></div>
                <div className="h-3 bg-slate-600 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!laws || laws.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
        <div className="text-center">
          {/* Empty state icon */}
          <svg 
            className="mx-auto h-16 w-16 text-slate-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          
          <h3 className="text-lg font-medium text-slate-200 mb-2">
            {emptyMessage}
          </h3>
          
          {searchQuery && (
            <p className="text-slate-400 text-sm mb-4">
              No laws match your search for "{searchQuery}". Try adjusting your search terms.
            </p>
          )}
          
          {!searchQuery && (
            <p className="text-slate-400 text-sm">
              Laws will appear here once they are loaded.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Main laws list display
  return (
    <div className={`${className}`}>
      {/* Results count */}
      <div className="mb-4 text-sm text-slate-400">
        {searchQuery ? (
          <span>
            Found {laws.length} law{laws.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </span>
        ) : (
          <span>
            Showing {laws.length} law{laws.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Scrollable laws container */}
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-none">
        {laws.map((law) => (
          <LawCard 
            key={law.id} 
            law={law} 
            searchQuery={searchQuery}
            className="transition-all duration-200 hover:scale-[1.01]"
          />
        ))}
      </div>

      {/* Bottom spacing for better UX */}
      <div className="h-4"></div>
    </div>
  );
};

LawsList.propTypes = {
  laws: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      act: PropTypes.string.isRequired,
      section: PropTypes.string.isRequired,
      theory: PropTypes.string.isRequired,
      category: PropTypes.string,
      lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      relatedSections: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  isLoading: PropTypes.bool,
  searchQuery: PropTypes.string,
  emptyMessage: PropTypes.string,
  className: PropTypes.string
};

export default LawsList;