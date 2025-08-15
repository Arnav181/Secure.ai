import React from "react";
import { MessageSquarePlus } from "lucide-react";

const NewChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700 hover:text-blue-400 transition-colors duration-200 group"
      title="Start New Chat"
    >
      <MessageSquarePlus className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
      <span className="font-medium">New Chat</span>
    </button>
  );
};

export default NewChatButton;