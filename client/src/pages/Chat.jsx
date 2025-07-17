import React, { useState } from 'react';
import { UploadCloud, Send, Loader2 } from 'lucide-react';

const Chat = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponse('');
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setResponse('');

    // Simulate LLM response for now (replace with actual API call)
    setTimeout(() => {
      setResponse(
        `The uploaded file "${file.name}" can be improved by:\n` +
        '- Adding comments for better readability.\n' +
        '- Refactoring large functions into smaller ones.\n' +
        '- Ensuring consistent naming conventions.\n' +
        '- Adding error handling and validation.\n' +
        '- Optimizing performance-critical sections.'
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        AI File Improvement Chat
      </h1>

      <div className="w-full max-w-3xl bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-8 cursor-pointer hover:border-blue-500 transition-colors"
        >
          <UploadCloud className="w-12 h-12 text-blue-400 mb-4" />
          <span className="text-slate-300">
            {file ? file.name : 'Click to upload your file'}
          </span>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all transform ${
            file && !loading
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:scale-105'
              : 'bg-slate-700 cursor-not-allowed opacity-50'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Analyze File</span>
            </>
          )}
        </button>

        {response && (
          <div className="mt-8 bg-slate-700 rounded-lg p-4 whitespace-pre-line text-slate-200 shadow-inner">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};


export default Chat;
