import { useState, useCallback, useMemo } from 'react';
import { searchLaws, sanitizeSearchQuery, getSearchStats } from '../utils/searchUtils';

/**
 * Custom hook for managing search functionality
 * 
 * Provides search state management, filtering logic, and search statistics
 * for the laws documentation system.
 * 
 * @param {Array} laws - Array of law objects to search through
 * @param {Object} options - Configuration options
 * @returns {Object} Search state and functions
 */
const useSearch = (laws = [], options = {}) => {
  const {
    initialQuery = '',
    caseSensitive = false,
    minQueryLength = 0
  } = options;

  // Search state
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Sanitize and process the search query
  const sanitizedQuery = useMemo(() => {
    return sanitizeSearchQuery(query);
  }, [query]);

  // Filter laws based on search query
  const filteredLaws = useMemo(() => {
    // Don't filter if query is too short
    if (sanitizedQuery.length < minQueryLength) {
      return laws;
    }

    setIsSearching(true);
    const results = searchLaws(sanitizedQuery, laws);
    setIsSearching(false);
    
    return results;
  }, [sanitizedQuery, laws, minQueryLength]);

  // Get search statistics
  const searchStats = useMemo(() => {
    return getSearchStats(laws, filteredLaws, sanitizedQuery);
  }, [laws, filteredLaws, sanitizedQuery]);

  // Handle search query change
  const handleSearch = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  // Check if search is active
  const hasActiveSearch = useMemo(() => {
    return sanitizedQuery.length >= minQueryLength && sanitizedQuery.trim() !== '';
  }, [sanitizedQuery, minQueryLength]);

  // Get highlighted search terms
  const searchTerms = useMemo(() => {
    if (!hasActiveSearch) return [];
    
    return sanitizedQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 0);
  }, [sanitizedQuery, hasActiveSearch]);

  return {
    // State
    query,
    sanitizedQuery,
    isSearching,
    hasActiveSearch,
    
    // Results
    filteredLaws,
    searchStats,
    searchTerms,
    
    // Actions
    handleSearch,
    clearSearch,
    setQuery
  };
};

export default useSearch;