import React, { useState, useEffect, useCallback } from 'react';
import NewsCard from '../components/NewsCard';
import SearchBar from '../components/SearchBar';
import { fetchCyberSecurityNews, fetchMoreCyberSecurityNews } from '../services/newsService';
import useNewsSearch from '../hooks/useNewsSearch';

const Updates = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Initialize search hook
  const {
    query,
    filteredArticles,
    searchStats,
    handleSearch,
    clearSearch,
    hasActiveSearch
  } = useNewsSearch(articles, { minQueryLength: 2 });

  // Fetch news articles
  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newsArticles = await fetchCyberSecurityNews();
      setArticles(newsArticles);
      setLastUpdated(new Date());
      setCurrentPage(1);
      setHasMore(newsArticles.length >= 20); // Assume there are more articles if we got a full page
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news articles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load more articles with pagination
  const loadMoreArticles = useCallback(async (page) => {
    try {
      setLoadingMore(true);
      const moreArticles = await fetchMoreCyberSecurityNews(page);
      
      if (moreArticles.length === 0) {
        setHasMore(false);
        return;
      }
      
      setArticles(prev => [...prev, ...moreArticles]);
      setCurrentPage(page);
      setHasMore(moreArticles.length >= 20); // Assume more articles if we got a full page
    } catch (err) {
      console.error('Error loading more articles:', err);
      setError(err.message || 'Failed to load more articles. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  }, []);

  // Refresh news
  const handleRefresh = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  // Handle load more button click
  const handleLoadMore = useCallback(() => {
    loadMoreArticles(currentPage + 1);
  }, [loadMoreArticles, currentPage]);

  // Handle article click for analytics/tracking
  const handleArticleClick = useCallback((url) => {
    console.log('Article clicked:', url);
    // Here you can add analytics tracking
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Display articles or filtered results
  const displayArticles = hasActiveSearch ? filteredArticles : articles;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Cybersecurity News & Updates
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              Stay informed with the latest cybersecurity developments, breaches, and industry insights.
            </p>
            
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search cybersecurity news..."
                className="mx-auto"
              />
            </div>

            {/* Stats and Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm text-slate-400">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span>
                  {searchStats.totalArticles} articles available
                </span>
              </div>
              
              {hasActiveSearch && (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  <span>
                    {searchStats.filteredArticles} results for "{query}"
                  </span>
                </div>
              )}

              {lastUpdated && (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  <span>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              )}

              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Refreshing...' : 'Refresh News'}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
              <p className="text-slate-400">Loading latest cybersecurity news...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-center mb-8">
              <div className="text-red-400 text-2xl mb-2">⚠️</div>
              <h3 className="text-red-200 font-semibold mb-2">Error Loading News</h3>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && !error && hasActiveSearch && searchStats.filteredArticles === 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
              <div className="text-slate-400 text-3xl mb-4">🔍</div>
              <h3 className="text-slate-200 font-semibold mb-2">No results found</h3>
              <p className="text-slate-400 mb-4">
                No articles match your search for "{query}". Try different keywords or clear your search.
              </p>
              <button
                onClick={clearSearch}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-200"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && !error && displayArticles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayArticles.map((article) => (
                  <NewsCard
                    key={article.id || article.url}
                    article={article}
                    searchQuery={query}
                    onArticleClick={handleArticleClick}
                    className="h-full"
                  />
                ))}
              </div>

              {/* Footer Stats and Load More Button */}
              <div className="text-center space-y-4">
                <div className="text-sm text-slate-500">
                  <p>
                    Showing {displayArticles.length} of {searchStats.totalArticles} articles
                    {hasActiveSearch && ` matching "${query}"`}
                  </p>
                </div>
                
                {/* Load More Button */}
                {hasMore && !hasActiveSearch && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  >
                    {loadingMore ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading more articles...
                      </>
                    ) : (
                      'Load More Articles'
                    )}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Empty State (no articles available) */}
          {!isLoading && !error && articles.length === 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
              <div className="text-slate-400 text-3xl mb-4">📰</div>
              <h3 className="text-slate-200 font-semibold mb-2">No articles available</h3>
              <p className="text-slate-400">
                There are currently no cybersecurity news articles available. Please try refreshing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Updates;
