import React from 'react';
import PropTypes from 'prop-types';
import { formatRelativeTime } from '../utils/timeUtils';
import { highlightText } from '../utils/highlightUtils';

/**
 * NewsCard Component - Displays individual news article in a card format
 * 
 * @param {Object} props - Component props
 * @param {Object} props.article - Article object containing title, description, url, etc.
 * @param {string} [props.searchQuery] - Optional search query for highlighting
 * @param {Function} [props.onArticleClick] - Optional click handler for analytics/tracking
 * @param {string} [props.className] - Additional CSS classes
 */
const NewsCard = ({ article, searchQuery = '', onArticleClick, className = '' }) => {
  const { title, description, url, urlToImage, publishedAt, source } = article;

  // Handle article click - open in new tab
  const handleClick = () => {
    if (onArticleClick) {
      onArticleClick(url);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle image error - hide broken images
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  // Handle image load - show image when loaded
  const handleImageLoad = (e) => {
    e.target.style.display = 'block';
  };

  // Create highlighted text segments for search highlighting
  const createHighlightedText = (text, query) => {
    if (!query.trim()) {
      return <span>{text}</span>;
    }

    const segments = highlightText(text, query.split(' ').filter(term => term.trim()));
    
    return (
      <span>
        {segments.map((segment, index) => (
          segment.highlighted ? (
            <mark 
              key={index} 
              className="bg-yellow-400/20 text-yellow-300 px-1 rounded border border-yellow-400/30"
            >
              {segment.text}
            </mark>
          ) : (
            <span key={index}>{segment.text}</span>
          )
        ))}
      </span>
    );
  };

  return (
    <article 
      className={`bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 overflow-hidden hover:shadow-xl hover:bg-slate-800/80 transition-all duration-300 cursor-pointer group ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Read article: ${title}`}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-slate-700/50 overflow-hidden">
        {urlToImage ? (
          <img
            src={urlToImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : null}
        
        {/* Default placeholder when no image or image fails to load */}
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 ${urlToImage ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-slate-600/50 rounded-lg flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-slate-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">Cybersecurity News</p>
          </div>
        </div>

        {/* Source badge overlay */}
        {source && source.name && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600/80 text-blue-100 border border-blue-500/50 backdrop-blur-sm">
              {source.name}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-100 leading-tight mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
          {createHighlightedText(title, searchQuery)}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {createHighlightedText(description, searchQuery)}
          </p>
        )}

        {/* Footer with date and read more indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex items-center text-xs text-slate-400">
            <svg 
              className="w-4 h-4 mr-1.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <time dateTime={publishedAt}>
              {formatRelativeTime(publishedAt)}
            </time>
          </div>
          
          <div className="flex items-center text-xs text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
            <span className="mr-1">Read more</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
};

NewsCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    urlToImage: PropTypes.string,
    publishedAt: PropTypes.string.isRequired,
    source: PropTypes.shape({
      name: PropTypes.string
    }),
    content: PropTypes.string
  }).isRequired,
  searchQuery: PropTypes.string,
  onArticleClick: PropTypes.func,
  className: PropTypes.string
};

export default NewsCard;