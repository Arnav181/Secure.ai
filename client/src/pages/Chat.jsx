import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { UploadCloud, Send, Loader2 } from "lucide-react";

const Chat = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("upload");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mode === "chat") {
      scrollToBottom();
    }
  }, [messages, mode]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("zipfile", file);
      const response = await axios.post(
        "http://localhost:8080/chat/codebase",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessages([{ sender: "llm", text: response.data.suggestions }]);
      setMode("chat");
    } catch (err) {
      console.log("Error in sending file", err);
      setLoading(false);
      setMessages([
        { sender: "llm", text: "File analysis failed. Please try again." },
      ]);
      setMode("chat");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/chat/codebase", {
        message: input.trim(),
      });
      setMessages((prev) => [
        ...prev,
        {
          sender: "llm",
          text: response.data.suggestions || response.data.response,
        },
      ]);
    } catch (err) {
      console.error("Chat failed:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "llm", text: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        AI File Improvement Chat
      </h1>

      {mode === "upload" && (
        <div className="w-full max-w-3xl bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-8 cursor-pointer hover:border-blue-500 transition-colors"
          >
            <UploadCloud className="w-12 h-12 text-blue-400 mb-4" />
            <span className="text-slate-300">
              {file ? file.name : "Click to upload your file"}
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".zip,application/zip"
              onChange={handleFileChange}
            />
          </label>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all transform ${
              file && !loading
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                : "bg-slate-700 cursor-not-allowed opacity-50"
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
        </div>
      )}

      {mode === "chat" && (
        <div className="w-full max-w-3xl flex flex-col bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
          <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              className="flex-1 rounded-lg px-4 py-2 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`p-2 rounded-lg ${
                loading || !input.trim()
                  ? "bg-slate-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
              }`}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <Send className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
