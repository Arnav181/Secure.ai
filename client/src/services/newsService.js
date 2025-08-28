import axios from 'axios';
import { filterCybersecurityArticles } from '../utils/newsSearchUtils';

// NewsAPI Configuration
const NEWS_API_CONFIG = {
  baseURL: 'https://newsapi.org/v2/everything',
  apiKey: import.meta.env.VITE_NEWS_API_KEY,
  searchTerms: [
    'cybersecurity',
    'data breach',
    'malware',
    'vulnerability',
    'cyber attack',
    'information security',
    'ransomware',
    'phishing',
    'computer security',
    'network security',
    'cloud security',
    'iot security',
    'endpoint security',
    'zero-day',
    'exploit',
    'cybercrime',
    'hacking',
    'encryption',
    'firewall',
    'antivirus',
    'cyber threat',
    'digital forensics',
    'penetration testing',
    'security audit',
    'compliance',
    'gdpr',
    'hipaa',
    'pci dss',
    'nist',
    'iso 27001'
  ],
  pageSize: 50,
  sortBy: 'publishedAt'
};

// Custom error types for better error handling
export class NewsAPIError extends Error {
  constructor(message, type, status = null) {
    super(message);
    this.name = 'NewsAPIError';
    this.type = type;
    this.status = status;
  }
}

// Validate article data structure
export const validateArticle = (article) => {
  if (!article || typeof article !== 'object') {
    return false;
  }
  
  const requiredFields = ['title', 'description', 'url', 'publishedAt', 'source'];
  return requiredFields.every(field => {
    if (field === 'source') {
      return article.source && article.source.name;
    }
    return article[field] && typeof article[field] === 'string';
  });
};

// Deduplicate articles and sort by publication date
export const deduplicateAndSortArticles = (articles) => {
  if (!Array.isArray(articles)) {
    return [];
  }

  // Create a Map to track unique articles by URL (primary) and title (secondary)
  const uniqueArticles = new Map();
  const seenUrls = new Set();
  const seenTitles = new Set();

  articles.forEach(article => {
    // Skip if URL already exists
    if (seenUrls.has(article.url)) {
      return;
    }

    // Skip if title is very similar (basic duplicate detection)
    const normalizedTitle = article.title.toLowerCase().trim();
    if (seenTitles.has(normalizedTitle)) {
      return;
    }

    // Add to tracking sets
    seenUrls.add(article.url);
    seenTitles.add(normalizedTitle);
    
    // Use URL as the primary key for uniqueness
    uniqueArticles.set(article.url, article);
  });

  // Convert Map values to array and sort by publication date (newest first)
  return Array.from(uniqueArticles.values()).sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    
    // Handle invalid dates by putting them at the end
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    // Sort newest first (descending order)
    return dateB.getTime() - dateA.getTime();
  });
};

// Handle different types of API errors
export const handleApiError = (error) => {
  if (error.response) {
    // API responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        throw new NewsAPIError(
          'Invalid API key. Please check your NewsAPI configuration.',
          'authentication',
          status
        );
      case 429:
        throw new NewsAPIError(
          'Rate limit exceeded. Please wait before making more requests.',
          'rate_limit',
          status
        );
      case 400:
        throw new NewsAPIError(
          data.message || 'Invalid request parameters.',
          'bad_request',
          status
        );
      case 500:
        throw new NewsAPIError(
          'NewsAPI server error. Please try again later.',
          'server_error',
          status
        );
      default:
        throw new NewsAPIError(
          `API error: ${data.message || 'Unknown error'}`,
          'api_error',
          status
        );
    }
  } else if (error.request) {
    // Network error
    throw new NewsAPIError(
      'Unable to connect to NewsAPI. Please check your internet connection.',
      'network_error'
    );
  } else {
    // Other error
    throw new NewsAPIError(
      'An unexpected error occurred while fetching news.',
      'unknown_error'
    );
  }
};

// Main function to fetch cybersecurity news
export const fetchCyberSecurityNews = async () => {
  // Check if API key is configured
  if (!NEWS_API_CONFIG.apiKey || NEWS_API_CONFIG.apiKey === 'your_newsapi_key_here') {
    throw new NewsAPIError(
      'NewsAPI key not configured. Please add VITE_NEWS_API_KEY to your .env file.',
      'configuration_error'
    );
  }

  try {
    // Create search query from cybersecurity terms
    const searchQuery = NEWS_API_CONFIG.searchTerms.join(' OR ');
    
    const response = await axios.get(NEWS_API_CONFIG.baseURL, {
      params: {
        q: searchQuery,
        apiKey: NEWS_API_CONFIG.apiKey,
        pageSize: NEWS_API_CONFIG.pageSize,
        sortBy: NEWS_API_CONFIG.sortBy,
        language: 'en'
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.data.status !== 'ok') {
      throw new NewsAPIError(
        response.data.message || 'API returned error status',
        'api_error'
      );
    }

    // Filter and validate articles
    const validArticles = response.data.articles
      .filter(validateArticle)
      .map(article => ({
        id: `${article.source.name}-${Date.parse(article.publishedAt)}`,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name
        },
        content: article.content
      }));

    // Apply cybersecurity content filtering
    const cybersecurityArticles = filterCybersecurityArticles(validArticles);

    // Apply deduplication and sorting
    const processedArticles = deduplicateAndSortArticles(cybersecurityArticles);

    return processedArticles;
  } catch (error) {
    if (error instanceof NewsAPIError) {
      throw error;
    }
    handleApiError(error);
  }
};

// Function to fetch more articles with pagination
export const fetchMoreCyberSecurityNews = async (page = 2) => {
  // Check if API key is configured
  if (!NEWS_API_CONFIG.apiKey || NEWS_API_CONFIG.apiKey === 'your_newsapi_key_here') {
    throw new NewsAPIError(
      'NewsAPI key not configured. Please add VITE_NEWS_API_KEY to your .env file.',
      'configuration_error'
    );
  }

  try {
    // Create search query from cybersecurity terms
    const searchQuery = NEWS_API_CONFIG.searchTerms.join(' OR ');
    
    const response = await axios.get(NEWS_API_CONFIG.baseURL, {
      params: {
        q: searchQuery,
        apiKey: NEWS_API_CONFIG.apiKey,
        pageSize: NEWS_API_CONFIG.pageSize,
        page: page,
        sortBy: NEWS_API_CONFIG.sortBy,
        language: 'en'
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.data.status !== 'ok') {
      throw new NewsAPIError(
        response.data.message || 'API returned error status',
        'api_error'
      );
    }

    // Filter and validate articles
    const validArticles = response.data.articles
      .filter(validateArticle)
      .map(article => ({
        id: `${article.source.name}-${Date.parse(article.publishedAt)}`,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name
        },
        content: article.content
      }));

    // Apply cybersecurity content filtering
    const cybersecurityArticles = filterCybersecurityArticles(validArticles);

    // Apply deduplication and sorting
    const processedArticles = deduplicateAndSortArticles(cybersecurityArticles);

    return processedArticles;
  } catch (error) {
    if (error instanceof NewsAPIError) {
      throw error;
    }
    handleApiError(error);
  }
};

// Test function for real API integration (for development/testing purposes)
export const testNewsAPIIntegration = async () => {
  console.log('Testing NewsAPI integration...');
  
  try {
    const articles = await fetchCyberSecurityNews();
    
    console.log(`✅ Successfully fetched ${articles.length} cybersecurity articles`);
    console.log('Sample articles:');
    
    // Log first 3 articles for verification
    articles.slice(0, 3).forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source.name}`);
      console.log(`   Published: ${article.publishedAt}`);
      console.log(`   URL: ${article.url}`);
      console.log('---');
    });
    
    // Verify deduplication worked
    const urls = articles.map(a => a.url);
    const uniqueUrls = new Set(urls);
    console.log(`✅ Deduplication check: ${urls.length} articles, ${uniqueUrls.size} unique URLs`);
    
    // Verify sorting (newest first)
    const dates = articles.map(a => new Date(a.publishedAt)).filter(d => !isNaN(d.getTime()));
    const isSorted = dates.every((date, index) => {
      if (index === 0) return true;
      return date <= dates[index - 1];
    });
    console.log(`✅ Sorting check: Articles are ${isSorted ? 'properly' : 'NOT properly'} sorted by date`);
    
    return {
      success: true,
      articleCount: articles.length,
      uniqueUrls: uniqueUrls.size,
      isSorted,
      sampleArticles: articles.slice(0, 3)
    };
    
  } catch (error) {
    console.error('❌ NewsAPI integration test failed:', error.message);
    console.error('Error type:', error.type || 'unknown');
    
    return {
      success: false,
      error: error.message,
      errorType: error.type || 'unknown'
    };
  }
};

// Export configuration for testing
export { NEWS_API_CONFIG };