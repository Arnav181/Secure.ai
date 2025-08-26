import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, Send, Loader2, CornerDownLeft, AlertCircle, Square } from "lucide-react";
import Sidebar from '../components/Sidebar';
import StreamingChatMessage from '../components/StreamingChatMessage';
import { 
  createStreamingMessage, 
  createUserMessage, 
  handleStreamingResponse, 
  formatErrorMessage,
  scrollToBottom,
  validateFile,
  formatFileSize,
  getPlaceholderText,
  getMessageComplexity
} from '../utils/streamingUtils';


const Chat = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("upload");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // New state for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Placeholder for future implementation

  // Automatically scroll to the latest message
  const handleScrollToBottom = () => {
    scrollToBottom(messagesEndRef);
  };

  useEffect(() => {
    if (mode === "chat") {
      handleScrollToBottom();
    }
  }, [messages, mode]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);
      
      if (validation.isValid) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError(validation.errors.join(', '));
        setFile(null);
      }
    }
  };

  // Resets the chat to the initial upload screen
  const handleNewChat = () => {
    setFile(null);
    setLoading(false);
    setMode("upload");
    setMessages([]);
    setInput("");
  };

  // Sidebar handlers
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackToHome = () => {
    // Placeholder for navigation - will be implemented when router is available
    console.log("Navigate to home");
  };

  // Stop streaming function
  const handleStopStreaming = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setLoading(false);
      
      // Mark current streaming message as stopped
      setMessages(prev => prev.map(msg => 
        msg.isStreaming 
          ? { ...msg, isStreaming: false, text: msg.text + '\n\n*Response stopped by user*' }
          : msg
      ));
    }
  };

  // Handles the initial file analysis with streaming
  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    setAbortController(controller);

    const formData = new FormData();
    formData.append("zipfile", file);

    // Add initial streaming message
    const streamingMessage = createStreamingMessage();
    setMessages([streamingMessage]);
    setMode("chat");

    try {
      const response = await fetch("http://localhost:8080/chat/codebase", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      await handleStreamingResponse(
        response,
        // onChunk
        (accumulatedText) => {
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, text: accumulatedText }
              : msg
          ));
        },
        // onComplete
        (finalText) => {
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          ));
          setAbortController(null);
        },
        // onError
        (error) => {
          if (error.name === 'AbortError') {
            return; // User cancelled, already handled
          }
          const errorMessage = formatErrorMessage(error);
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { 
                  ...msg, 
                  text: errorMessage,
                  isStreaming: false
                }
              : msg
          ));
          setError(errorMessage);
          setAbortController(null);
        }
      );
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // User cancelled, already handled
      }
      console.error("Error in sending file", err);
      const errorMessage = formatErrorMessage(err);
      setMessages([
        { 
          ...streamingMessage,
          text: errorMessage,
          isStreaming: false
        },
      ]);
      setError(errorMessage);
      setAbortController(null);
    } finally {
      setLoading(false);
    }
  };

  // Handles sending a new message in the chat with streaming
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = createUserMessage(input);
    const streamingMessage = createStreamingMessage();

    setMessages((prev) => [...prev, userMessage, streamingMessage]);
    const currentInput = input.trim();
    setInput("");
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch("http://localhost:8080/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
        signal: controller.signal,
      });

      await handleStreamingResponse(
        response,
        // onChunk
        (accumulatedText) => {
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, text: accumulatedText }
              : msg
          ));
        },
        // onComplete
        (finalText) => {
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          ));
          setAbortController(null);
        },
        // onError
        (error) => {
          if (error.name === 'AbortError') {
            return; // User cancelled, already handled
          }
          const errorMessage = formatErrorMessage(error);
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { 
                  ...msg, 
                  text: errorMessage,
                  isStreaming: false
                }
              : msg
          ));
          setError(errorMessage);
          setAbortController(null);
        }
      );
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // User cancelled, already handled
      }
      console.error("Chat failed:", err);
      const errorMessage = formatErrorMessage(err);
      setMessages((prev) => prev.map(msg => 
        msg.id === streamingMessage.id 
          ? { 
              ...msg, 
              text: errorMessage,
              isStreaming: false
            }
          : msg
      ));
      setError(errorMessage);
      setAbortController(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans relative">
      
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        onNewChat={handleNewChat}
        onBackToHome={handleBackToHome}
        chatHistory={chatHistory}
      />

      {/* Main Content */}
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-72' : 'ml-0'
      }`}>
        <div className="w-full max-w-4xl h-[90vh] flex flex-col">
        {mode === "upload" && (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Codebase AI Assistant
                </h1>
                <p className="text-slate-400 mb-10">Upload your codebase (.zip) to get started.</p>

                <div className="w-full max-w-2xl bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
                    <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${
                          error 
                            ? 'border-red-500 bg-red-500/5 hover:border-red-400' 
                            : file 
                              ? 'border-green-500 bg-green-500/5 hover:border-green-400'
                              : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800'
                        }`}
                    >
                        <UploadCloud className={`w-14 h-14 mb-4 ${
                          error ? 'text-red-400' : file ? 'text-green-400' : 'text-blue-400'
                        }`} />
                        <span className="text-slate-300 font-medium text-lg text-center">
                          {file ? (
                            <>
                              {file.name}
                              <br />
                              <span className="text-sm text-slate-400">
                                {formatFileSize(file.size)}
                              </span>
                            </>
                          ) : "Click to upload your .zip file"}
                        </span>
                        <span className="text-slate-500 text-sm mt-1">Max file size: 150MB</span>
                        <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".zip,application/zip"
                        onChange={handleFileChange}
                        />
                    </label>

                    {/* Error display */}
                    {error && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-red-300 text-sm">{error}</span>
                      </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        className={`mt-6 w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-lg transition-all transform disabled:opacity-50 disabled:cursor-not-allowed ${
                        file && !loading
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:scale-105"
                            : "bg-slate-700"
                        }`}
                    >
                        {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Analyzing...</span>
                        </>
                        ) : (
                        <>
                            <Send className="w-5 h-5" />
                            <span>Analyze Codebase</span>
                        </>
                        )}
                    </button>
                </div>
            </div>
        )}

        {mode === "chat" && (
          <div className="w-full h-full flex flex-col bg-slate-800/70 backdrop-blur-sm rounded-2xl p-1 sm:p-4 shadow-2xl border border-slate-700">
            {/* Chat Header with Controls */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-slate-200">Cybersecurity Analysis</h2>
              <div className="flex items-center gap-3">
                {/* Stop Button */}
                {loading && (
                  <button
                    onClick={handleStopStreaming}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all"
                    title="Stop response generation"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-2 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm flex-1">{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6">
              {messages.map((msg) => (
                <StreamingChatMessage 
                  key={msg.id || msg.text} 
                  message={msg} 
                  isStreaming={msg.isStreaming || false}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 sm:p-4 border-t border-slate-700">
              {/* Message complexity indicator */}
              {input.trim() && (
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <span>Message type:</span>
                  <span className={`px-2 py-1 rounded-full ${
                    getMessageComplexity(input) === 'casual' 
                      ? 'bg-green-500/20 text-green-300'
                      : getMessageComplexity(input) === 'simple'
                      ? 'bg-blue-500/20 text-blue-300'
                      : getMessageComplexity(input) === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {getMessageComplexity(input)}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span>{input.split(' ').length} words</span>
                </div>
              )}
              
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-xl px-4 py-3 pr-20 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  placeholder={getPlaceholderText(messages.length > 0, loading)}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !loading) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                    loading || !input.trim()
                      ? "bg-slate-600 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md shadow-blue-500/30"
                  }`}
                  title="Send Message"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <CornerDownLeft className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
