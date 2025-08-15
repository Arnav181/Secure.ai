import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import MainSidebar from "./MainSidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Don't show MainSidebar on Chat page - it has its own sidebar
  const showMainSidebar = location.pathname !== "/chat";

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!showMainSidebar) {
    // For Chat page, render without MainSidebar
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <MainSidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-72' : 'ml-0'
      }`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;