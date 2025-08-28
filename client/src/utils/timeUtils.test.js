/**
 * Unit Tests for Time Utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatRelativeTime,
  formatReadableDate,
  formatDateTime,
  isRecent,
  isToday,
  sortArticlesByDate
} from './timeUtils.js';

describe('Time Utilities', () => {
  beforeEach(() => {
    // Mock current time to December 15, 2023, 12:00:00 UTC
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatRelativeTime', () => {
    it('should return "Just now" for very recent times', () => {
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
      
      expect(formatRelativeTime(thirtySecondsAgo)).toBe('Just now');
      expect(formatRelativeTime(now)).toBe('Just now');
    });

    it('should format minutes correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should format hours correctly', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
      
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
      expect(formatRelativeTime(threeHoursAgo)).toBe('3 hours ago');
    });

    it('should format days correctly', () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago');
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });

    it('should format weeks correctly', () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      
      expect(formatRelativeTime(oneWeekAgo)).toBe('1 week ago');
      expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago');
    });

    it('should format months correctly', () => {
      const now = new Date();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      
      expect(formatRelativeTime(oneMonthAgo)).toBe('1 month ago');
      expect(formatRelativeTime(twoMonthsAgo)).toBe('2 months ago');
    });

    it('should format years correctly', () => {
      const now = new Date();
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
      
      expect(formatRelativeTime(oneYearAgo)).toBe('1 year ago');
      expect(formatRelativeTime(twoYearsAgo)).toBe('2 years ago');
    });

    it('should handle string dates', () => {
      const result = formatRelativeTime('2023-12-15T11:00:00Z'); // 1 hour ago
      expect(result).toBe('1 hour ago');
    });

    it('should handle future dates', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 60 * 60 * 1000);
      
      expect(formatRelativeTime(future)).toBe('Just now');
    });

    it('should handle invalid dates', () => {
      expect(formatRelativeTime('invalid-date')).toBe('Invalid date');
      expect(formatRelativeTime(null)).toBe('Unknown time');
      expect(formatRelativeTime(undefined)).toBe('Unknown time');
    });
  });

  describe('formatReadableDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-15T10:30:00Z');
      const result = formatReadableDate(date);
      expect(result).toBe('Dec 15, 2023');
    });

    it('should handle string dates', () => {
      const result = formatReadableDate('2023-12-15T10:30:00Z');
      expect(result).toBe('Dec 15, 2023');
    });

    it('should handle invalid dates', () => {
      expect(formatReadableDate('invalid-date')).toBe('Invalid date');
      expect(formatReadableDate(null)).toBe('Unknown date');
      expect(formatReadableDate(undefined)).toBe('Unknown date');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-12-15T10:30:00Z');
      const result = formatDateTime(date);
      // Note: This will vary based on timezone, so we check for expected format
      expect(result).toMatch(/Dec 15, 2023 at \d{1,2}:\d{2} (AM|PM)/);
    });

    it('should handle string dates', () => {
      const result = formatDateTime('2023-12-15T10:30:00Z');
      expect(result).toMatch(/Dec 15, 2023 at \d{1,2}:\d{2} (AM|PM)/);
    });

    it('should handle invalid dates', () => {
      expect(formatDateTime('invalid-date')).toBe('Invalid date');
      expect(formatDateTime(null)).toBe('Unknown date');
      expect(formatDateTime(undefined)).toBe('Unknown date');
    });
  });

  describe('isRecent', () => {
    it('should return true for dates within 24 hours', () => {
      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000);
      
      expect(isRecent(twelveHoursAgo)).toBe(true);
      expect(isRecent(twentyThreeHoursAgo)).toBe(true);
      expect(isRecent(now)).toBe(true);
    });

    it('should return false for dates older than 24 hours', () => {
      const now = new Date();
      const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      
      expect(isRecent(twentyFiveHoursAgo)).toBe(false);
      expect(isRecent(twoDaysAgo)).toBe(false);
    });

    it('should return false for future dates', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 60 * 60 * 1000);
      
      expect(isRecent(future)).toBe(false);
    });

    it('should handle string dates', () => {
      const result = isRecent('2023-12-15T06:00:00Z'); // 6 hours ago
      expect(result).toBe(true);
    });

    it('should handle invalid dates', () => {
      expect(isRecent('invalid-date')).toBe(false);
      expect(isRecent(null)).toBe(false);
      expect(isRecent(undefined)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('should return true for dates today', () => {
      const now = new Date();
      const earlierToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
      const laterToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0);
      
      expect(isToday(now)).toBe(true);
      expect(isToday(earlierToday)).toBe(true);
      expect(isToday(laterToday)).toBe(true);
    });

    it('should return false for dates not today', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      expect(isToday(yesterday)).toBe(false);
      expect(isToday(tomorrow)).toBe(false);
    });

    it('should handle string dates', () => {
      const result = isToday('2023-12-15T10:30:00Z'); // Today in our mocked time
      expect(result).toBe(true);
    });

    it('should handle invalid dates', () => {
      expect(isToday('invalid-date')).toBe(false);
      expect(isToday(null)).toBe(false);
      expect(isToday(undefined)).toBe(false);
    });
  });

  describe('sortArticlesByDate', () => {
    const articles = [
      { title: 'Article 1', publishedAt: '2023-12-15T10:00:00Z' },
      { title: 'Article 2', publishedAt: '2023-12-15T12:00:00Z' },
      { title: 'Article 3', publishedAt: '2023-12-15T08:00:00Z' },
      { title: 'Article 4', publishedAt: 'invalid-date' }
    ];

    it('should sort articles by date (newest first)', () => {
      const sorted = sortArticlesByDate(articles);
      
      expect(sorted[0].title).toBe('Article 2'); // 12:00 (newest)
      expect(sorted[1].title).toBe('Article 1'); // 10:00
      expect(sorted[2].title).toBe('Article 3'); // 08:00
      expect(sorted[3].title).toBe('Article 4'); // invalid date (last)
    });

    it('should handle empty array', () => {
      const result = sortArticlesByDate([]);
      expect(result).toEqual([]);
    });

    it('should handle non-array input', () => {
      const result = sortArticlesByDate('not an array');
      expect(result).toEqual([]);
    });

    it('should not mutate original array', () => {
      const original = [...articles];
      sortArticlesByDate(articles);
      expect(articles).toEqual(original);
    });

    it('should handle articles with all invalid dates', () => {
      const invalidArticles = [
        { title: 'Article 1', publishedAt: 'invalid-date-1' },
        { title: 'Article 2', publishedAt: 'invalid-date-2' }
      ];
      
      const sorted = sortArticlesByDate(invalidArticles);
      expect(sorted).toHaveLength(2);
      // Order should remain the same when all dates are invalid
    });
  });
});