/**
 * Helper Functions for Data Manipulation and Search
 * 
 * This file contains utility functions for searching, filtering, sorting,
 * and manipulating law data in the cybersecurity laws documentation system.
 */

/**
 * Searches laws based on a query string
 * @param {string} query - Search query
 * @param {Array} laws - Array of law objects
 * @returns {Array} - Filtered array of laws matching the query
 */
export const searchLaws = (query, laws) => {
  if (!query || typeof query !== 'string' || !Array.isArray(laws)) {
    return laws || [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  if (searchTerm === '') {
    return laws;
  }
  
  return laws.filter(law => {
    // Search in act name
    if (law.act && law.act.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in section
    if (law.section && law.section.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in theory content
    if (law.theory && law.theory.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in keywords
    if (law.keywords && Array.isArray(law.keywords)) {
      return law.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      );
    }
    
    // Search in category
    if (law.category && law.category.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    return false;
  });
};

/**
 * Highlights search terms in text
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Term to highlight
 * @returns {string} - Text with highlighted terms (HTML)
 */
export const highlightSearchTerm = (text, searchTerm) => {
  if (!text || !searchTerm || typeof text !== 'string' || typeof searchTerm !== 'string') {
    return text || '';
  }
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};

/**
 * Gets laws by category
 * @param {string} category - Category to filter by
 * @param {Array} laws - Array of law objects
 * @returns {Array} - Laws in the specified category
 */
export const getLawsByCategory = (category, laws) => {
  if (!category || !Array.isArray(laws)) {
    return [];
  }
  
  return laws.filter(law => 
    law.category && law.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Gets all unique categories from laws
 * @param {Array} laws - Array of law objects
 * @returns {Array} - Array of unique categories
 */
export const getUniqueCategories = (laws) => {
  if (!Array.isArray(laws)) {
    return [];
  }
  
  const categories = laws
    .filter(law => law.category)
    .map(law => law.category)
    .filter((category, index, arr) => arr.indexOf(category) === index);
  
  return categories.sort();
};

/**
 * Sorts laws by different criteria
 * @param {Array} laws - Array of law objects
 * @param {string} sortBy - Sort criteria ('act', 'section', 'lastUpdated', 'category')
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted array of laws
 */
export const sortLaws = (laws, sortBy = 'act', order = 'asc') => {
  if (!Array.isArray(laws)) {
    return [];
  }
  
  const sortedLaws = [...laws];
  
  sortedLaws.sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'act':
        valueA = a.act || '';
        valueB = b.act || '';
        break;
      case 'section':
        valueA = a.section || '';
        valueB = b.section || '';
        break;
      case 'lastUpdated':
        valueA = a.lastUpdated || new Date(0);
        valueB = b.lastUpdated || new Date(0);
        break;
      case 'category':
        valueA = a.category || '';
        valueB = b.category || '';
        break;
      default:
        valueA = a.act || '';
        valueB = b.act || '';
    }
    
    if (sortBy === 'lastUpdated') {
      // Handle date comparison
      const comparison = valueA.getTime() - valueB.getTime();
      return order === 'asc' ? comparison : -comparison;
    } else {
      // Handle string comparison
      const comparison = valueA.localeCompare(valueB);
      return order === 'asc' ? comparison : -comparison;
    }
  });
  
  return sortedLaws;
};

/**
 * Gets a law by its ID
 * @param {string} id - Law ID to search for
 * @param {Array} laws - Array of law objects
 * @returns {Object|null} - Law object or null if not found
 */
export const getLawById = (id, laws) => {
  if (!id || !Array.isArray(laws)) {
    return null;
  }
  
  return laws.find(law => law.id === id) || null;
};

/**
 * Gets related laws based on related sections
 * @param {Object} law - Law object to find related laws for
 * @param {Array} laws - Array of all law objects
 * @returns {Array} - Array of related law objects
 */
export const getRelatedLaws = (law, laws) => {
  if (!law || !law.relatedSections || !Array.isArray(laws)) {
    return [];
  }
  
  return laws.filter(otherLaw => 
    law.relatedSections.some(relatedSection => 
      otherLaw.section && otherLaw.section.includes(relatedSection)
    ) && otherLaw.id !== law.id
  );
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Creates a debounced search function
 * @param {Function} searchCallback - Callback function to execute search
 * @param {number} delay - Debounce delay in milliseconds (default: 300)
 * @returns {Function} - Debounced search function
 */
export const createDebouncedSearch = (searchCallback, delay = 300) => {
  return debounce((query, laws) => {
    const results = searchLaws(query, laws);
    searchCallback(results, query);
  }, delay);
};

/**
 * Filters laws by multiple criteria
 * @param {Array} laws - Array of law objects
 * @param {Object} filters - Filter criteria object
 * @param {string} [filters.category] - Category filter
 * @param {string} [filters.act] - Act filter
 * @param {Date} [filters.dateFrom] - Date from filter
 * @param {Date} [filters.dateTo] - Date to filter
 * @returns {Array} - Filtered laws
 */
export const filterLaws = (laws, filters = {}) => {
  if (!Array.isArray(laws)) {
    return [];
  }
  
  let filteredLaws = [...laws];
  
  // Filter by category
  if (filters.category) {
    filteredLaws = filteredLaws.filter(law => 
      law.category && law.category.toLowerCase() === filters.category.toLowerCase()
    );
  }
  
  // Filter by act
  if (filters.act) {
    filteredLaws = filteredLaws.filter(law => 
      law.act && law.act.toLowerCase().includes(filters.act.toLowerCase())
    );
  }
  
  // Filter by date range
  if (filters.dateFrom) {
    filteredLaws = filteredLaws.filter(law => 
      law.lastUpdated && law.lastUpdated >= filters.dateFrom
    );
  }
  
  if (filters.dateTo) {
    filteredLaws = filteredLaws.filter(law => 
      law.lastUpdated && law.lastUpdated <= filters.dateTo
    );
  }
  
  return filteredLaws;
};

/**
 * Gets search statistics
 * @param {string} query - Search query
 * @param {Array} originalLaws - Original laws array
 * @param {Array} filteredLaws - Filtered laws array
 * @returns {Object} - Search statistics
 */
export const getSearchStats = (query, originalLaws, filteredLaws) => {
  return {
    query: query || '',
    totalLaws: Array.isArray(originalLaws) ? originalLaws.length : 0,
    matchingLaws: Array.isArray(filteredLaws) ? filteredLaws.length : 0,
    hasResults: Array.isArray(filteredLaws) && filteredLaws.length > 0,
    isEmpty: !query || query.trim() === ''
  };
};

export default {
  searchLaws,
  highlightSearchTerm,
  getLawsByCategory,
  getUniqueCategories,
  sortLaws,
  getLawById,
  getRelatedLaws,
  debounce,
  createDebouncedSearch,
  filterLaws,
  getSearchStats
};