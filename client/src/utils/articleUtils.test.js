/**
 * Unit Tests for Article Utilities
 */

import { describe, it, expect } from 'vitest';
import {
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
} from './articleUtils.js';

describe('Article Utilities', () => {
  const sampleArticles = [
    {
      title: 'Major Cybersecurity Breach at Tech Company',
      description: 'A significant data breach has affected millions of users',
      url: 'https://example.com/article1',
      publishedAt: '2023-12-15T10:00:00Z',
      source: { name: 'Tech News' },
      content: 'Full article about the cybersecurity incident',
      author: 'John Smith'
    },
    {
      title: 'New Malware Targets Banking Systems',
      description: 'Security researchers discover new banking malware',
      url: 'https://example.com/article2',
      publishedAt: '2023-12-14T15:30:00Z',
      source: { name: 'Security Weekly' },
      content: 'Details about the malware attack',
      author: 'Jane Doe'
    },
    {
      title: 'AI Technology Advances in Healthcare',
      description: 'Machine learning improves medical diagnosis',
      url: 'https://example.com/article3',
      publishedAt: '2023-12-13T09:15:00Z',
      source: { name: 'Health Tech' },
      content: 'Article about AI in healthcare',
      author: 'Dr. Wilson'
    }
  ];

  describe('searchArticles', () => {
    it('should return all articles when no query provided', () => {
      expect(searchArticles('', sampleArticles)).toEqual(sampleArticles);
      expect(searchArticles(null, sampleArticles)).toEqual(sampleArticles);
      expect(searchArticles('   ', sampleArticles)).toEqual(sampleArticles);
    });

    it('should search in article titles', () => {
      const results = searchArticles('cybersecurity', sampleArticles);
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('Cybersecurity');
    });

    it('should search in article descriptions', () => {
      const results = searchArticles('banking', sampleArticles);
      expect(results).toHaveLength(1);
      expect(results[0].description).toContain('banking');
    });

    it('should search in source names', () => {
      const results = searchArticles('Security Weekly', sampleArticles);
      expect(results).toHaveLength(1);
      expect(results[0].source.name).toBe('Security Weekly');
    });

    it('should search in content', () => {
      const results = searchArticles('malware attack', sampleArticles);
      expect(results).toHaveLength(1);
      expect(results[0].content).toContain('malware attack');
    });

    it('should search in author names', () => {
      const results = searchArticles('Jane Doe', sampleArticles);
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('Jane Doe');
    });

    it('should be case insensitive', () => {
      const results = searchArticles('CYBERSECURITY', sampleArticles);
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('Cybersecurity');
    });

    it('should handle partial matches', () => {
      const results = searchArticles('cyber', sampleArticles);
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('Cybersecurity');
    });
  });

  describe('extractSearchTerms', () => {
    it('should extract terms from query', () => {
      const terms = extractSearchTerms('cybersecurity data breach');
      expect(terms).toEqual(['cybersecurity', 'data', 'breach']);
    });

    it('should handle multiple spaces', () => {
      const terms = extractSearchTerms('  cybersecurity   data   breach  ');
      expect(terms).toEqual(['cybersecurity', 'data', 'breach']);
    });

    it('should return empty array for empty query', () => {
      expect(extractSearchTerms('')).toEqual([]);
      expect(extractSearchTerms('   ')).toEqual([]);
      expect(extractSearchTerms(null)).toEqual([]);
    });

    it('should convert to lowercase', () => {
      const terms = extractSearchTerms('CYBERSECURITY Data BREACH');
      expect(terms).toEqual(['cybersecurity', 'data', 'breach']);
    });
  });

  describe('findMatches', () => {
    it('should find matches in text', () => {
      const matches = findMatches('This is a cybersecurity article about data breach', ['cyber', 'data']);
      expect(matches).toHaveLength(2);
      expect(matches[0].start).toBe(10);
      expect(matches[0].end).toBe(15);
      expect(matches[1].start).toBe(42);
      expect(matches[1].end).toBe(46);
    });

    it('should handle overlapping matches', () => {
      const matches = findMatches('cybersecurity cyber attack', ['cyber', 'cybersecurity']);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const matches = findMatches('This is a test', ['xyz', 'abc']);
      expect(matches).toEqual([]);
    });

    it('should handle empty inputs', () => {
      expect(findMatches('', ['test'])).toEqual([]);
      expect(findMatches('test', [])).toEqual([]);
      expect(findMatches(null, ['test'])).toEqual([]);
    });
  });

  describe('highlightSearchTerms', () => {
    it('should highlight search terms', () => {
      const result = highlightSearchTerms('This is a cybersecurity test', 'cyber');
      expect(result).toContain('<span class="highlight">cyber</span>');
    });

    it('should use custom class name', () => {
      const result = highlightSearchTerms('This is a cybersecurity test', 'cyber', 'custom-highlight');
      expect(result).toContain('<span class="custom-highlight">cyber</span>');
    });

    it('should return original text when no query', () => {
      const text = 'This is a test';
      expect(highlightSearchTerms(text, '')).toBe(text);
      expect(highlightSearchTerms(text, null)).toBe(text);
    });

    it('should handle multiple matches', () => {
      const result = highlightSearchTerms('cyber attack on cyber systems', 'cyber');
      const matches = (result.match(/<span class="highlight">cyber<\/span>/g) || []).length;
      expect(matches).toBe(2);
    });
  });

  describe('filterBySource', () => {
    it('should filter articles by source name', () => {
      const results = filterBySource(sampleArticles, 'Tech News');
      expect(results).toHaveLength(1);
      expect(results[0].source.name).toBe('Tech News');
    });

    it('should be case insensitive', () => {
      const results = filterBySource(sampleArticles, 'tech news');
      expect(results).toHaveLength(1);
      expect(results[0].source.name).toBe('Tech News');
    });

    it('should handle partial matches', () => {
      const results = filterBySource(sampleArticles, 'Tech');
      expect(results).toHaveLength(2); // 'Tech News' and 'Health Tech'
    });

    it('should return all articles when no source provided', () => {
      expect(filterBySource(sampleArticles, '')).toEqual(sampleArticles);
      expect(filterBySource(sampleArticles, null)).toEqual(sampleArticles);
    });
  });

  describe('filterByDateRange', () => {
    it('should filter articles by date range', () => {
      const startDate = new Date('2023-12-14T00:00:00Z');
      const endDate = new Date('2023-12-15T23:59:59Z');
      
      const results = filterByDateRange(sampleArticles, startDate, endDate);
      expect(results).toHaveLength(2); // Articles from Dec 14 and 15
    });

    it('should filter with only start date', () => {
      const startDate = new Date('2023-12-14T00:00:00Z');
      
      const results = filterByDateRange(sampleArticles, startDate, null);
      expect(results).toHaveLength(2); // Articles from Dec 14 onwards
    });

    it('should filter with only end date', () => {
      const endDate = new Date('2023-12-14T00:00:00Z');
      
      const results = filterByDateRange(sampleArticles, null, endDate);
      expect(results).toHaveLength(2); // Articles up to Dec 14
    });

    it('should return all articles when no dates provided', () => {
      const results = filterByDateRange(sampleArticles, null, null);
      expect(results).toEqual(sampleArticles);
    });

    it('should handle articles with invalid dates', () => {
      const articlesWithInvalidDate = [
        ...sampleArticles,
        { ...sampleArticles[0], publishedAt: 'invalid-date' }
      ];
      
      const startDate = new Date('2023-12-14T00:00:00Z');
      const results = filterByDateRange(articlesWithInvalidDate, startDate, null);
      expect(results).toHaveLength(2); // Invalid date article should be filtered out
    });
  });

  describe('removeDuplicateArticles', () => {
    it('should remove duplicate articles by URL', () => {
      const articlesWithDuplicates = [
        sampleArticles[0],
        sampleArticles[1],
        { ...sampleArticles[0], title: 'Different title, same URL' },
        sampleArticles[2]
      ];
      
      const results = removeDuplicateArticles(articlesWithDuplicates);
      expect(results).toHaveLength(3);
      
      const urls = results.map(article => article.url);
      const uniqueUrls = [...new Set(urls)];
      expect(urls).toEqual(uniqueUrls);
    });

    it('should handle empty array', () => {
      expect(removeDuplicateArticles([])).toEqual([]);
    });

    it('should handle non-array input', () => {
      expect(removeDuplicateArticles('not an array')).toEqual([]);
    });

    it('should handle articles without URLs', () => {
      const articlesWithoutUrls = [
        { title: 'Article 1' },
        { title: 'Article 2' },
        { title: 'Article 3', url: 'https://example.com/article' }
      ];
      
      const results = removeDuplicateArticles(articlesWithoutUrls);
      expect(results).toHaveLength(1); // Only the one with URL
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should remove harmful characters', () => {
      const query = 'cybersecurity<script>alert("xss")</script>';
      const sanitized = sanitizeSearchQuery(query);
      expect(sanitized).toBe('cybersecurityscriptalert("xss")/script');
    });

    it('should remove brackets and quotes', () => {
      const query = 'cyber{security}[test]"malware"';
      const sanitized = sanitizeSearchQuery(query);
      expect(sanitized).toBe('cybersecuritytestmalware');
    });

    it('should trim whitespace', () => {
      const query = '  cybersecurity  ';
      const sanitized = sanitizeSearchQuery(query);
      expect(sanitized).toBe('cybersecurity');
    });

    it('should limit length', () => {
      const longQuery = 'a'.repeat(300);
      const sanitized = sanitizeSearchQuery(longQuery);
      expect(sanitized.length).toBe(200);
    });

    it('should handle non-string input', () => {
      expect(sanitizeSearchQuery(null)).toBe('');
      expect(sanitizeSearchQuery(undefined)).toBe('');
      expect(sanitizeSearchQuery(123)).toBe('');
    });
  });

  describe('getSearchStats', () => {
    it('should return correct search statistics', () => {
      const filtered = [sampleArticles[0]];
      const stats = getSearchStats(sampleArticles, filtered, 'cybersecurity');
      
      expect(stats.totalArticles).toBe(3);
      expect(stats.matchingArticles).toBe(1);
      expect(stats.hasQuery).toBe(true);
      expect(stats.query).toBe('cybersecurity');
      expect(stats.percentage).toBe(33); // 1/3 * 100, rounded
    });

    it('should handle empty query', () => {
      const stats = getSearchStats(sampleArticles, sampleArticles, '');
      
      expect(stats.hasQuery).toBe(false);
      expect(stats.query).toBe('');
      expect(stats.percentage).toBe(100);
    });

    it('should handle empty arrays', () => {
      const stats = getSearchStats([], [], 'test');
      
      expect(stats.totalArticles).toBe(0);
      expect(stats.matchingArticles).toBe(0);
      expect(stats.percentage).toBe(0);
    });
  });

  describe('isCybersecurityRelated', () => {
    it('should identify cybersecurity articles by title', () => {
      const article = {
        title: 'Major Cybersecurity Breach Affects Millions',
        description: 'Regular news article',
        content: 'Some content'
      };
      
      expect(isCybersecurityRelated(article)).toBe(true);
    });

    it('should identify cybersecurity articles by description', () => {
      const article = {
        title: 'Tech News',
        description: 'A new malware has been discovered targeting banks',
        content: 'Some content'
      };
      
      expect(isCybersecurityRelated(article)).toBe(true);
    });

    it('should identify cybersecurity articles by content', () => {
      const article = {
        title: 'Tech News',
        description: 'Regular description',
        content: 'This article discusses ransomware attacks on healthcare systems'
      };
      
      expect(isCybersecurityRelated(article)).toBe(true);
    });

    it('should identify various cybersecurity keywords', () => {
      const keywords = [
        'data breach', 'phishing', 'vulnerability', 'exploit',
        'information security', 'network security', 'firewall',
        'encryption', 'zero day', 'penetration testing'
      ];
      
      keywords.forEach(keyword => {
        const article = {
          title: `Article about ${keyword}`,
          description: 'Description',
          content: 'Content'
        };
        
        expect(isCybersecurityRelated(article)).toBe(true);
      });
    });

    it('should return false for non-cybersecurity articles', () => {
      const article = {
        title: 'Weather Update for Tomorrow',
        description: 'Sunny skies expected',
        content: 'The weather will be nice tomorrow'
      };
      
      expect(isCybersecurityRelated(article)).toBe(false);
    });

    it('should handle articles with missing fields', () => {
      expect(isCybersecurityRelated({})).toBe(false);
      expect(isCybersecurityRelated(null)).toBe(false);
      expect(isCybersecurityRelated(undefined)).toBe(false);
    });

    it('should be case insensitive', () => {
      const article = {
        title: 'CYBERSECURITY BREACH',
        description: 'MALWARE ATTACK',
        content: 'PHISHING ATTEMPT'
      };
      
      expect(isCybersecurityRelated(article)).toBe(true);
    });
  });
});