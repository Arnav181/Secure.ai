import React from 'react';
import PropTypes from 'prop-types';

/**
 * LawCard Component - Displays individual law information in a card format
 * 
 * @param {Object} props - Component props
 * @param {Object} props.law - Law object containing act, section, theory, etc.
 * @param {string} [props.searchQuery] - Optional search query for highlighting
 * @param {string} [props.className] - Additional CSS classes
 */
const LawCard = ({ law, searchQuery = '', className = '' }) => {
  const { act, section, theory, category, lastUpdated } = law;

  // Helper function to highlight search terms in text
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400/20 text-yellow-300 px-1 rounded border border-yellow-400/30">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`bg-slate-700/50 rounded-lg shadow-md border border-slate-600 p-6 mb-4 hover:shadow-lg hover:bg-slate-700/70 transition-all duration-200 ${className}`}>
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-slate-100 leading-tight">
            {highlightText(act, searchQuery)}
          </h3>
          {category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-500/30 self-start sm:self-center">
              {category}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-blue-400">
            {highlightText(section, searchQuery)}
          </h4>
          {lastUpdated && (
            <span className="text-xs text-slate-400">
              Updated: {new Date(lastUpdated).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Theory Content */}
      <div className="mb-4">
        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
          {highlightText(theory, searchQuery)}
        </p>
      </div>

      {/* Footer with additional info */}
      <div className="pt-4 border-t border-slate-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-slate-500">
            ID: {law.id}
          </div>
          {law.relatedSections && law.relatedSections.length > 0 && (
            <div className="text-xs text-slate-500">
              Related: {law.relatedSections.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

LawCard.propTypes = {
  law: PropTypes.shape({
    id: PropTypes.string.isRequired,
    act: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    theory: PropTypes.string.isRequired,
    category: PropTypes.string,
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    relatedSections: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  searchQuery: PropTypes.string,
  className: PropTypes.string
};

export default LawCard;