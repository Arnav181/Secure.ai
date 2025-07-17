import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Shield,
  Code,
  Users,
  Zap,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Star,
} from "lucide-react";

const SecureAiLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-slate-900 text-white overflow-hidden">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-sm shadow-xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Secure.ai
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                onClick={() => scrollToSection("home")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={() => scrollToSection("services")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={() => scrollToSection("about")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                About
              </a>
              <button className="px-4 py-2 text-slate-300 hover:text-white transition-colors">
                Sign In
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105">
                Sign Up
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#home"
                onClick={() => scrollToSection("home")}
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={() => scrollToSection("services")}
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={() => scrollToSection("about")}
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
              >
                About
              </a>
              <div className="pt-4 pb-3 border-t border-slate-700">
                <button className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white transition-colors">
                  Sign In
                </button>
                <button className="block w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition-all">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.05)_50%,transparent_100%)] animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Secure.ai
              <span className="block text-4xl md:text-6xl mt-2">
                Security Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive cybersecurity platform for students and
              professionals. Analyze projects, stay compliant with laws, and get
              AI-powered security guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/25 flex items-center space-x-2">
                <span>Start Free Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-slate-600 hover:border-slate-400 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 backdrop-blur-sm">
                Try AI Assistant
              </button>
            </div>
          </div>

          <div className="absolute top-1 left-10 animate-float">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">
                  AI Assistant Active
                </span>
              </div>
            </div>
          </div>

          <div className="absolute top-65 left-150 animate-float-delayed">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Threat Detection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We provide comprehensive cybersecurity solutions for students,
              developers, and organizations. Our platform combines automated
              security analysis, legal compliance guidance, and AI-powered
              assistance to help you build secure applications and respond to
              cyber threats effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🔍",
                title: "Project Security Analysis",
                description:
                  "Upload your small-scale projects and get detailed cybersecurity vulnerability assessments with enhancement recommendations.",
              },
              {
                icon: "⚖️",
                title: "Legal Compliance Hub",
                description:
                  "Access comprehensive documentation on cybersecurity laws, regulations, and compliance requirements in your country.",
              },
              {
                icon: "🤖",
                title: "AI Security Assistant",
                description:
                  "Get instant guidance on cybersecurity incidents, scam responses, and attack mitigation strategies through our intelligent chatbot.",
              },
              {
                icon: "📚",
                title: "Security Education",
                description:
                  "Learn cybersecurity fundamentals through interactive content, tutorials, and personalized learning paths.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-2xl">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {service.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Us
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              At Secure.ai, we believe cybersecurity should be accessible to
              everyone. Our mission is to democratize cybersecurity knowledge
              and tools, helping students and professionals build secure
              applications while staying informed about the latest threats and
              compliance requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎯",
                title: "Our Mission",
                description:
                  "To make cybersecurity accessible to students and professionals through automated analysis, comprehensive legal guidance, and intelligent assistance.",
              },
              {
                icon: "👥",
                title: "Our Team",
                description:
                  "Cybersecurity experts, legal professionals, and AI specialists working together to create the most comprehensive security education platform.",
              },
              {
                icon: "🔮",
                title: "Our Vision",
                description:
                  "To build a safer digital world by empowering the next generation of developers with cybersecurity knowledge and practical tools.",
              },
              {
                icon: "💡",
                title: "Innovation",
                description:
                  "Combining cutting-edge AI technology with practical cybersecurity expertise to provide real-time guidance and educational resources.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Ready to Secure Your Projects?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join students and professionals using Secure.ai to build secure
            applications and stay protected from cyber threats.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl">
              Sign Up Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Secure.ai
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                The comprehensive platform for cybersecurity education, project
                analysis, and threat response.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors">
                  <span className="text-xs">T</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors">
                  <span className="text-xs">L</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors">
                  <span className="text-xs">G</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2025 Secure.ai. All rights reserved. | Empowering secure
              development and cybersecurity education.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default SecureAiLanding;
