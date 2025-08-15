import React from 'react';

/**
 * ChatbotToggle Component - Floating action button for chatbot toggle
 * 
 * Features:
 * - Floating action button positioned appropriately on the page
 * - Proper styling and hover effects
 * - Toggle functionality for chatbot visibility
 * - Responsive design for mobile and desktop
 * 
 * Requirements: 3.4
 */
const ChatbotToggle = ({ isOpen, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14 
        bg-gradient-to-r from-blue-500 to-purple-600
        hover:from-blue-600 hover:to-purple-700
        active:from-blue-700 active:to-purple-800
        text-white
        rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        flex items-center justify-center
        border-2 border-white/20
        backdrop-blur-sm
        ${isOpen ? 'rotate-45' : 'rotate-0'}
        ${className}
      `}
      aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      title={isOpen ? 'Close chatbot' : 'Open chatbot'}
    >
      {/* Chat Icon */}
      <svg
        className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isOpen ? (
          // Close icon (X)
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          // Chat bubble icon
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        )}
      </svg>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-20"></div>
      )}
    </button>
  );
};

export default ChatbotToggle;