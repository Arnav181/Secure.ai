import { useState, useCallback, useMemo } from 'react';
import { filterArticlesByQuery } from '../utils/newsSearchUtils';

/**
 * Custom hook for managing news search functionality
 * 
 * Provides search state management and filtering logic for news articles
 * 
 * @param {Array} articles - Array of news article objects to search through
 * @param {Object} options - Configuration options
 * @returns {Object} Search state and functions
 */
const useNewsSearch = (articles = [], options = {}) => {
  const {
    initialQuery = '',
    minQueryLength = 0
  } = options;

  // Search state
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    // Don't filter if query is too short
    if (query.length < minQueryLength) {
      return articles;
    }

    setIsSearching(true);
    const results = filterArticlesByQuery(articles, query);
    setIsSearching(false);
    
    return results;
  }, [query, articles, minQueryLength]);

  // Get search statistics
  const searchStats = useMemo(() => {
    return {
      totalArticles: articles.length,
      filteredArticles: filteredArticles.length,
      hasResults: filteredArticles.length > 0,
      hasQuery: query.length >= minQueryLength,
      isFiltered: filteredArticles.length !== articles.length
    };
  }, [articles, filteredArticles, query, minQueryLength]);

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
    return query.length >= minQueryLength && query.trim() !== '';
  }, [query, minQueryLength]);

  return {
    // State
    query,
    isSearching,
    hasActiveSearch,
    
    // Results
    filteredArticles,
    searchStats,
    
    // Actions
    handleSearch,
    clearSearch,
    setQuery
  };
};

export default useNewsSearch;
