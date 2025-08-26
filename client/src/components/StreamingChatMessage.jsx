import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check, AlertTriangle, Info, CheckCircle, Zap } from 'lucide-react';
import '../styles/markdown.css';

const StreamingChatMessage = ({ message, isStreaming = false }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  // Enhanced markdown components with better styling
  const MarkdownComponents = {
    // Code blocks with syntax highlighting
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative group">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="rounded-lg !bg-slate-800 !p-4 !m-0"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <button
            onClick={() => copyToClipboard(String(children))}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-slate-700 hover:bg-slate-600"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      ) : (
        <code className="bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300" {...props}>
          {children}
        </code>
      );
    },

    // Enhanced headers with better styling
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-blue-300 mb-4 pb-2 border-b border-slate-600">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-green-300 mb-3 mt-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium text-yellow-300 mb-2 mt-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-medium text-purple-300 mb-2 mt-3">
        {children}
      </h4>
    ),

    // Enhanced lists
    ul: ({ children }) => (
      <ul className="list-none space-y-1 ml-4 my-3">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 ml-4 my-3 text-slate-200">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="flex items-start gap-2 text-slate-200">
        <span className="text-blue-400 mt-1.5 text-xs">•</span>
        <span className="flex-1">{children}</span>
      </li>
    ),

    // Enhanced blockquotes for callouts with icons
    blockquote: ({ children }) => {
      const content = String(children);
      let icon = <Info className="w-5 h-5" />;
      let borderColor = 'border-blue-500';
      let bgColor = 'bg-blue-500/10';
      let iconColor = 'text-blue-400';

      if (content.includes('🚨') || content.includes('Critical')) {
        icon = <AlertTriangle className="w-5 h-5" />;
        borderColor = 'border-red-500';
        bgColor = 'bg-red-500/10';
        iconColor = 'text-red-400';
      } else if (content.includes('⚠️') || content.includes('Warning')) {
        icon = <AlertTriangle className="w-5 h-5" />;
        borderColor = 'border-yellow-500';
        bgColor = 'bg-yellow-500/10';
        iconColor = 'text-yellow-400';
      } else if (content.includes('✅') || content.includes('Best Practice')) {
        icon = <CheckCircle className="w-5 h-5" />;
        borderColor = 'border-green-500';
        bgColor = 'bg-green-500/10';
        iconColor = 'text-green-400';
      } else if (content.includes('🔹') || content.includes('Key Point')) {
        icon = <Zap className="w-5 h-5" />;
        borderColor = 'border-purple-500';
        bgColor = 'bg-purple-500/10';
        iconColor = 'text-purple-400';
      }

      return (
        <div className={`border-l-4 ${borderColor} ${bgColor} p-4 my-4 rounded-r-lg flex gap-3`}>
          <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
            {icon}
          </div>
          <div className="text-slate-200 flex-1">{children}</div>
        </div>
      );
    },

    // Enhanced tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-slate-600 rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-700">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left text-slate-200 font-semibold border-b border-slate-600">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-slate-300 border-b border-slate-700">
        {children}
      </td>
    ),

    // Enhanced paragraphs
    p: ({ children }) => (
      <p className="text-slate-200 leading-relaxed mb-3">
        {children}
      </p>
    ),

    // Enhanced strong and emphasis
    strong: ({ children }) => (
      <strong className="font-semibold text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-slate-300">
        {children}
      </em>
    ),
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyMessage = async () => {
    await copyToClipboard(message.text);
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'} group`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div
        className={`rounded-xl px-4 py-3 max-w-[85%] relative ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg'
            : 'bg-slate-800/90 backdrop-blur-sm text-slate-200 border border-slate-700/50 shadow-xl'
        }`}
      >
        {/* Copy button for bot messages */}
        {!isUser && (
          <button
            onClick={copyMessage}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600/80"
            title="Copy message"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
          </button>
        )}

        {/* Streaming indicator */}
        {isStreaming && !isUser && (
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}

        <div className={`prose prose-invert prose-sm max-w-none markdown-content ${isUser ? 'prose-blue' : ''}`}>
          <ReactMarkdown
            components={MarkdownComponents}
            remarkPlugins={[remarkGfm]}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Cursor for streaming */}
        {isStreaming && !isUser && (
          <span className="inline-block w-2 h-5 bg-blue-400 animate-pulse ml-1"></span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-slate-300" />
        </div>
      )}
    </div>
  );
};

export default StreamingChatMessage;