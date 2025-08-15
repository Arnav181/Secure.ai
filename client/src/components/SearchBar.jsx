import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * SearchBar Component with real-time filtering and debounced search
 * 
 * Features:
 * - Controlled input component with debounced search
 * - Real-time filtering of laws by act, section, and theory
 * - Clear search functionality
 * - Responsive design with proper styling
 */
const SearchBar = ({ 
  onSearch, 
  placeholder = "Search cybersecurity laws...", 
  debounceMs = 300,
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    onSearch('');
  }, [onSearch]);

  // Handle form submission (prevent page reload)
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    // Immediately trigger search on form submit
    setDebouncedQuery(searchQuery);
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-slate-600 rounded-lg 
                     bg-slate-700 text-white placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     hover:border-slate-500 transition-colors duration-200
                     text-sm sm:text-base"
          aria-label="Search cybersecurity laws"
          autoComplete="off"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                       text-slate-400 hover:text-slate-300 transition-colors duration-200"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </form>

      {/* Search Status Indicator */}
      {searchQuery !== debouncedQuery && (
        <div className="absolute top-full left-0 mt-1 text-xs text-slate-400">
          Searching...
        </div>
      )}
    </div>
  );
};

export default SearchBar;