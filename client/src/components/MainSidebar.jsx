import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Menu,
    X,
    Newspaper,
    Scale,
    MessageSquare,
    Info,
    Mail,
    LogOut,
    Home
} from "lucide-react";

const MainSidebar = ({ isOpen, onToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navigationItems = [
        {
            name: "Home",
            icon: Home,
            path: "/",
            description: "Go to homepage"
        },
        {
            name: "Updates & News",
            icon: Newspaper,
            path: "/updates",
            description: "Latest cybersecurity updates"
        },
        {
            name: "Laws",
            icon: Scale,
            path: "/laws",
            description: "Cybersecurity laws documentation"
        },
        {
            name: "Codebase Analysis",
            icon: MessageSquare,
            path: "/chat",
            description: "AI-powered code analysis"
        },
        {
            name: "About Us",
            icon: Info,
            path: "/about",
            description: "Learn more about Secure.ai"
        },
        {
            name: "Contact Us",
            icon: Mail,
            path: "/contact",
            description: "Get in touch with us"
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
            onToggle();
        }
    };

    const handleLogout = () => {
        // TODO: Implement actual logout logic
        console.log("Logout functionality to be implemented");
        // For now, navigate to home
        navigate("/");
    };

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Sidebar Toggle Button */}
            <button
                onClick={onToggle}
                className="fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800/90 hover:bg-slate-700 transition-all duration-200 shadow-lg backdrop-blur-sm border border-slate-600"
                title={isOpen ? "Close Sidebar" : "Open Sidebar"}
                aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
            >
                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? (
                        <X className="w-6 h-6 text-slate-300" />
                    ) : (
                        <Menu className="w-6 h-6 text-slate-300" />
                    )}
                </div>
            </button>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            {/* Main Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-slate-800/95 backdrop-blur-sm border-r-2 border-slate-600 z-40 transition-transform duration-300 ease-in-out ${isOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                    } w-80 lg:w-72`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-6 pt-20 border-b border-slate-700">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-xl">Secure.ai</h1>
                            <p className="text-slate-400 text-sm">Cybersecurity Platform</p>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActivePath(item.path);

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${isActive
                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                    title={item.description}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{item.name}</div>
                                        <div className="text-xs text-slate-500 truncate">{item.description}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout Section */}
                    <div className="p-4 border-t border-slate-700">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
                            title="Sign out of your account"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-red-400" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainSidebar;