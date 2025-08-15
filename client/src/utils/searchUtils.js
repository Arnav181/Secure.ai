/**
 * Search Utilities for Laws Documentation
 * 
 * This module provides search and filtering functionality for cybersecurity laws.
 * It includes functions for filtering laws by various criteria and preparing
 * search results with highlighted matches.
 */

/**
 * Filters laws based on search query
 * Searches across act names, section numbers, theory content, and keywords
 * 
 * @param {string} query - The search query string
 * @param {Array} laws - Array of law objects to search through
 * @returns {Array} Filtered array of laws matching the search query
 */
export const searchLaws = (query, laws) => {
  // Return all laws if no query provided
  if (!query || !query.trim()) {
    return laws;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return laws.filter(law => {
    // Search in act name
    const actMatch = law.act.toLowerCase().includes(searchTerm);
    
    // Search in section
    const sectionMatch = law.section.toLowerCase().includes(searchTerm);
    
    // Search in theory content
    const theoryMatch = law.theory.toLowerCase().includes(searchTerm);
    
    // Search in keywords
    const keywordMatch = law.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm)
    );
    
    // Search in category (if exists)
    const categoryMatch = law.category ? 
      law.category.toLowerCase().includes(searchTerm) : false;
    
    // Return true if any field matches
    return actMatch || sectionMatch || theoryMatch || keywordMatch || categoryMatch;
  });
};

/**
 * Extracts search terms from a query string
 * Splits by spaces and filters out empty strings
 * 
 * @param {string} query - The search query string
 * @returns {Array} Array of individual search terms
 */
export const extractSearchTerms = (query) => {
  if (!query || !query.trim()) {
    return [];
  }
  
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0);
};

/**
 * Finds all matches of search terms in a text string
 * Returns an array of match objects with start/end positions
 * 
 * @param {string} text - The text to search in
 * @param {Array} searchTerms - Array of search terms to find
 * @returns {Array} Array of match objects with {start, end, term} properties
 */
export const findMatches = (text, searchTerms) => {
  if (!text || !searchTerms || searchTerms.length === 0) {
    return [];
  }
  
  const matches = [];
  const lowerText = text.toLowerCase();
  
  searchTerms.forEach(term => {
    let startIndex = 0;
    let matchIndex;
    
    while ((matchIndex = lowerText.indexOf(term, startIndex)) !== -1) {
      matches.push({
        start: matchIndex,
        end: matchIndex + term.length,
        term: term
      });
      startIndex = matchIndex + 1;
    }
  });
  
  // Sort matches by start position
  return matches.sort((a, b) => a.start - b.start);
};

/**
 * Validates search input to prevent potential security issues
 * 
 * @param {string} query - The search query to validate
 * @returns {string} Sanitized search query
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  // Remove potentially harmful characters while preserving useful search characters
  return query
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/[{}]/g, '') // Remove curly braces
    .replace(/[\[\]]/g, '') // Remove square brackets
    .trim()
    .substring(0, 200); // Limit length to prevent abuse
};

/**
 * Debounce function to limit the frequency of function calls
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Gets search statistics for display purposes
 * 
 * @param {Array} originalLaws - Original array of all laws
 * @param {Array} filteredLaws - Filtered array of laws
 * @param {string} query - The search query used
 * @returns {Object} Search statistics object
 */
export const getSearchStats = (originalLaws, filteredLaws, query) => {
  return {
    totalLaws: originalLaws.length,
    matchingLaws: filteredLaws.length,
    hasQuery: Boolean(query && query.trim()),
    query: query || '',
    percentage: originalLaws.length > 0 ? 
      Math.round((filteredLaws.length / originalLaws.length) * 100) : 0
  };
};