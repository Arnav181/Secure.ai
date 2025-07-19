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

module.exports = { analyzeZip };
