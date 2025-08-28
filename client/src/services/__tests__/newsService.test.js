import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import {
  fetchCyberSecurityNews,
  validateArticle,
  handleApiError,
  deduplicateAndSortArticles,
  testNewsAPIIntegration,
  NewsAPIError,
  NEWS_API_CONFIG
} from '../newsService.js';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock environment variable
vi.mock('import.meta.env', () => ({
  VITE_NEWS_API_KEY: 'test-api-key'
}));

describe('NewsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validateArticle', () => {
    it('should return true for valid article', () => {
      const validArticle = {
        title: 'Test Title',
        description: 'Test Description',
        url: 'https://example.com',
        publishedAt: '2024-01-01T00:00:00Z',
        source: { name: 'Test Source' }
      };

      expect(validateArticle(validArticle)).toBe(true);
    });

    it('should return false for article missing required fields', () => {
      const invalidArticle = {
        title: 'Test Title',
        // missing description, url, publishedAt, source
      };

      expect(validateArticle(invalidArticle)).toBe(false);
    });

    it('should return false for article with invalid source', () => {
      const invalidArticle = {
        title: 'Test Title',
        description: 'Test Description',
        url: 'https://example.com',
        publishedAt: '2024-01-01T00:00:00Z',
        source: {} // missing name
      };

      expect(validateArticle(invalidArticle)).toBe(false);
    });

    it('should return false for null or undefined article', () => {
      expect(validateArticle(null)).toBe(false);
      expect(validateArticle(undefined)).toBe(false);
    });
  });

  describe('handleApiError', () => {
    it('should throw NewsAPIError for 401 status', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      expect(() => handleApiError(error)).toThrow(NewsAPIError);
      expect(() => handleApiError(error)).toThrow('Invalid API key');
    });

    it('should throw NewsAPIError for 429 status (rate limit)', () => {
      const error = {
        response: {
          status: 429,
          data: { message: 'Rate limit exceeded' }
        }
      };

      expect(() => handleApiError(error)).toThrow(NewsAPIError);
      expect(() => handleApiError(error)).toThrow('Rate limit exceeded');
    });

    it('should throw NewsAPIError for network errors', () => {
      const error = {
        request: {},
        message: 'Network Error'
      };

      expect(() => handleApiError(error)).toThrow(NewsAPIError);
      expect(() => handleApiError(error)).toThrow('Unable to connect to NewsAPI');
    });

    it('should throw NewsAPIError for unknown errors', () => {
      const error = {
        message: 'Unknown error'
      };

      expect(() => handleApiError(error)).toThrow(NewsAPIError);
      expect(() => handleApiError(error)).toThrow('An unexpected error occurred');
    });
  });

  describe('fetchCyberSecurityNews', () => {
    const mockArticles = [
      {
        title: 'Cybersecurity Breach',
        description: 'A major data breach occurred',
        url: 'https://example.com/article1',
        urlToImage: 'https://example.com/image1.jpg',
        publishedAt: '2024-01-01T00:00:00Z',
        source: { name: 'Security News' },
        content: 'Full article content...'
      },
      {
        title: 'Malware Alert',
        description: 'New malware detected',
        url: 'https://example.com/article2',
        urlToImage: null,
        publishedAt: '2024-01-02T00:00:00Z',
        source: { name: 'Tech News' },
        content: 'Another article content...'
      }
    ];

    it('should fetch and return cybersecurity news successfully', async () => {
      const mockResponse = {
        data: {
          status: 'ok',
          articles: mockArticles
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await fetchCyberSecurityNews();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        NEWS_API_CONFIG.baseURL,
        expect.objectContaining({
          params: expect.objectContaining({
            q: expect.stringContaining('cybersecurity'),
            apiKey: 'test-api-key',
            pageSize: 50,
            sortBy: 'publishedAt',
            language: 'en'
          }),
          timeout: 10000
        })
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: expect.any(String),
        title: 'Cybersecurity Breach',
        description: 'A major data breach occurred',
        url: 'https://example.com/article1'
      });
    });

    it('should filter out invalid articles', async () => {
      const mockResponseWithInvalidArticle = {
        data: {
          status: 'ok',
          articles: [
            ...mockArticles,
            {
              title: 'Invalid Article',
              // missing required fields
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponseWithInvalidArticle);

      const result = await fetchCyberSecurityNews();

      expect(result).toHaveLength(2); // Only valid articles
    });

    it('should throw error when API key is not configured', async () => {
      // Mock missing API key
      vi.doMock('import.meta.env', () => ({
        VITE_NEWS_API_KEY: 'your_newsapi_key_here'
      }));

      await expect(fetchCyberSecurityNews()).rejects.toThrow(NewsAPIError);
      await expect(fetchCyberSecurityNews()).rejects.toThrow('NewsAPI key not configured');
    });

    it('should handle API error responses', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid API key' }
        }
      };

      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(fetchCyberSecurityNews()).rejects.toThrow(NewsAPIError);
      await expect(fetchCyberSecurityNews()).rejects.toThrow('Invalid API key');
    });

    it('should handle network errors', async () => {
      const mockError = {
        request: {},
        message: 'Network Error'
      };

      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(fetchCyberSecurityNews()).rejects.toThrow(NewsAPIError);
      await expect(fetchCyberSecurityNews()).rejects.toThrow('Unable to connect to NewsAPI');
    });

    it('should handle API status not ok', async () => {
      const mockResponse = {
        data: {
          status: 'error',
          message: 'API error message'
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await expect(fetchCyberSecurityNews()).rejects.toThrow(NewsAPIError);
      await expect(fetchCyberSecurityNews()).rejects.toThrow('API error message');
    });
  });

  describe('deduplicateAndSortArticles', () => {
    it('should remove duplicate articles by URL', () => {
      const articlesWithDuplicates = [
        {
          title: 'Article 1',
          url: 'https://example.com/article1',
          publishedAt: '2024-01-01T00:00:00Z'
        },
        {
          title: 'Article 1 (duplicate)',
          url: 'https://example.com/article1', // Same URL
          publishedAt: '2024-01-02T00:00:00Z'
        },
        {
          title: 'Article 2',
          url: 'https://example.com/article2',
          publishedAt: '2024-01-03T00:00:00Z'
        }
      ];

      const result = deduplicateAndSortArticles(articlesWithDuplicates);
      
      expect(result).toHaveLength(2);
      expect(result.map(a => a.url)).toEqual([
        'https://example.com/article2',
        'https://example.com/article1'
      ]);
    });

    it('should remove duplicate articles by title', () => {
      const articlesWithDuplicateTitles = [
        {
          title: 'Same Title',
          url: 'https://example.com/article1',
          publishedAt: '2024-01-01T00:00:00Z'
        },
        {
          title: 'Same Title', // Same title, different URL
          url: 'https://example.com/article2',
          publishedAt: '2024-01-02T00:00:00Z'
        },
        {
          title: 'Different Title',
          url: 'https://example.com/article3',
          publishedAt: '2024-01-03T00:00:00Z'
        }
      ];

      const result = deduplicateAndSortArticles(articlesWithDuplicateTitles);
      
      expect(result).toHaveLength(2);
      expect(result.map(a => a.title)).toEqual([
        'Different Title',
        'Same Title'
      ]);
    });

    it('should sort articles by publication date (newest first)', () => {
      const unsortedArticles = [
        {
          title: 'Old Article',
          url: 'https://example.com/old',
          publishedAt: '2024-01-01T00:00:00Z'
        },
        {
          title: 'New Article',
          url: 'https://example.com/new',
          publishedAt: '2024-01-03T00:00:00Z'
        },
        {
          title: 'Middle Article',
          url: 'https://example.com/middle',
          publishedAt: '2024-01-02T00:00:00Z'
        }
      ];

      const result = deduplicateAndSortArticles(unsortedArticles);
      
      expect(result.map(a => a.title)).toEqual([
        'New Article',
        'Middle Article',
        'Old Article'
      ]);
    });

    it('should handle invalid dates by putting them at the end', () => {
      const articlesWithInvalidDates = [
        {
          title: 'Valid Date',
          url: 'https://example.com/valid',
          publishedAt: '2024-01-01T00:00:00Z'
        },
        {
          title: 'Invalid Date',
          url: 'https://example.com/invalid',
          publishedAt: 'invalid-date'
        }
      ];

      const result = deduplicateAndSortArticles(articlesWithInvalidDates);
      
      expect(result[0].title).toBe('Valid Date');
      expect(result[1].title).toBe('Invalid Date');
    });

    it('should handle empty array', () => {
      expect(deduplicateAndSortArticles([])).toEqual([]);
    });

    it('should handle non-array input', () => {
      expect(deduplicateAndSortArticles(null)).toEqual([]);
      expect(deduplicateAndSortArticles(undefined)).toEqual([]);
      expect(deduplicateAndSortArticles('not an array')).toEqual([]);
    });
  });

  describe('testNewsAPIIntegration', () => {
    it('should return success result when API call succeeds', async () => {
      const mockArticles = [
        {
          title: 'Test Article',
          url: 'https://example.com/test',
          publishedAt: '2024-01-01T00:00:00Z',
          source: { name: 'Test Source' }
        }
      ];

      const mockResponse = {
        data: {
          status: 'ok',
          articles: mockArticles
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await testNewsAPIIntegration();

      expect(result.success).toBe(true);
      expect(result.articleCount).toBe(1);
      expect(result.uniqueUrls).toBe(1);
      expect(result.isSorted).toBe(true);
      expect(result.sampleArticles).toHaveLength(1);
    });

    it('should return error result when API call fails', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid API key' }
        }
      };

      mockedAxios.get.mockRejectedValueOnce(mockError);

      const result = await testNewsAPIIntegration();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid API key');
      expect(result.errorType).toBe('authentication');
    });
  });

  describe('NEWS_API_CONFIG', () => {
    it('should have correct configuration values', () => {
      expect(NEWS_API_CONFIG.baseURL).toBe('https://newsapi.org/v2/everything');
      expect(NEWS_API_CONFIG.pageSize).toBe(50);
      expect(NEWS_API_CONFIG.sortBy).toBe('publishedAt');
      expect(NEWS_API_CONFIG.searchTerms).toContain('cybersecurity');
      expect(NEWS_API_CONFIG.searchTerms).toContain('malware');
      expect(NEWS_API_CONFIG.searchTerms).toContain('vulnerability');
    });
  });
});