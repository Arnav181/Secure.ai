import React from 'react';

/**
 * Chatbot Component - Slide-in chatbot container similar to Brave's Leo
 * 
 * Features:
 * - Slide-in/out animation from the right side
 * - Toggle functionality similar to Brave's Leo
 * - Proper z-index and overlay handling
 * - Responsive overlay on mobile
 * - Backdrop blur and proper positioning
 * 
 * Requirements: 3.1, 3.2
 */
const Chatbot = ({ isOpen, onClose, children, className = '' }) => {
  return (
    <>
      {/* Backdrop overlay - only visible when chatbot is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={onClose}
          aria-label="Close chatbot"
        />
      )}

      {/* Chatbot Container */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-md
          bg-slate-800/95 backdrop-blur-lg
          border-l border-slate-700
          shadow-2xl
          z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-title"
      >
        {/* Chatbot Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            {/* AI Assistant Icon */}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h2 id="chatbot-title" className="text-lg font-semibold text-white">
                Legal Assistant
              </h2>
              <p className="text-xs text-slate-400">
                AI-powered cybersecurity law help
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              text-slate-400 hover:text-white
              hover:bg-slate-700/50
              transition-colors duration-200
            "
            aria-label="Close chatbot"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chatbot Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
          {children}
        </div>

        {/* Status Indicator */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-xs text-slate-500 z-10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Ready to assist</span>
        </div>
      </div>
    </>
  );
};

export default Chatbot;