/**
 * Unit Tests for Article Validation Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateArticle,
  validateArticlesArray,
  sanitizeArticle,
  validateAndSanitizeArticles,
  generateArticleId
} from './articleValidation.js';

describe('Article Validation', () => {
  const validArticle = {
    title: 'Test Cybersecurity Article',
    description: 'This is a test article about cybersecurity',
    url: 'https://example.com/article',
    publishedAt: '2023-12-15T10:30:00Z',
    source: {
      name: 'Tech News'
    },
    urlToImage: 'https://example.com/image.jpg',
    content: 'Full article content here',
    author: 'John Doe'
  };

  describe('validateArticle', () => {
    it('should validate a correct article', () => {
      const result = validateArticle(validArticle);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object input', () => {
      const result = validateArticle('not an object');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Article must be a valid object');
    });

    it('should reject article without title', () => {
      const article = { ...validArticle, title: '' };
      const result = validateArticle(article);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Article title must be a non-empty string');
    });

    it('should reject article without description', () => {
      const article = { ...validArticle, description: '' };
      const result = validateArticle(article);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Article description must be a non-empty string');
    });

    it('should reject article with invalid URL', () => {
      const article = { ...validArticle, url: 'not-a-url' };
      const result = validateArticle(article);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Article URL must be a valid HTTP/HTTPS URL');
    });

    it('should reject article with invalid date', () => {
      const article = { ...validArticle, publishedAt: 'invalid-date' };
      const result = validateArticle(article);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Published date must be a valid ISO date string');
    });

    it('should reject article without source name', () => {
      const article = { ...validArticle, source: {} };
      const result = validateArticle(article);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Article source must have a valid name');
    });

    it('should accept article with null urlToImage', () => {
      const article = { ...validArticle, urlToImage: null };
      const result = validateArticle(article);
      expect(result.isValid).toBe(true);
    });

    it('should reject article with invalid urlToImage', () => {
      const article = { ...validArticle, urlToImage: 'not-a-url' };
      const result = validateArticle(article);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Article image URL must be a valid HTTP/HTTPS URL if provided');
    });
  });

  describe('validateArticlesArray', () => {
    it('should validate array of correct articles', () => {
      const articles = [validArticle, { ...validArticle, url: 'https://example.com/article2' }];
      const result = validateArticlesArray(articles);
      expect(result.isValid).toBe(true);
      expect(result.validArticles).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-array input', () => {
      const result = validateArticlesArray('not an array');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Articles data must be an array');
    });

    it('should detect duplicate URLs', () => {
      const articles = [validArticle, validArticle];
      const result = validateArticlesArray(articles);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Duplicate article URL'))).toBe(true);
    });

    it('should filter out invalid articles', () => {
      const articles = [
        validArticle,
        { title: 'Invalid article' }, // Missing required fields
        { ...validArticle, url: 'https://example.com/article2' }
      ];
      const result = validateArticlesArray(articles);
      expect(result.isValid).toBe(false);
      expect(result.validArticles).toHaveLength(2);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('sanitizeArticle', () => {
    it('should sanitize a valid article', () => {
      const article = {
        title: '  Test Article  ',
        description: '  Test description  ',
        url: '  https://example.com/article  ',
        publishedAt: '  2023-12-15T10:30:00Z  ',
        source: { name: '  Tech News  ' },
        urlToImage: '  https://example.com/image.jpg  ',
        content: '  Full content  ',
        author: '  John Doe  '
      };
      
      const result = sanitizeArticle(article);
      expect(result.title).toBe('Test Article');
      expect(result.description).toBe('Test description');
      expect(result.url).toBe('https://example.com/article');
      expect(result.source.name).toBe('Tech News');
      expect(result.urlToImage).toBe('https://example.com/image.jpg');
      expect(result.content).toBe('Full content');
      expect(result.author).toBe('John Doe');
    });

    it('should handle missing optional fields', () => {
      const article = {
        title: 'Test Article',
        description: 'Test description',
        url: 'https://example.com/article',
        publishedAt: '2023-12-15T10:30:00Z',
        source: { name: 'Tech News' }
      };
      
      const result = sanitizeArticle(article);
      expect(result.urlToImage).toBe(null);
      expect(result.content).toBeUndefined();
      expect(result.author).toBeUndefined();
    });

    it('should return null for invalid input', () => {
      expect(sanitizeArticle(null)).toBe(null);
      expect(sanitizeArticle('not an object')).toBe(null);
    });

    it('should handle missing source', () => {
      const article = {
        title: 'Test Article',
        description: 'Test description',
        url: 'https://example.com/article',
        publishedAt: '2023-12-15T10:30:00Z'
      };
      
      const result = sanitizeArticle(article);
      expect(result.source.name).toBe('Unknown Source');
    });
  });

  describe('validateAndSanitizeArticles', () => {
    it('should validate and sanitize array of articles', () => {
      const articles = [
        {
          title: '  Test Article 1  ',
          description: '  Description 1  ',
          url: '  https://example.com/article1  ',
          publishedAt: '2023-12-15T10:30:00Z',
          source: { name: '  Source 1  ' }
        },
        {
          title: '  Test Article 2  ',
          description: '  Description 2  ',
          url: '  https://example.com/article2  ',
          publishedAt: '2023-12-15T11:30:00Z',
          source: { name: '  Source 2  ' }
        }
      ];
      
      const result = validateAndSanitizeArticles(articles);
      expect(result.isValid).toBe(true);
      expect(result.articles).toHaveLength(2);
      expect(result.articles[0].title).toBe('Test Article 1');
      expect(result.articles[1].title).toBe('Test Article 2');
    });

    it('should reject non-array input', () => {
      const result = validateAndSanitizeArticles('not an array');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input must be an array of articles');
    });

    it('should handle mixed valid and invalid articles', () => {
      const articles = [
        validArticle,
        { title: 'Invalid' }, // Missing required fields
        { ...validArticle, url: 'https://example.com/article2' }
      ];
      
      const result = validateAndSanitizeArticles(articles);
      expect(result.isValid).toBe(false);
      expect(result.articles).toHaveLength(2);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('generateArticleId', () => {
    it('should generate consistent ID for same URL', () => {
      const article1 = { url: 'https://example.com/article' };
      const article2 = { url: 'https://example.com/article' };
      
      const id1 = generateArticleId(article1);
      const id2 = generateArticleId(article2);
      
      expect(id1).toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });

    it('should generate different IDs for different URLs', () => {
      const article1 = { url: 'https://example.com/article1' };
      const article2 = { url: 'https://example.com/article2' };
      
      const id1 = generateArticleId(article1);
      const id2 = generateArticleId(article2);
      
      expect(id1).not.toBe(id2);
    });

    it('should handle articles without URL', () => {
      const article = { title: 'Test' };
      const id = generateArticleId(article);
      
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should handle null/undefined input', () => {
      const id1 = generateArticleId(null);
      const id2 = generateArticleId(undefined);
      
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });
  });
});