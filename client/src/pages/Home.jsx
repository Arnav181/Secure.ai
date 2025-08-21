import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation, useScrollProgress } from "../hooks/useScrollAnimation";

// Homepage content configuration
const homepageConfig = {
  hero: {
    headline: "Comprehensive Cybersecurity Laws Documentation Platform",
    description: "Navigate complex cybersecurity regulations with AI-powered assistance and access comprehensive legal documentation for informed compliance decisions.",
    primaryCTA: "Explore Laws Database",
    secondaryCTA: "Try AI Assistant"
  },
  features: [
    {
      id: "laws-browser",
      title: "Laws Documentation Browser",
      description: "Access comprehensive cybersecurity laws and regulations from multiple jurisdictions with advanced search and filtering capabilities.",
      icon: "⚖️",
      link: "/laws"
    },
    {
      id: "ai-chat",
      title: "AI-Powered Legal Chat Assistant",
      description: "Get instant guidance on cybersecurity legal questions with our intelligent assistant trained on current regulations.",
      icon: "🤖",
      link: "/chat"
    },
    {
      id: "search-filter",
      title: "Advanced Search and Filtering",
      description: "Find specific regulations quickly with powerful search tools and intelligent filtering by jurisdiction, topic, and compliance requirements.",
      icon: "🔍",
      link: "/laws?search=true"
    },
    {
      id: "compliance-guidance",
      title: "Legal Compliance Guidance",
      description: "Receive personalized compliance recommendations and stay updated with the latest regulatory changes affecting your organization.",
      icon: "📋",
      link: "/compliance"
    }
  ],
  credibility: {
    dataSources: ["Government Legal Databases", "Official Regulatory Bodies", "Legal Expert Reviews"],
    coverage: "50+ jurisdictions worldwide",
    updateFrequency: "Daily updates from official sources",
    reliability: "99.9% uptime guarantee"
  }
};

// Navigation configuration
const navigationConfig = {
  primaryFeatures: [
    { name: "Browse Laws", path: "/laws", icon: "⚖️", description: "Explore comprehensive legal database" },
    { name: "AI Chat Assistant", path: "/chat", icon: "🤖", description: "Get instant legal guidance" },
    { name: "Search & Filter", path: "/laws?search=true", icon: "🔍", description: "Find specific regulations" },
    { name: "Compliance Tools", path: "/compliance", icon: "📋", description: "Stay compliant with ease" }
  ]
};

// Loading component for better UX
const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-slate-600 border-t-blue-500 ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Section loading skeleton
const SectionSkeleton = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
      <div className="h-8 bg-slate-700/50 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-slate-700/50 rounded w-1/2 mx-auto"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-700/30 rounded-lg h-48"></div>
        ))}
      </div>
    </div>
  </div>
);

// Performance monitoring hook
const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor page load performance
    const startTime = performance.now();
    
    const checkLoadTime = () => {
      const loadTime = performance.now() - startTime;
      if (loadTime > 2000) {
        console.warn(`Homepage load time exceeded 2 seconds: ${loadTime.toFixed(2)}ms`);
      } else {
        console.log(`Homepage loaded in: ${loadTime.toFixed(2)}ms`);
      }
    };

    // Check when all content is loaded
    if (document.readyState === 'complete') {
      checkLoadTime();
    } else {
      window.addEventListener('load', checkLoadTime);
      return () => window.removeEventListener('load', checkLoadTime);
    }
  }, []);
};

// Image optimization utilities for future use
const optimizeImage = (src, width, height) => {
  // Placeholder for future image optimization
  return {
    src,
    srcSet: `${src} 1x, ${src} 2x`,
    loading: 'lazy',
    width,
    height,
    style: { aspectRatio: `${width}/${height}` }
  };
};

// Preload critical resources
const preloadCriticalResources = () => {
  useEffect(() => {
    // Preload critical fonts or images if needed
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    // Add font preloading if using custom fonts
    
    return () => {
      // Cleanup if needed
    };
  }, []);
};

// Lazy loading hook for sections
const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsVisible(true);
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, isLoaded]);

  return { isVisible, isLoaded, elementRef };
};

// Section placeholder components
const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNavigation = useCallback(async (path) => {
    setIsNavigating(true);
    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 150));
    navigate(path);
  }, [navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] animate-pulse"></div>
        <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block animate-text-shimmer bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-[length:200%_100%] bg-clip-text text-transparent">
              {homepageConfig.hero.headline}
            </span>
          </h1>
          <p className={`text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {homepageConfig.hero.description}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button 
              onClick={() => handleNavigation("/laws")}
              disabled={isNavigating}
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:from-blue-700 active:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-blue-500/25 relative overflow-hidden touch-manipulation"
            >
              {isNavigating ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <span className="relative z-10">{homepageConfig.hero.primaryCTA}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button 
              onClick={() => handleNavigation("/chat")}
              disabled={isNavigating}
              className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-slate-600 hover:border-blue-400 active:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden backdrop-blur-sm touch-manipulation"
            >
              {isNavigating ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">{homepageConfig.hero.secondaryCTA}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Floating elements - Hidden on mobile for better performance and UX */}
      <div className="hidden lg:block absolute top-20 left-20 animate-float">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">AI Assistant Active</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute top-40 right-20 animate-float-delayed">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚖️</span>
            <span className="text-sm text-slate-300">Legal Database</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const { isVisible, isLoaded, elementRef } = useLazyLoading(0.2);

  const handleFeatureClick = useCallback(async (link) => {
    setIsNavigating(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    navigate(link);
  }, [navigate]);

  // Memoize features to prevent unnecessary re-renders
  const memoizedFeatures = useMemo(() => homepageConfig.features, []);

  return (
    <section ref={elementRef} className="min-h-screen flex items-center justify-center bg-slate-800/50 relative overflow-hidden">
      {/* Animated background grid - only render when visible */}
      {isVisible && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move"></div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_100%]">
            Platform Features
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4 sm:px-0 animate-fade-in-up">
            Comprehensive tools for navigating cybersecurity law compliance
          </p>
        </div>
        {!isLoaded ? (
          <SectionSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {memoizedFeatures.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`relative group p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer animate-slide-up touch-manipulation`}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => !isNavigating && handleFeatureClick(feature.link)}
            >
              <div className={`text-4xl mb-4 transition-all duration-300 ${hoveredCard === feature.id ? 'scale-110' : ''}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors duration-300 relative z-10">
                {feature.title}
              </h3>
              <p className="text-slate-300 mb-4 group-hover:text-slate-200 transition-colors duration-300 relative z-10">
                {feature.description}
              </p>
              <div className="text-blue-400 hover:text-blue-300 cursor-pointer flex items-center group-hover:translate-x-2 transition-transform duration-300 relative z-10">
                {isNavigating ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    Learn more 
                    <span className="ml-1 group-hover:animate-pulse">→</span>
                  </>
                )}
              </div>
              
              {/* Hover effect overlay - positioned behind content */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

const OverviewSection = () => {
  const { isVisible: isInView, isLoaded, elementRef } = useLazyLoading(0.3);

  return (
    <section ref={elementRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_100%]">
              About Our Platform
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mb-4 sm:mb-6 hover:text-slate-200 transition-colors duration-300">
              Our cybersecurity laws documentation platform serves legal professionals, compliance officers, and students by providing comprehensive access to current regulations and AI-powered guidance.
            </p>
            <p className="text-base sm:text-lg text-slate-300 hover:text-slate-200 transition-colors duration-300">
              Stay informed, stay compliant, and make confident legal decisions with our trusted platform.
            </p>
          </div>
          <div className={`group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-purple-500/20 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">
              Target Audience
            </h3>
            <ul className="space-y-3 text-slate-300">
              {[
                "Legal professionals specializing in cybersecurity",
                "Compliance officers and risk managers", 
                "Law students and researchers",
                "Organizations seeking regulatory guidance"
              ].map((item, index) => (
                <li 
                  key={index}
                  className={`flex items-center hover:text-blue-300 transition-all duration-300 hover:translate-x-2 ${isInView ? 'animate-slide-in-right' : ''}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <span className="text-blue-400 mr-3 group-hover:animate-pulse">•</span>
                  {item}
                </li>
              ))}
            </ul>
            
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CredibilitySection = () => {
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { icon: "🏛️", title: "Official Sources", value: 25, suffix: "+", description: homepageConfig.credibility.dataSources.join(", ") },
    { icon: "🌍", title: "Global Coverage", value: 50, suffix: "+", description: "jurisdictions worldwide" },
    { icon: "🔄", title: "Daily Updates", value: 100, suffix: "%", description: "from official sources" },
    { icon: "⚡", title: "Uptime", value: 99.9, suffix: "%", description: "reliability guarantee" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Animate counters
          stats.forEach((stat, index) => {
            let current = 0;
            const increment = stat.value / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounters(prev => {
                const newCounters = [...prev];
                newCounters[index] = current;
                return newCounters;
              });
            }, 30);
          });
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('credibility-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section id="credibility-section" className="min-h-screen flex items-center justify-center bg-slate-800/50 relative overflow-hidden">
      {/* Animated background waves */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-shift"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_100%]">
            Trusted & Reliable
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4 sm:px-0 animate-fade-in-up">
            Our platform is built on authoritative sources and maintained with the highest standards
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`group text-center p-4 sm:p-6 bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all duration-500 transform hover:scale-110 active:scale-95 hover:rotate-2 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer touch-manipulation ${isVisible ? 'animate-slide-up' : ''}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:animate-bounce group-hover:scale-125 transition-all duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors duration-300">
                <span className="tabular-nums">
                  {stat.value % 1 === 0 ? Math.floor(counters[index]) : counters[index].toFixed(1)}
                </span>
                <span className="text-blue-400">{stat.suffix}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors duration-300">
                {stat.title}
              </h3>
              <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-300">
                {stat.description}
              </p>
              
              {/* Animated progress bar */}
              <div className="mt-4 w-full bg-slate-700 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: isVisible ? '100%' : '0%', transitionDelay: `${index * 200}ms` }}
                ></div>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NavigationSection = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const { isVisible, isLoaded, elementRef } = useLazyLoading(0.2);

  const handleNavigation = useCallback(async (path) => {
    setIsNavigating(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    navigate(path);
  }, [navigate]);

  // Memoize navigation features
  const memoizedFeatures = useMemo(() => navigationConfig.primaryFeatures, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Interactive background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_100%]">
            Quick Access
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4 sm:px-0 animate-fade-in-up">
            Jump directly to the tools you need
          </p>
        </div>
        {!isLoaded ? (
          <SectionSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {memoizedFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl transition-all duration-200 transform cursor-pointer overflow-hidden touch-manipulation ${
                activeCard === index 
                  ? 'scale-105 sm:scale-110 rotate-1 sm:rotate-3 border-blue-500 shadow-2xl shadow-blue-500/30' 
                  : 'hover:scale-105 active:scale-95 hover:rotate-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20'
              } animate-slide-up`}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={() => !isNavigating && handleNavigation(feature.path)}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 transition-opacity duration-500 ${
                activeCard === index ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
              {/* Animated border */}
              <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                activeCard === index ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[1px] animate-spin-slow">
                  <div className="w-full h-full bg-slate-900/50 rounded-xl"></div>
                </div>
              </div>

              <div className="relative z-10">
                <div className={`text-3xl mb-4 transition-all duration-300 ${
                  activeCard === index 
                    ? 'animate-bounce scale-125 filter drop-shadow-lg' 
                    : 'group-hover:scale-110'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  activeCard === index 
                    ? 'text-blue-300' 
                    : 'text-white group-hover:text-blue-300'
                }`}>
                  {feature.name}
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  activeCard === index 
                    ? 'text-slate-200' 
                    : 'text-slate-300 group-hover:text-slate-200'
                }`}>
                  {feature.description}
                </p>
                
                {/* Animated arrow */}
                <div className={`mt-4 flex items-center text-blue-400 transition-all duration-300 ${
                  activeCard === index 
                    ? 'translate-x-2 text-blue-300' 
                    : 'group-hover:translate-x-1'
                }`}>
                  <span className="text-sm font-medium">Access Now</span>
                  <span className={`ml-2 transition-transform duration-300 ${
                    activeCard === index ? 'animate-pulse' : ''
                  }`}>→</span>
                </div>
              </div>

              {/* Particle effects */}
              {activeCard === index && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleFooterNavigation = (href) => {
    // Handle external links
    if (href.startsWith('http') || href.startsWith('mailto:')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      // Handle internal navigation
      navigate(href);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/90"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-1 group">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_100%] group-hover:scale-105 transition-transform duration-300">
              Secure.ai
            </h3>
            <p className="text-slate-400 mb-4 group-hover:text-slate-300 transition-colors duration-300">
              Comprehensive cybersecurity laws documentation platform
            </p>
            
            {/* Contact Information */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-300">
                <span className="text-sm">📧</span>
                <span className="ml-2 text-sm">support@secure.ai</span>
              </div>
              <div className="flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-300">
                <span className="text-sm">🌐</span>
                <span className="ml-2 text-sm">24/7 Support Available</span>
              </div>
            </div>
            
            {/* Social links with hover effects */}
            <div className="flex space-x-4">
              {[
                { icon: 'T', name: 'Twitter', url: 'https://twitter.com/secureai' },
                { icon: 'L', name: 'LinkedIn', url: 'https://linkedin.com/company/secureai' },
                { icon: 'G', name: 'GitHub', url: 'https://github.com/secureai' }
              ].map((social, index) => (
                <button
                  key={social.icon}
                  onClick={() => handleFooterNavigation(social.url)}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-12 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  title={social.name}
                >
                  <span className="text-sm font-semibold">{social.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {[
            {
              title: "Platform",
              links: [
                { name: "Laws Database", href: "/laws" },
                { name: "AI Assistant", href: "/chat" },
                { name: "Search Tools", href: "/laws?search=true" }
              ]
            },
            {
              title: "Support", 
              links: [
                { name: "Contact Us", href: "mailto:support@secure.ai" },
                { name: "Help Center", href: "/help" },
                { name: "Documentation", href: "/docs" },
                { name: "Status", href: "https://status.secure.ai" }
              ]
            },
            {
              title: "Legal",
              links: [
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookie Policy", href: "/cookies" },
                { name: "Compliance", href: "/compliance" }
              ]
            }
          ].map((section, sectionIndex) => (
            <div key={section.title} className="animate-slide-up" style={{ animationDelay: `${(sectionIndex + 1) * 200}ms` }}>
              <h4 className="text-white font-semibold mb-4 hover:text-blue-300 transition-colors duration-300 cursor-default">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={link.name}>
                    <button 
                      onClick={() => handleFooterNavigation(link.href)}
                      className={`text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block relative cursor-pointer text-left ${
                        hoveredLink === `${sectionIndex}-${linkIndex}` ? 'text-blue-300' : ''
                      }`}
                      onMouseEnter={() => setHoveredLink(`${sectionIndex}-${linkIndex}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.name}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform origin-left transition-transform duration-300 ${
                        hoveredLink === `${sectionIndex}-${linkIndex}` ? 'scale-x-100' : 'scale-x-0'
                      }`}></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center animate-fade-in-up">
          <p className="text-slate-400 hover:text-slate-300 transition-colors duration-300">
            © 2025 Secure.ai. All rights reserved. | 
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ml-1">
              Cybersecurity Laws Documentation Platform
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  const scrollProgress = useScrollProgress();
  
  // Monitor performance
  usePerformanceMonitoring();
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Main homepage container with responsive layout */}
      <div className="w-full">
        <HeroSection />
        <Suspense fallback={<SectionSkeleton className="min-h-screen" />}>
          <FeaturesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton className="min-h-screen" />}>
          <OverviewSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton className="min-h-screen" />}>
          <CredibilitySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton className="min-h-screen" />}>
          <NavigationSection />
        </Suspense>
        <Footer />
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes text-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-text-shimmer {
          animation: text-shimmer 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }

        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Performance optimizations */
        * {
          /* Enable hardware acceleration for better performance */
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Optimize animations for better performance */
        .animate-float,
        .animate-float-delayed,
        .animate-spin-slow {
          will-change: transform;
        }

        .animate-text-shimmer {
          will-change: background-position;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          /* Reduce animation intensity on mobile for better performance */
          .animate-float,
          .animate-float-delayed {
            animation-duration: 8s;
          }
          
          .animate-spin-slow {
            animation-duration: 30s;
          }
          
          /* Reduce blur effects on mobile */
          .blur-3xl {
            filter: blur(20px);
          }
          
          /* Ensure touch targets are at least 44px */
          button, .cursor-pointer {
            min-height: 44px;
            min-width: 44px;
          }

          /* Disable expensive effects on mobile */
          .backdrop-blur-sm {
            backdrop-filter: none;
            background-color: rgba(15, 23, 42, 0.8);
          }
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Custom scrollbar - hidden on mobile for better UX */
        @media (min-width: 768px) {
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #1e293b;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #7c3aed);
          }
        }

        /* Mobile viewport optimization */
        @media (max-width: 767px) {
          ::-webkit-scrollbar {
            display: none;
          }
          
          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;