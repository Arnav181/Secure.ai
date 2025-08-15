import React from "react";
import { Menu, X } from "lucide-react";
import NewChatButton from "./NewChatButton";
import BackToHomeButton from "./BackToHomeButton";
import ChatHistorySection from "./ChatHistorySection";

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  onBackToHome, 
  chatHistory = [] 
}) => {
  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-6 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700/80 hover:bg-slate-700 transition-all duration-200 shadow-md backdrop-blur-sm border border-slate-600"
        title={isOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? (
            <X className="w-5 h-5 text-slate-300" />
          ) : (
            <Menu className="w-5 h-5 text-slate-300" />
          )}
        </div>
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 z-40 transition-transform duration-300 ease-in-out ${
          isOpen 
            ? 'translate-x-0' 
            : '-translate-x-full'
        } w-80 lg:w-72`}
      >
        <div className="flex flex-col h-full pt-20 pb-6">
          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-2">
            <NewChatButton onClick={onNewChat} />
            <BackToHomeButton onClick={onBackToHome} />
            <ChatHistorySection chatHistory={chatHistory} />
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;