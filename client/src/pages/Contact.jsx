import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
            <p className="text-slate-300 text-lg mb-6">
              Get in touch with our team for support, questions, or feedback.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                <p className="text-slate-300">contact@secure.ai</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Support</h3>
                <p className="text-slate-300">support@secure.ai</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;