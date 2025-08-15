/**
 * Data Layer Index File
 * 
 * This file exports all data-related utilities, validation functions,
 * and helper functions for the cybersecurity laws documentation system.
 */

// Export law data
export { lawsData, default as lawsDataDefault } from './lawsData.js';

// Export validation utilities
export {
  validateLaw,
  validateLawsArray,
  sanitizeLaw,
  validateAndSanitizeLaws,
  default as lawValidation
} from './lawValidation.js';

// Export helper functions
export {
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
  getSearchStats,
  default as lawHelpers
} from './lawHelpers.js';

// Import for re-export
import { lawsData } from './lawsData.js';
import lawValidation from './lawValidation.js';
import lawHelpers from './lawHelpers.js';

// Re-export everything as a single object for convenience
export default {
  lawsData,
  validation: lawValidation,
  helpers: lawHelpers
};