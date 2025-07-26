const AdmZip = require("adm-zip");
const axios = require("axios");

const analyzeZip = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    console.log("Received ZIP upload");

    const zip = new AdmZip(req.file.buffer);
    const entries = zip.getEntries();

    let content = "";

    entries.forEach((entry) => {
      if (
        !entry.isDirectory &&
        entry.entryName.match(/\.(js|py|html|txt|jsx|go|rs|java|json)$/)
      ) {
        content += zip.readAsText(entry) + "\n\n";
      }
    });

    if (!content.trim()) {
      console.log("No valid files found in ZIP.");
      return res.status(400).json({
        success: false,
        message:
          "No valid files (.js, .py, .html, .txt, jsx, go, .json) found in ZIP.",
      });
    }

    const prompt = `
You are a cybersecurity assistant. Analyze the following code for any vulnerabilities, bad practices, or insecure implementations. Provide clear and actionable suggestions for improvement.

${content}
    `.trim();

    console.log("Sending prompt to Ollama...");

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2",
      prompt: prompt,
      stream: false,
    });

    console.log("Ollama responded.");

    return res.status(200).json({
      success: true,
      suggestions: response.data.response,
    });
  } catch (error) {
    console.error("Ollama LLM Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "LLM analysis failed.",
      error: error?.response?.data || error.message,
    });
  }
};

const chatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be a string.",
      });
    }

    const prompt = `
  You are a cybersecurity assistant. Here's the user's question:

  "${message}"
  
  Respond clearly and concisely.
    `.trim();

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2",
      prompt: prompt,
      stream: false,
    });

    return res.status(200).json({
      success: true,
      reply: response.data.response,
    });
  } catch (error) {
    console.error("Chat LLM Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "LLM chat failed.",
      error: error?.response?.data || error.message,
    });
  }
};

const chatBotMessage = async (req, res) => {
  const { message } = req.body;
  try {
    if (!message || typeof message != "string") {
      return res
        .status(400)
        .json({ msg: "Enter a valid message", success: false });
    }
    const prompt = `You are an expert cybersecurity assistant. You are only allowed to answer questions strictly related to cybersecurity topics, such as network security, ethical hacking, malware, firewalls, penetration testing, encryption, secure coding, and related domains.

  If the user asks a question that is not related to cybersecurity, politely but firmly respond with:

  "I’m sorry, I can only answer questions related to cybersecurity."

  Do not attempt to answer or provide information outside the cybersecurity domain under any circumstances. With that keeping in mind , here is the question ${message}
`;

    const response = axios.post("http://localhost:11434/api/generate", {
      model: "llama 3.2",
      prompt: prompt,
      stream: false,
    });
    return res.status(200).json({ success: true, response: response.data });
  } catch (err) {
    console.log("Error in sending data to ollama,", err);
    return res.status(500).json({
      success: false,
      message: "LLM chat failed.",
      error: error?.response?.data || error.message,
    });
  }
};

module.exports = { analyzeZip, chatMessage, chatBotMessage };
