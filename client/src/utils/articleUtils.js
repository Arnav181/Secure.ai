/**
 * Article Utilities for Cybersecurity News
 * 
 * This module provides search, filtering, and processing functionality
 * for cybersecurity news articles.
 */

/**
 * Filters articles based on search query
 * Searches across article titles, descriptions, source names, and content
 * 
 * @param {string} query - The search query string
 * @param {Array} articles - Array of article objects to search through
 * @returns {Array} Filtered array of articles matching the search query
 */
export const searchArticles = (query, articles) => {
  // Return all articles if no query provided
  if (!query || !query.trim()) {
    return articles;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return articles.filter(article => {
    // Search in title
    const titleMatch = article.title && article.title.toLowerCase().includes(searchTerm);
    
    // Search in description
    const descriptionMatch = article.description && article.description.toLowerCase().includes(searchTerm);
    
    // Search in source name
    const sourceMatch = article.source && article.source.name && 
      article.source.name.toLowerCase().includes(searchTerm);
    
    // Search in content (if available)
    const contentMatch = article.content && article.content.toLowerCase().includes(searchTerm);
    
    // Search in author (if available)
    const authorMatch = article.author && article.author.toLowerCase().includes(searchTerm);
    
    // Return true if any field matches
    return titleMatch || descriptionMatch || sourceMatch || contentMatch || authorMatch;
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
  
  // Sort matches by start position and merge overlapping matches
  return mergeOverlappingMatches(matches.sort((a, b) => a.start - b.start));
};

/**
 * Merges overlapping or adjacent matches
 * @param {Array} matches - Array of match objects sorted by start position
 * @returns {Array} Array of merged match objects
 */
const mergeOverlappingMatches = (matches) => {
  if (matches.length <= 1) {
    return matches;
  }
  
  const merged = [matches[0]];
  
  for (let i = 1; i < matches.length; i++) {
    const current = matches[i];
    const last = merged[merged.length - 1];
    
    // If current match overlaps or is adjacent to the last merged match
    if (current.start <= last.end) {
      // Extend the last match to include the current match
      last.end = Math.max(last.end, current.end);
      last.term = last.term + ' ' + current.term; // Combine terms
    } else {
      // No overlap, add as new match
      merged.push(current);
    }
  }
  
  return merged;
};

/**
 * Highlights search terms in text by wrapping them with HTML tags
 * @param {string} text - The text to highlight
 * @param {string} query - The search query
 * @param {string} className - CSS class name for highlighting (default: 'highlight')
 * @returns {string} Text with highlighted search terms
 */
export const highlightSearchTerms = (text, query, className = 'highlight') => {
  if (!text || !query || !query.trim()) {
    return text;
  }
  
  const searchTerms = extractSearchTerms(query);
  const matches = findMatches(text, searchTerms);
  
  if (matches.length === 0) {
    return text;
  }
  
  let highlightedText = '';
  let lastIndex = 0;
  
  matches.forEach(match => {
    // Add text before the match
    highlightedText += text.substring(lastIndex, match.start);
    
    // Add highlighted match
    const matchedText = text.substring(match.start, match.end);
    highlightedText += `<span class="${className}">${matchedText}</span>`;
    
    lastIndex = match.end;
  });
  
  // Add remaining text after the last match
  highlightedText += text.substring(lastIndex);
  
  return highlightedText;
};

/**
 * Filters articles by source
 * @param {Array} articles - Array of article objects
 * @param {string} sourceName - Name of the source to filter by
 * @returns {Array} Filtered array of articles from the specified source
 */
export const filterBySource = (articles, sourceName) => {
  if (!sourceName || !sourceName.trim()) {
    return articles;
  }
  
  const sourceFilter = sourceName.toLowerCase().trim();
  
  return articles.filter(article => 
    article.source && 
    article.source.name && 
    article.source.name.toLowerCase().includes(sourceFilter)
  );
};

/**
 * Filters articles by date range
 * @param {Array} articles - Array of article objects
 * @param {Date} startDate - Start date for filtering (inclusive)
 * @param {Date} endDate - End date for filtering (inclusive)
 * @returns {Array} Filtered array of articles within the date range
 */
export const filterByDateRange = (articles, startDate, endDate) => {
  if (!startDate && !endDate) {
    return articles;
  }
  
  return articles.filter(article => {
    if (!article.publishedAt) {
      return false;
    }
    
    const articleDate = new Date(article.publishedAt);
    
    if (isNaN(articleDate.getTime())) {
      return false;
    }
    
    if (startDate && articleDate < startDate) {
      return false;
    }
    
    if (endDate && articleDate > endDate) {
      return false;
    }
    
    return true;
  });
};

/**
 * Removes duplicate articles based on URL
 * @param {Array} articles - Array of article objects
 * @returns {Array} Array of unique articles
 */
export const removeDuplicateArticles = (articles) => {
  if (!Array.isArray(articles)) {
    return [];
  }
  
  const seen = new Set();
  const unique = [];
  
  articles.forEach(article => {
    if (article.url && !seen.has(article.url)) {
      seen.add(article.url);
      unique.push(article);
    }
  });
  
  return unique;
};

/**
 * Validates search input to prevent potential security issues
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
    .replace(/['"]/g, '') // Remove quotes to prevent injection
    .trim()
    .substring(0, 200); // Limit length to prevent abuse
};

/**
 * Gets search statistics for display purposes
 * @param {Array} originalArticles - Original array of all articles
 * @param {Array} filteredArticles - Filtered array of articles
 * @param {string} query - The search query used
 * @returns {Object} Search statistics object
 */
export const getSearchStats = (originalArticles, filteredArticles, query) => {
  return {
    totalArticles: originalArticles.length,
    matchingArticles: filteredArticles.length,
    hasQuery: Boolean(query && query.trim()),
    query: query || '',
    percentage: originalArticles.length > 0 ? 
      Math.round((filteredArticles.length / originalArticles.length) * 100) : 0
  };
};

/**
 * Checks if an article is cybersecurity-related based on keywords
 * @param {Object} article - Article object to check
 * @returns {boolean} True if article appears to be cybersecurity-related
 */
export const isCybersecurityRelated = (article) => {
  if (!article) {
    return false;
  }
  
  const cybersecurityKeywords = [
    'cybersecurity', 'cyber security', 'cyber attack', 'cyber threat',
    'data breach', 'security breach', 'hack', 'hacker', 'hacking',
    'malware', 'ransomware', 'phishing', 'vulnerability', 'exploit',
    'information security', 'infosec', 'network security', 'endpoint security',
    'threat intelligence', 'incident response', 'security awareness',
    'penetration testing', 'ethical hacking', 'zero day', 'firewall',
    'encryption', 'authentication', 'authorization', 'privacy',
    'gdpr', 'compliance', 'risk assessment', 'security audit'
  ];
  
  const textToCheck = [
    article.title || '',
    article.description || '',
    article.content || ''
  ].join(' ').toLowerCase();
  
  return cybersecurityKeywords.some(keyword => 
    textToCheck.includes(keyword.toLowerCase())
  );
};

export default {
  searchArticles,
  extractSearchTerms,
  findMatches,
  highlightSearchTerms,
  filterBySource,
  filterByDateRange,
  removeDuplicateArticles,
  sanitizeSearchQuery,
  getSearchStats,
  isCybersecurityRelated
};