/**
 * Time Formatting Utilities for News Articles
 * 
 * This module provides time formatting functionality for displaying
 * article publication dates in user-friendly relative formats.
 */

/**
 * Converts a date to relative time format (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} - Formatted relative time string
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) {
    return 'Unknown time';
  }
  
  let date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return 'Invalid date';
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  
  // Handle future dates
  if (diffInMs < 0) {
    return 'Just now';
  }
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // Less than an hour
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }
  
  // Less than a day
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }
  
  // Less than a week
  if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
  
  // Less than a month
  if (diffInDays < 30) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
  }
  
  // Less than a year
  if (diffInDays < 365) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }
  
  // More than a year
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
};

/**
 * Formats a date to a readable string format
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} - Formatted date string (e.g., "Dec 15, 2023")
 */
export const formatReadableDate = (dateInput) => {
  if (!dateInput) {
    return 'Unknown date';
  }
  
  let date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return 'Invalid date';
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Formats a date to include both date and time
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) {
    return 'Unknown date';
  }
  
  let date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return 'Invalid date';
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  const dateStr = date.toLocaleDateString('en-US', dateOptions);
  const timeStr = date.toLocaleTimeString('en-US', timeOptions);
  
  return `${dateStr} at ${timeStr}`;
};

/**
 * Checks if a date is recent (within the last 24 hours)
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {boolean} - True if the date is within the last 24 hours
 */
export const isRecent = (dateInput) => {
  if (!dateInput) {
    return false;
  }
  
  let date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return false;
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return false;
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  return diffInHours <= 24 && diffInHours >= 0;
};

/**
 * Checks if a date is today
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {boolean} - True if the date is today
 */
export const isToday = (dateInput) => {
  if (!dateInput) {
    return false;
  }
  
  let date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return false;
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return false;
  }
  
  const now = new Date();
  
  return date.getDate() === now.getDate() &&
         date.getMonth() === now.getMonth() &&
         date.getFullYear() === now.getFullYear();
};

/**
 * Sorts articles by publication date (newest first)
 * @param {Array} articles - Array of article objects
 * @returns {Array} - Sorted array of articles
 */
export const sortArticlesByDate = (articles) => {
  if (!Array.isArray(articles)) {
    return [];
  }
  
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    
    // Handle invalid dates by putting them at the end
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) {
      return 0;
    }
    if (isNaN(dateA.getTime())) {
      return 1;
    }
    if (isNaN(dateB.getTime())) {
      return -1;
    }
    
    // Sort newest first
    return dateB.getTime() - dateA.getTime();
  });
};

export default {
  formatRelativeTime,
  formatReadableDate,
  formatDateTime,
  isRecent,
  isToday,
  sortArticlesByDate
};