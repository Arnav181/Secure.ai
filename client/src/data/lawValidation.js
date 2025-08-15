/**
 * Data Validation Utilities for Law Entries
 * 
 * This file contains validation functions to ensure law data integrity
 * and proper structure validation for the cybersecurity laws system.
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
 * Validates if a value is a valid array of strings
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid string array
 */
const isValidStringArray = (value) => {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
};

/**
 * Validates if a value is a valid Date object
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid Date
 */
const isValidDate = (value) => {
  return value instanceof Date && !isNaN(value.getTime());
};

/**
 * Validates a single law entry structure
 * @param {Object} law - Law object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateLaw = (law) => {
  const errors = [];
  
  // Check if law is an object
  if (!law || typeof law !== 'object') {
    return {
      isValid: false,
      errors: ['Law must be a valid object']
    };
  }
  
  // Required field validations
  if (!isValidString(law.id)) {
    errors.push('Law ID must be a non-empty string');
  }
  
  if (!isValidString(law.act)) {
    errors.push('Act name must be a non-empty string');
  }
  
  if (!isValidString(law.section)) {
    errors.push('Section must be a non-empty string');
  }
  
  if (!isValidString(law.theory)) {
    errors.push('Theory must be a non-empty string');
  }
  
  if (!isValidStringArray(law.keywords)) {
    errors.push('Keywords must be an array of strings');
  }
  
  if (!isValidDate(law.lastUpdated)) {
    errors.push('Last updated must be a valid Date object');
  }
  
  // Optional field validations
  if (law.category !== undefined && !isValidString(law.category)) {
    errors.push('Category must be a non-empty string if provided');
  }
  
  if (law.relatedSections !== undefined && !isValidStringArray(law.relatedSections)) {
    errors.push('Related sections must be an array of strings if provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates an array of law entries
 * @param {Array} laws - Array of law objects to validate
 * @returns {Object} - Validation result with isValid boolean, validLaws array, and errors array
 */
export const validateLawsArray = (laws) => {
  if (!Array.isArray(laws)) {
    return {
      isValid: false,
      validLaws: [],
      errors: ['Laws data must be an array']
    };
  }
  
  const validLaws = [];
  const errors = [];
  const usedIds = new Set();
  
  laws.forEach((law, index) => {
    const validation = validateLaw(law);
    
    if (validation.isValid) {
      // Check for duplicate IDs
      if (usedIds.has(law.id)) {
        errors.push(`Duplicate law ID "${law.id}" found at index ${index}`);
      } else {
        usedIds.add(law.id);
        validLaws.push(law);
      }
    } else {
      errors.push(`Law at index ${index}: ${validation.errors.join(', ')}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    validLaws,
    errors
  };
};

/**
 * Sanitizes law data by removing potentially harmful content
 * @param {Object} law - Law object to sanitize
 * @returns {Object} - Sanitized law object
 */
export const sanitizeLaw = (law) => {
  if (!law || typeof law !== 'object') {
    return null;
  }
  
  const sanitized = {
    id: typeof law.id === 'string' ? law.id.trim() : '',
    act: typeof law.act === 'string' ? law.act.trim() : '',
    section: typeof law.section === 'string' ? law.section.trim() : '',
    theory: typeof law.theory === 'string' ? law.theory.trim() : '',
    keywords: Array.isArray(law.keywords) 
      ? law.keywords.filter(k => typeof k === 'string').map(k => k.trim())
      : [],
    lastUpdated: law.lastUpdated instanceof Date ? law.lastUpdated : new Date()
  };
  
  // Add optional fields if they exist
  if (law.category && typeof law.category === 'string') {
    sanitized.category = law.category.trim();
  }
  
  if (Array.isArray(law.relatedSections)) {
    sanitized.relatedSections = law.relatedSections
      .filter(s => typeof s === 'string')
      .map(s => s.trim());
  }
  
  return sanitized;
};

/**
 * Validates and sanitizes an array of laws
 * @param {Array} laws - Array of law objects
 * @returns {Object} - Result with sanitized laws and validation info
 */
export const validateAndSanitizeLaws = (laws) => {
  if (!Array.isArray(laws)) {
    return {
      isValid: false,
      laws: [],
      errors: ['Input must be an array of laws']
    };
  }
  
  const sanitizedLaws = [];
  const errors = [];
  const usedIds = new Set();
  
  laws.forEach((law, index) => {
    const sanitized = sanitizeLaw(law);
    
    if (sanitized) {
      const validation = validateLaw(sanitized);
      
      if (validation.isValid) {
        if (usedIds.has(sanitized.id)) {
          errors.push(`Duplicate law ID "${sanitized.id}" found at index ${index}`);
        } else {
          usedIds.add(sanitized.id);
          sanitizedLaws.push(sanitized);
        }
      } else {
        errors.push(`Law at index ${index}: ${validation.errors.join(', ')}`);
      }
    } else {
      errors.push(`Law at index ${index}: Invalid law object`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    laws: sanitizedLaws,
    errors
  };
};

export default {
  validateLaw,
  validateLawsArray,
  sanitizeLaw,
  validateAndSanitizeLaws
};