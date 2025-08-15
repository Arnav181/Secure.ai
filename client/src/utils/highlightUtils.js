/**
 * Text Highlighting Utilities
 * 
 * This module provides utilities for highlighting search matches within text content.
 * It includes functions for finding matches, creating highlighted segments, and
 * rendering highlighted text components.
 */

/**
 * Highlights search terms in text by wrapping matches with highlight markers
 * 
 * @param {string} text - The text to highlight
 * @param {Array|string} searchTerms - Search terms to highlight (array or single string)
 * @param {Object} options - Highlighting options
 * @returns {Array} Array of text segments with highlight information
 */
export const highlightText = (text, searchTerms, options = {}) => {
  const {
    caseSensitive = false,
    wholeWords = false,
    maxHighlights = 100
  } = options;

  if (!text || !searchTerms) {
    return [{ text, highlighted: false }];
  }

  // Normalize search terms to array
  const terms = Array.isArray(searchTerms) ? searchTerms : [searchTerms];
  
  // Filter out empty terms
  const validTerms = terms.filter(term => term && term.trim().length > 0);
  
  if (validTerms.length === 0) {
    return [{ text, highlighted: false }];
  }

  // Find all matches
  const matches = findAllMatches(text, validTerms, { caseSensitive, wholeWords });
  
  // Limit matches to prevent performance issues
  const limitedMatches = matches.slice(0, maxHighlights);
  
  // Create segments from matches
  return createTextSegments(text, limitedMatches);
};

/**
 * Finds all matches of search terms in text
 * 
 * @param {string} text - Text to search in
 * @param {Array} terms - Search terms
 * @param {Object} options - Search options
 * @returns {Array} Array of match objects
 */
const findAllMatches = (text, terms, options = {}) => {
  const { caseSensitive = false, wholeWords = false } = options;
  const matches = [];
  
  const searchText = caseSensitive ? text : text.toLowerCase();
  
  terms.forEach(term => {
    const searchTerm = caseSensitive ? term : term.toLowerCase();
    
    if (wholeWords) {
      // Use regex for whole word matching
      const regex = new RegExp(`\\b${escapeRegExp(searchTerm)}\\b`, caseSensitive ? 'g' : 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          term: searchTerm,
          originalTerm: term
        });
      }
    } else {
      // Simple substring matching
      let startIndex = 0;
      let matchIndex;
      
      while ((matchIndex = searchText.indexOf(searchTerm, startIndex)) !== -1) {
        matches.push({
          start: matchIndex,
          end: matchIndex + searchTerm.length,
          term: searchTerm,
          originalTerm: term
        });
        startIndex = matchIndex + 1;
      }
    }
  });
  
  // Sort matches by start position and remove overlaps
  return removeOverlappingMatches(matches.sort((a, b) => a.start - b.start));
};

/**
 * Removes overlapping matches, keeping the first occurrence
 * 
 * @param {Array} matches - Array of match objects
 * @returns {Array} Array of non-overlapping matches
 */
const removeOverlappingMatches = (matches) => {
  if (matches.length <= 1) return matches;
  
  const nonOverlapping = [matches[0]];
  
  for (let i = 1; i < matches.length; i++) {
    const current = matches[i];
    const last = nonOverlapping[nonOverlapping.length - 1];
    
    // Only add if it doesn't overlap with the last added match
    if (current.start >= last.end) {
      nonOverlapping.push(current);
    }
  }
  
  return nonOverlapping;
};

/**
 * Creates text segments from matches
 * 
 * @param {string} text - Original text
 * @param {Array} matches - Array of match objects
 * @returns {Array} Array of text segments
 */
const createTextSegments = (text, matches) => {
  if (matches.length === 0) {
    return [{ text, highlighted: false }];
  }
  
  const segments = [];
  let lastIndex = 0;
  
  matches.forEach(match => {
    // Add text before the match
    if (match.start > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.start),
        highlighted: false
      });
    }
    
    // Add the highlighted match
    segments.push({
      text: text.substring(match.start, match.end),
      highlighted: true,
      term: match.originalTerm
    });
    
    lastIndex = match.end;
  });
  
  // Add remaining text after the last match
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      highlighted: false
    });
  }
  
  return segments;
};

/**
 * Escapes special regex characters in a string
 * 
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Creates a summary of highlighting statistics
 * 
 * @param {Array} segments - Array of text segments
 * @param {Array} searchTerms - Original search terms
 * @returns {Object} Highlighting statistics
 */
export const getHighlightStats = (segments, searchTerms) => {
  const highlightedSegments = segments.filter(segment => segment.highlighted);
  const uniqueTerms = new Set(highlightedSegments.map(segment => segment.term));
  
  return {
    totalSegments: segments.length,
    highlightedSegments: highlightedSegments.length,
    uniqueHighlightedTerms: uniqueTerms.size,
    searchTermsFound: searchTerms.filter(term => 
      highlightedSegments.some(segment => 
        segment.term && segment.term.toLowerCase() === term.toLowerCase()
      )
    ).length,
    hasHighlights: highlightedSegments.length > 0
  };
};

/**
 * Truncates text around highlights for preview purposes
 * 
 * @param {string} text - Original text
 * @param {Array} searchTerms - Search terms
 * @param {Object} options - Truncation options
 * @returns {Object} Truncated text with highlights
 */
export const createHighlightPreview = (text, searchTerms, options = {}) => {
  const {
    maxLength = 200,
    contextLength = 50,
    separator = '...'
  } = options;
  
  if (!text || text.length <= maxLength) {
    return {
      text,
      segments: highlightText(text, searchTerms),
      truncated: false
    };
  }
  
  // Find first match
  const matches = findAllMatches(text, Array.isArray(searchTerms) ? searchTerms : [searchTerms]);
  
  if (matches.length === 0) {
    // No matches, return truncated text from beginning
    const truncated = text.substring(0, maxLength) + separator;
    return {
      text: truncated,
      segments: [{ text: truncated, highlighted: false }],
      truncated: true
    };
  }
  
  const firstMatch = matches[0];
  const start = Math.max(0, firstMatch.start - contextLength);
  const end = Math.min(text.length, firstMatch.end + contextLength);
  
  let preview = text.substring(start, end);
  
  // Add separators if truncated
  if (start > 0) preview = separator + preview;
  if (end < text.length) preview = preview + separator;
  
  return {
    text: preview,
    segments: highlightText(preview, searchTerms),
    truncated: true,
    originalLength: text.length,
    previewLength: preview.length
  };
};