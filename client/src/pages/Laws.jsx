import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import LawsList from "../components/LawsList";
import ChatbotToggle from "../components/ChatbotToggle";
import Chatbot from "../components/Chatbot";
import ChatInterface from "../components/ChatInterface";
import { lawsData } from "../data/lawsData";

/**
 * LawsPage Component - Main page for cybersecurity laws documentation
 * 
 * Features:
 * - Professional heading and layout
 * - Real-time search functionality
 * - Structured law display with MainSidebar integration
 * - State management for search and filtered laws
 * - Responsive design for all devices
 */
const Laws = () => {
  // State management for search and filtered laws
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLaws, setFilteredLaws] = useState(lawsData);
  const [isSearching, setIsSearching] = useState(false);
  
  // State management for chatbot
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Handle search functionality with real-time filtering
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);

    // Filter laws based on search query
    if (!query.trim()) {
      setFilteredLaws(lawsData);
    } else {
      const filtered = lawsData.filter(law =>
        law.act.toLowerCase().includes(query.toLowerCase()) ||
        law.section.toLowerCase().includes(query.toLowerCase()) ||
        law.theory.toLowerCase().includes(query.toLowerCase()) ||
        law.keywords.some(keyword =>
          keyword.toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredLaws(filtered);
    }

    setIsSearching(false);
  };

  // Initialize filtered laws on component mount
  useEffect(() => {
    setFilteredLaws(lawsData);
  }, []);

  // Handle chatbot toggle
  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  // Handle chatbot close
  const handleChatbotClose = () => {
    setIsChatbotOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Professional Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Cybersecurity Laws in India
            </h1>
            <p className="text-slate-400 text-lg">
              Comprehensive documentation of Indian cybersecurity laws and regulations
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search cybersecurity laws by act, section, or content..."
              className="w-full max-w-2xl mx-0"
            />
          </div>

          {/* Search Status */}
          {isSearching && (
            <div className="mb-6 text-center">
              <div className="text-blue-400 text-sm">
                Searching...
              </div>
            </div>
          )}

          {/* Laws Display Section */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
            <LawsList
              laws={filteredLaws}
              isLoading={isSearching}
              searchQuery={searchQuery}
              emptyMessage={
                searchQuery
                  ? `No laws found matching "${searchQuery}". Try different keywords or browse all laws.`
                  : "No cybersecurity laws available at the moment."
              }
              className="min-h-[400px]"
            />
          </div>

          {/* Footer Information */}
          <div className="mt-8 text-center text-slate-500 text-sm">
            <p>
              Laws are stored locally for quick access. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <ChatbotToggle
        isOpen={isChatbotOpen}
        onToggle={handleChatbotToggle}
      />

      {/* Chatbot Interface */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={handleChatbotClose}
      >
        <ChatInterface />
      </Chatbot>
    </div>
  );
};

export default Laws;