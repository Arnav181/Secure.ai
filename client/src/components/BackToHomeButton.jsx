import React from "react";
import { Home } from "lucide-react";

const BackToHomeButton = ({ onClick, disabled = false }) => {
  const handleClick = () => {
    if (disabled) {
      // Show placeholder behavior when no router is available
      console.log("Home navigation not available - router not configured");
      return;
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
        disabled 
          ? 'text-slate-500 cursor-not-allowed opacity-60' 
          : 'text-slate-200 hover:bg-slate-700 hover:text-blue-400'
      }`}
      title={disabled ? "Home navigation unavailable" : "Back to Home"}
      disabled={disabled}
    >
      <Home className={`w-5 h-5 ${
        disabled 
          ? 'text-slate-500' 
          : 'text-blue-400 group-hover:text-blue-300'
      }`} />
      <span className="font-medium">Back to Home</span>
    </button>
  );
};

export default BackToHomeButton;