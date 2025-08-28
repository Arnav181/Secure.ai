/**
 * Data Validation Utilities for News Articles
 * 
 * This file contains validation functions to ensure article data integrity
 * and proper structure validation for the cybersecurity news system.
 */

/**
 * Validates if a value is a non-empty string
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid string
 */
const isValidString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validates if a value is a valid URL
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid URL
 */
const isValidUrl = (value) => {
  if (!isValidString(value)) return false;
  
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates if a value is a valid ISO date string
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid date string
 */
const isValidDateString = (value) => {
  if (!isValidString(value)) return false;
  
  const date = new Date(value);
  return !isNaN(date.getTime());
};

/**
 * Validates a single article entry structure
 * @param {Object} article - Article object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateArticle = (article) => {
  const errors = [];
  
  // Check if article is an object
  if (!article || typeof article !== 'object') {
    return {
      isValid: false,
      errors: ['Article must be a valid object']
    };
  }
  
  // Required field validations
  if (!isValidString(article.title)) {
    errors.push('Article title must be a non-empty string');
  }
  
  if (!isValidString(article.description)) {
    errors.push('Article description must be a non-empty string');
  }
  
  if (!isValidUrl(article.url)) {
    errors.push('Article URL must be a valid HTTP/HTTPS URL');
  }
  
  if (!isValidDateString(article.publishedAt)) {
    errors.push('Published date must be a valid ISO date string');
  }
  
  if (!article.source || !isValidString(article.source.name)) {
    errors.push('Article source must have a valid name');
  }
  
  // Optional field validations
  if (article.urlToImage !== null && article.urlToImage !== undefined && !isValidUrl(article.urlToImage)) {
    errors.push('Article image URL must be a valid HTTP/HTTPS URL if provided');
  }
  
  if (article.content !== undefined && article.content !== null && !isValidString(article.content)) {
    errors.push('Article content must be a non-empty string if provided');
  }
  
  if (article.author !== undefined && article.author !== null && !isValidString(article.author)) {
    errors.push('Article author must be a non-empty string if provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates an array of article entries
 * @param {Array} articles - Array of article objects to validate
 * @returns {Object} - Validation result with isValid boolean, validArticles array, and errors array
 */
export const validateArticlesArray = (articles) => {
  if (!Array.isArray(articles)) {
    return {
      isValid: false,
      validArticles: [],
      errors: ['Articles data must be an array']
    };
  }
  
  const validArticles = [];
  const errors = [];
  const usedUrls = new Set();
  
  articles.forEach((article, index) => {
    const validation = validateArticle(article);
    
    if (validation.isValid) {
      // Check for duplicate URLs (articles)
      if (usedUrls.has(article.url)) {
        errors.push(`Duplicate article URL "${article.url}" found at index ${index}`);
      } else {
        usedUrls.add(article.url);
        validArticles.push(article);
      }
    } else {
      errors.push(`Article at index ${index}: ${validation.errors.join(', ')}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    validArticles,
    errors
  };
};

/**
 * Sanitizes article data by removing potentially harmful content
 * @param {Object} article - Article object to sanitize
 * @returns {Object} - Sanitized article object
 */
export const sanitizeArticle = (article) => {
  if (!article || typeof article !== 'object') {
    return null;
  }
  
  const sanitized = {
    title: typeof article.title === 'string' ? article.title.trim() : '',
    description: typeof article.description === 'string' ? article.description.trim() : '',
    url: typeof article.url === 'string' ? article.url.trim() : '',
    publishedAt: typeof article.publishedAt === 'string' ? article.publishedAt.trim() : '',
    source: {
      name: article.source && typeof article.source.name === 'string' 
        ? article.source.name.trim() 
        : 'Unknown Source'
    }
  };
  
  // Add optional fields if they exist and are valid
  if (article.urlToImage && typeof article.urlToImage === 'string') {
    sanitized.urlToImage = article.urlToImage.trim();
  } else {
    sanitized.urlToImage = null;
  }
  
  if (article.content && typeof article.content === 'string') {
    sanitized.content = article.content.trim();
  }
  
  if (article.author && typeof article.author === 'string') {
    sanitized.author = article.author.trim();
  }
  
  return sanitized;
};

/**
 * Validates and sanitizes an array of articles
 * @param {Array} articles - Array of article objects
 * @returns {Object} - Result with sanitized articles and validation info
 */
export const validateAndSanitizeArticles = (articles) => {
  if (!Array.isArray(articles)) {
    return {
      isValid: false,
      articles: [],
      errors: ['Input must be an array of articles']
    };
  }
  
  const sanitizedArticles = [];
  const errors = [];
  const usedUrls = new Set();
  
  articles.forEach((article, index) => {
    const sanitized = sanitizeArticle(article);
    
    if (sanitized) {
      const validation = validateArticle(sanitized);
      
      if (validation.isValid) {
        if (usedUrls.has(sanitized.url)) {
          errors.push(`Duplicate article URL "${sanitized.url}" found at index ${index}`);
        } else {
          usedUrls.add(sanitized.url);
          sanitizedArticles.push(sanitized);
        }
      } else {
        errors.push(`Article at index ${index}: ${validation.errors.join(', ')}`);
      }
    } else {
      errors.push(`Article at index ${index}: Invalid article object`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    articles: sanitizedArticles,
    errors
  };
};

/**
 * Generates a unique ID for an article based on its URL
 * @param {Object} article - Article object
 * @returns {string} - Unique article ID
 */
export const generateArticleId = (article) => {
  if (!article || !article.url) {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Create a simple hash from the URL
  let hash = 0;
  for (let i = 0; i < article.url.length; i++) {
    const char = article.url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

export default {
  validateArticle,
  validateArticlesArray,
  sanitizeArticle,
  validateAndSanitizeArticles,
  generateArticleId
};