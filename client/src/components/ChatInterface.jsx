import React, { useState, useRef, useEffect } from 'react';
import { chatBotMessage } from '../services/llmService'; // Importing the chatBotMessage function

/**
 * ChatMessage Component - Individual chat message display
 */
const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[80%] p-3 rounded-lg
          ${isUser
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            : 'bg-slate-700 text-slate-100'
          }
        `}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

/**
 * ChatInterface Component - Complete chat interface with messages and input
 * 
 * Features:
 * - Chat message display component
 * - Chat input field with send functionality
 * - Message history display and scrolling
 * - Placeholder UI for future backend integration
 * - Auto-scroll to latest messages
 * 
 * Requirements: 3.3, 3.5
 */
const ChatInterface = ({ className = '' }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your Legal Assistant. I can help you understand cybersecurity laws in India. Ask me about specific acts, sections, or legal concepts.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to LLM backend
      const response = await chatBotMessage({ message: userMessage.text });
      
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message to LLM:', error);
      
      // Fallback response if LLM fails
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm currently unable to process your request. Please try again later or check if the LLM server is running.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ paddingBottom: '120px' }}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isUser={message.isUser}
          />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-slate-700 p-4 bg-slate-900/90 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about cybersecurity laws..."
              className="
                w-full p-3 pr-12
                bg-slate-700 border border-slate-600
                rounded-lg resize-none
                text-white placeholder-slate-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200
              "
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={isTyping}
            />
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="
                absolute right-2 top-1/2 transform -translate-y-1/2
                w-8 h-8 rounded-full
                bg-gradient-to-r from-blue-500 to-purple-600
                hover:from-blue-600 hover:to-purple-700
                disabled:from-slate-600 disabled:to-slate-600
                disabled:cursor-not-allowed
                text-white
                flex items-center justify-center
                transition-all duration-200
                transform hover:scale-105 active:scale-95
              "
              aria-label="Send message"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
        
        {/* Helper Text */}
        <div className="mt-2 text-xs text-slate-500 text-center">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;