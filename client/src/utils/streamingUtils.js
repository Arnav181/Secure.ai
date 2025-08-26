// Utility functions for handling streaming responses

export const createStreamingMessage = (sender = 'llm') => ({
  id: Date.now() + Math.random(),
  sender,
  text: '',
  isStreaming: true,
  timestamp: new Date().toISOString()
});

export const createUserMessage = (text) => ({
  id: Date.now() + Math.random(),
  sender: 'user',
  text: text.trim(),
  isStreaming: false,
  timestamp: new Date().toISOString()
});

export const handleStreamingResponse = async (response, onChunk, onComplete, onError) => {
  try {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete(accumulatedText);
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;
      
      // Call the chunk handler with the accumulated text
      onChunk(accumulatedText);
    }
  } catch (error) {
    console.error('Streaming error:', error);
    onError(error);
  }
};

export const formatErrorMessage = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Connection failed. Please check if the server is running and try again.';
  }
  
  if (error.message.includes('HTTP error')) {
    return `Server error: ${error.message}. Please try again later.`;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Auto-scroll to bottom with smooth behavior
export const scrollToBottom = (elementRef, behavior = 'smooth') => {
  if (elementRef.current) {
    elementRef.current.scrollIntoView({ behavior });
  }
};

// Check if user is near bottom of chat (for auto-scroll logic)
export const isNearBottom = (container, threshold = 100) => {
  if (!container) return true;
  
  const { scrollTop, scrollHeight, clientHeight } = container;
  return scrollHeight - scrollTop - clientHeight < threshold;
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file type and size
export const validateFile = (file, maxSize = 150 * 1024 * 1024, allowedTypes = ['.zip']) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${formatFileSize(maxSize)}`);
  }
  
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Extract and highlight code snippets in text
export const highlightCodeInText = (text) => {
  // This is a simple implementation - you might want to use a more sophisticated approach
  return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
};

// Generate a unique session ID for chat sessions
export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Detect casual/greeting messages
export const isCasualMessage = (message) => {
  const casualPatterns = [
    /^(hi|hello|hey|good morning|good afternoon|good evening)$/i,
    /^(thank you|thanks|thx)$/i,
    /^(bye|goodbye|see you|farewell)$/i,
    /^(how are you|what's up|how's it going)$/i,
    /^(ok|okay|alright|got it|understood)$/i,
    /^(yes|no|maybe)$/i
  ];
  
  return casualPatterns.some(pattern => pattern.test(message.trim()));
};

// Get message complexity level
export const getMessageComplexity = (message) => {
  const wordCount = message.split(' ').length;
  
  if (isCasualMessage(message)) return 'casual';
  if (wordCount <= 10) return 'simple';
  if (wordCount <= 50) return 'medium';
  return 'complex';
};

// Get appropriate placeholder text based on context
export const getPlaceholderText = (hasMessages, isAnalyzing) => {
  if (isAnalyzing) return "Analysis in progress...";
  if (!hasMessages) return "Ask a cybersecurity question...";
  
  const placeholders = [
    "Ask about vulnerabilities, security practices, or compliance...",
    "Need help with network security, encryption, or threat analysis?",
    "Questions about OWASP, penetration testing, or incident response?",
    "Ask about secure coding, authentication, or risk management..."
  ];
  
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

// Save chat history to localStorage
export const saveChatHistory = (sessionId, messages) => {
  try {
    const chatData = {
      sessionId,
      messages,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`chat_${sessionId}`, JSON.stringify(chatData));
  } catch (error) {
    console.warn('Failed to save chat history:', error);
  }
};

// Load chat history from localStorage
export const loadChatHistory = (sessionId) => {
  try {
    const chatData = localStorage.getItem(`chat_${sessionId}`);
    return chatData ? JSON.parse(chatData) : null;
  } catch (error) {
    console.warn('Failed to load chat history:', error);
    return null;
  }
};

// Get all chat sessions from localStorage
export const getAllChatSessions = () => {
  try {
    const sessions = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chat_')) {
        const chatData = JSON.parse(localStorage.getItem(key));
        sessions.push({
          id: chatData.sessionId,
          timestamp: chatData.timestamp,
          messageCount: chatData.messages.length,
          preview: chatData.messages[0]?.text?.substring(0, 50) + '...' || 'Empty chat'
        });
      }
    }
    return sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.warn('Failed to load chat sessions:', error);
    return [];
  }
};