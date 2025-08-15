import React from "react";
import { Clock } from "lucide-react";

const ChatHistorySection = ({ chatHistory = [], onChatSelect }) => {
  const handleChatClick = (chat) => {
    if (onChatSelect) {
      onChatSelect(chat);
    } else {
      // Placeholder for future implementation
      console.log("Chat selection not implemented yet:", chat);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Recent';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 168) { // 7 days
        return date.toLocaleDateString([], { weekday: 'short' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      return 'Recent';
    }
  };

  const truncateTitle = (title, maxLength = 30) => {
    if (!title || title.length <= maxLength) return title || 'Untitled Chat';
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className="pt-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-4 py-2 text-slate-400 text-sm font-medium">
        <Clock className="w-4 h-4" />
        <span>Chat History</span>
      </div>
      
      {/* Chat History List */}
      <div className="space-y-1 mt-2">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat, index) => (
            <button
              key={chat.id || index}
              onClick={() => handleChatClick(chat)}
              className="w-full flex items-start gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-slate-200 transition-colors duration-200 text-left group"
              title={chat.title || 'Untitled Chat'}
            >
              {/* Chat Indicator Dot */}
              <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-blue-400 mt-2 flex-shrink-0 transition-colors duration-200" />
              
              {/* Chat Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {truncateTitle(chat.title)}
                </div>
                <div className="text-xs text-slate-500 group-hover:text-slate-400 mt-1 transition-colors duration-200">
                  {formatTimestamp(chat.timestamp)}
                </div>
                {/* Preview text if available */}
                {chat.preview && (
                  <div className="text-xs text-slate-600 group-hover:text-slate-500 mt-1 truncate transition-colors duration-200">
                    {chat.preview}
                  </div>
                )}
              </div>
            </button>
          ))
        ) : (
          /* Empty State */
          <div className="px-4 py-6 text-center text-slate-500 text-sm">
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-8 h-8 text-slate-600" />
              <span>No previous chats</span>
              <span className="text-xs text-slate-600">
                Your chat history will appear here
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistorySection;