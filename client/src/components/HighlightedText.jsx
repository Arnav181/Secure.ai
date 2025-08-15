import React from 'react';
import { highlightText } from '../utils/highlightUtils';

/**
 * HighlightedText Component
 * 
 * Renders text with highlighted search matches. Supports multiple search terms
 * and customizable highlight styling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - Text to render with highlights
 * @param {Array|string} props.searchTerms - Search terms to highlight
 * @param {string} props.className - Additional CSS classes for the container
 * @param {string} props.highlightClassName - CSS classes for highlighted text
 * @param {Object} props.highlightStyle - Inline styles for highlighted text
 * @param {boolean} props.caseSensitive - Whether highlighting should be case sensitive
 * @param {boolean} props.wholeWords - Whether to match whole words only
 * @param {number} props.maxHighlights - Maximum number of highlights to show
 */
const HighlightedText = ({
  text,
  searchTerms,
  className = '',
  highlightClassName = 'bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded font-medium',
  highlightStyle = {},
  caseSensitive = false,
  wholeWords = false,
  maxHighlights = 100,
  ...props
}) => {
  // Return plain text if no search terms provided
  if (!searchTerms || (Array.isArray(searchTerms) && searchTerms.length === 0)) {
    return (
      <span className={className} {...props}>
        {text}
      </span>
    );
  }

  // Get highlighted segments
  const segments = highlightText(text, searchTerms, {
    caseSensitive,
    wholeWords,
    maxHighlights
  });

  return (
    <span className={className} {...props}>
      {segments.map((segment, index) => {
        if (segment.highlighted) {
          return (
            <mark
              key={index}
              className={highlightClassName}
              style={highlightStyle}
              data-term={segment.term}
            >
              {segment.text}
            </mark>
          );
        }
        return segment.text;
      })}
    </span>
  );
};

/**
 * HighlightedTextPreview Component
 * 
 * Renders a truncated preview of text with highlights, useful for search results
 * where you want to show context around matches.
 */
export const HighlightedTextPreview = ({
  text,
  searchTerms,
  maxLength = 200,
  contextLength = 50,
  className = '',
  highlightClassName = 'bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded font-medium',
  showTruncationInfo = false,
  ...props
}) => {
  if (!text) {
    return null;
  }

  // For short text, use regular HighlightedText
  if (text.length <= maxLength) {
    return (
      <HighlightedText
        text={text}
        searchTerms={searchTerms}
        className={className}
        highlightClassName={highlightClassName}
        {...props}
      />
    );
  }

  // Create preview with context around first match
  const segments = highlightText(text, searchTerms);
  const firstHighlight = segments.findIndex(segment => segment.highlighted);
  
  if (firstHighlight === -1) {
    // No highlights found, show beginning of text
    const truncated = text.substring(0, maxLength) + '...';
    return (
      <span className={className} {...props}>
        {truncated}
        {showTruncationInfo && (
          <span className="text-xs text-gray-500 ml-2">
            (showing first {maxLength} of {text.length} characters)
          </span>
        )}
      </span>
    );
  }

  // Calculate preview boundaries around first highlight
  let previewStart = 0;
  let segmentStart = 0;
  
  // Find the character position of the first highlight
  for (let i = 0; i < firstHighlight; i++) {
    segmentStart += segments[i].text.length;
  }
  
  previewStart = Math.max(0, segmentStart - contextLength);
  const previewEnd = Math.min(text.length, segmentStart + segments[firstHighlight].text.length + contextLength);
  
  let previewText = text.substring(previewStart, previewEnd);
  
  // Add ellipsis if truncated
  if (previewStart > 0) previewText = '...' + previewText;
  if (previewEnd < text.length) previewText = previewText + '...';
  
  return (
    <span className={className} {...props}>
      <HighlightedText
        text={previewText}
        searchTerms={searchTerms}
        highlightClassName={highlightClassName}
      />
      {showTruncationInfo && (
        <span className="text-xs text-gray-500 ml-2">
          (preview of {text.length} characters)
        </span>
      )}
    </span>
  );
};

/**
 * SearchResultHighlight Component
 * 
 * Specialized component for search results with consistent styling
 */
export const SearchResultHighlight = ({
  text,
  searchTerms,
  className = 'text-gray-700',
  ...props
}) => {
  return (
    <HighlightedText
      text={text}
      searchTerms={searchTerms}
      className={className}
      highlightClassName="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold border border-blue-200"
      {...props}
    />
  );
};

export default HighlightedText;