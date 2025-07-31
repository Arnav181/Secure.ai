import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, Send, Loader2, MessageSquarePlus, Bot, User, CornerDownLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

// This component handles rendering individual chat messages with Markdown and syntax highlighting.
const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  // Custom renderer for code blocks to apply syntax highlighting
  const CodeBlock = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-700 flex items-center justify-center">
          <Bot className="w-5 h-5 text-blue-400" />
        </div>
      )}
      <div
        className={`rounded-xl px-4 py-3 max-w-[80%] prose prose-invert prose-sm ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-slate-700/80 text-slate-200'
        }`}
      >
        <ReactMarkdown
            components={CodeBlock}
            remarkPlugins={[remarkGfm]}
        >
            {message.text}
        </ReactMarkdown>
      </div>
       {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-700 flex items-center justify-center">
          <User className="w-5 h-5 text-slate-300" />
        </div>
      )}
    </div>
  );
};


const Chat = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("upload");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mode === "chat") {
      scrollToBottom();
    }
  }, [messages, mode]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
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

  // Handles the initial file analysis
  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("zipfile", file);

    try {
      const response = await fetch("http://localhost:8080/chat/codebase", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      setMessages([
          { 
            sender: "llm", 
            text: data.suggestions || "Here are some suggestions for your codebase."
          }
        ]);
      setMode("chat");
    } catch (err) {
      console.error("Error in sending file", err);
      setMessages([
        { sender: "llm", text: "File analysis failed. Please check the console and try again." },
      ]);
      setMode("chat");
    } finally {
      setLoading(false);
    }
  };

  // Handles sending a new message in the chat
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "llm",
          text: data.reply || "Sorry, I couldn't get a reply.",
        },
      ]);
    } catch (err) {
      console.error("Chat failed:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "llm", text: "Sorry, I couldn't process your request. Please check the console." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center font-sans p-4 relative">
      
      {/* New Chat Button */}
      <button 
        onClick={handleNewChat}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 transition-colors shadow-md backdrop-blur-sm border border-slate-600"
        title="Start New Chat"
      >
        <MessageSquarePlus className="w-5 h-5 text-blue-400" />
        <span className="hidden sm:inline">New Chat</span>
      </button>

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
                        className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-xl p-10 cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-colors"
                    >
                        <UploadCloud className="w-14 h-14 text-blue-400 mb-4" />
                        <span className="text-slate-300 font-medium text-lg">
                        {file ? file.name : "Click to upload your .zip file"}
                        </span>
                        <span className="text-slate-500 text-sm mt-1">Max file size: 50MB</span>
                        <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".zip,application/zip"
                        onChange={handleFileChange}
                        />
                    </label>

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
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 sm:p-4 border-t border-slate-700">
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-xl px-4 py-3 pr-20 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  placeholder="Ask a follow-up question..."
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
  );
};

export default Chat;