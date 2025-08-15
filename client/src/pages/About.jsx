import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About Us
          </h1>
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
            <p className="text-slate-300 text-lg mb-4">
              Secure.ai is a comprehensive cybersecurity platform designed to help organizations
              and individuals understand and implement cybersecurity best practices.
            </p>
            <p className="text-slate-300 text-lg">
              Our platform combines AI-powered code analysis with comprehensive legal documentation
              to provide a complete cybersecurity solution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;