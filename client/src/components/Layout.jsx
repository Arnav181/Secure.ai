import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import MainSidebar from "./MainSidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const showMainSidebar = location.pathname !== "/chat" && location.pathname !== "/landing" && location.pathname !== "/signup" && location.pathname !== "/login";
  
  console.log("Layout: Current pathname:", location.pathname);
  console.log("Layout: Show main sidebar:", showMainSidebar);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!showMainSidebar) {
    console.log("Layout: Rendering children without sidebar");
    return <>{children}</>;
  }

  console.log("Layout: Rendering with sidebar");
  return (
    <div className="min-h-screen bg-slate-900">
      <MainSidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
      
      {/* Main Content - Only add margin when sidebar is open on large screens */}
      <div className={`min-h-screen transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-72' : 'ml-0'
      }`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;