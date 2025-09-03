const AdmZip = require("adm-zip");
const axios = require("axios");
const NodeCache = require("node-cache");

// Initialize cache with 5 minute TTL
const responseCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Rate limiting setup
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// Connection pool for axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:11434',
  timeout: 30000, // 30 second timeout
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

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
# 🔍 CYBERSECURITY CODE ANALYSIS ENGINE

## 🎯 EXPERT ANALYST PROFILE
You are an elite cybersecurity code analyst with specialized expertise in:
- **🛡️ OWASP Top 10**: Complete vulnerability taxonomy and mitigation strategies
- **💻 Multi-Language Security**: Secure coding across JavaScript, Python, Java, C#, Go, Rust
- **⚔️ Attack Vectors**: XSS, SQL injection, CSRF, RCE, privilege escalation, data exfiltration
- **🔐 Authentication & Authorization**: OAuth, JWT, RBAC, session management, MFA implementation
- **🔒 Cryptography**: Modern encryption, key management, hashing, digital signatures
- **🧪 Security Testing**: SAST, DAST, penetration testing, fuzzing techniques

## 📊 ADAPTIVE ANALYSIS FRAMEWORK

### 🔹 For SMALL Codebases (< 500 lines):
**Format**: Focused analysis with key findings
- **## 🚨 Critical Issues** (if any)
- **## ⚠️ Security Concerns** 
- **## ✅ Quick Wins**
- **## 💡 Best Practice Tips**

### 🔹 For MEDIUM Codebases (500-2000 lines):
**Format**: Structured comprehensive analysis
- **# 📋 Executive Summary**
- **## 🔴 Critical Vulnerabilities**
- **## 🟡 Security Concerns** 
- **## 🟢 Best Practice Improvements**
- **## 📈 Security Maturity Assessment**
- **## 🎯 Prioritized Action Plan**

### 🔹 For LARGE Codebases (2000+ lines):
**Format**: Enterprise-level security audit
- **# 📊 Security Assessment Report**
- **## 🎯 Executive Summary**
- **## 🚨 Critical Security Findings**
- **## 📋 Detailed Vulnerability Analysis**
- **## 🏗️ Architecture Security Review**
- **## 🔧 Implementation Recommendations**
- **## 📈 Security Roadmap**
- **## 🛡️ Long-term Security Strategy**

## 🔍 COMPREHENSIVE VULNERABILITY SCANNING

### 🚨 **Tier 1 - Critical Vulnerabilities**
- **💉 Injection Attacks**: SQL, NoSQL, Command, LDAP, XPath injection
- **🔓 Authentication Bypass**: Weak credentials, session hijacking, privilege escalation
- **📊 Data Exposure**: Sensitive data leaks, inadequate encryption, information disclosure
- **⚡ Remote Code Execution**: Unsafe deserialization, file upload vulnerabilities
- **🌐 Cross-Site Scripting**: Stored, reflected, DOM-based XSS variants

### ⚠️ **Tier 2 - Security Concerns**
- **🔐 Authorization Issues**: IDOR, missing access controls, role confusion
- **🛡️ Input Validation**: Insufficient sanitization, buffer overflows, format strings
- **🔑 Cryptographic Weaknesses**: Weak algorithms, poor key management, entropy issues
- **⚙️ Configuration Problems**: Default credentials, unnecessary services, misconfigurations
- **� LogginRg & Monitoring**: Insufficient logging, sensitive data in logs, missing alerts

### ✅ **Tier 3 - Best Practice Improvements**
- **🏗️ Secure Architecture**: Defense in depth, principle of least privilege
- **🧪 Security Testing**: Unit tests, integration tests, security test coverage
- **� CoCde Quality**: Maintainability, documentation, security comments
- **🔄 DevSecOps**: CI/CD security, automated scanning, security gates

## 🎨 ENHANCED OUTPUT FORMATTING

### 🚨 **CRITICAL VULNERABILITIES** (CVSS 7.0+)
\`\`\`
� **[VUoLNERABILITY_NAME]** | Severity: HIGH/CRITICAL
📍 **Location**: [File:Line] or [Function/Component]
⚡ **Impact**: [Detailed impact description]
🎯 **Exploit Scenario**: [How an attacker would exploit this]
🛠️ **Fix**: [Step-by-step remediation with code examples]
📚 **Reference**: [OWASP/CWE/CVE references]
\`\`\`

### ⚠️ **SECURITY CONCERNS** (CVSS 4.0-6.9)
- **🔸 Issue**: [Concise description]
- **📍 Location**: [File/component reference]
- **💡 Recommendation**: [Specific improvement suggestion]
- **🔧 Implementation**: [Code example or configuration change]

### ✅ **BEST PRACTICES** (Enhancement opportunities)
- **🎯 Area**: [Security domain]
- **💡 Suggestion**: [Specific improvement]
- **📈 Benefit**: [Security improvement gained]

## 📋 ACTIONABLE DELIVERABLES

### 🎯 **IMMEDIATE ACTION ITEMS** (Fix within 24-48 hours)
1. **🚨 [Critical Fix 1]** - [Brief description]
2. **🚨 [Critical Fix 2]** - [Brief description]

### 📅 **SHORT-TERM IMPROVEMENTS** (Fix within 1-2 weeks)
1. **⚠️ [Security Concern 1]** - [Brief description]
2. **⚠️ [Security Concern 2]** - [Brief description]

### 🚀 **LONG-TERM ENHANCEMENTS** (Implement over 1-3 months)
1. **✅ [Best Practice 1]** - [Brief description]
2. **✅ [Best Practice 2]** - [Brief description]

## 🛡️ **SECURITY HARDENING CHECKLIST**
- [ ] **Input Validation**: All user inputs properly sanitized
- [ ] **Authentication**: Strong authentication mechanisms implemented
- [ ] **Authorization**: Proper access controls in place
- [ ] **Encryption**: Sensitive data encrypted at rest and in transit
- [ ] **Error Handling**: No sensitive information in error messages
- [ ] **Logging**: Comprehensive security event logging
- [ ] **Dependencies**: All dependencies up-to-date and vulnerability-free

## 📊 CODE ANALYSIS TARGET
**Codebase Size**: ${content.split("\n").length} lines
**File Types**: [Auto-detected from extensions]

\`\`\`
${content}
\`\`\`

## 🎯 COMPREHENSIVE SECURITY ANALYSIS
Begin detailed cybersecurity assessment with adaptive formatting based on codebase complexity:
    `.trim();

    console.log("Sending prompt to Ollama...");

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const response = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2",
          prompt: prompt,
          stream: true,
        },
        {
          responseType: "stream",
        }
      );

      response.data.on("data", (chunk) => {
        const lines = chunk
          .toString()
          .split("\n")
          .filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              res.write(data.response);
            }
            if (data.done) {
              console.log("Ollama streaming completed.");
              res.end();
              return;
            }
          } catch (parseError) {
            continue;
          }
        }
      });

      response.data.on("end", () => {
        res.end();
      });

      response.data.on("error", (error) => {
        console.error("Stream error:", error);
        res.status(500).end("Stream error occurred");
      });
    } catch (streamError) {
      console.error(
        "Streaming LLM Error:",
        streamError?.response?.data || streamError.message
      );
      res.status(500).end("LLM analysis failed");
    }
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

    // Detect casual/greeting messages
    const casualPatterns = [
      /^(hi|hello|hey|good morning|good afternoon|good evening)$/i,
      /^(thank you|thanks|thx)$/i,
      /^(bye|goodbye|see you|farewell)$/i,
      /^(how are you|what's up|how's it going)$/i,
      /^(ok|okay|alright|got it|understood)$/i,
      /^(yes|no|maybe)$/i,
    ];

    const isCasualMessage = casualPatterns.some((pattern) =>
      pattern.test(message.trim())
    );

    const prompt = `
# 🛡️ CYBERSECURITY EXPERT ASSISTANT

## 🎯 YOUR ROLE
You are a specialized cybersecurity expert with comprehensive knowledge in:
- **Network Security**: Infrastructure protection, firewalls, intrusion detection
- **Application Security**: Secure coding, vulnerability assessment, OWASP guidelines
- **Incident Response**: Threat analysis, forensics, recovery procedures
- **Compliance**: SOC 2, ISO 27001, NIST, GDPR, HIPAA frameworks
- **Penetration Testing**: Ethical hacking, red team operations, security audits
- **Risk Management**: Threat modeling, security governance, policy development



## 📋 ADAPTIVE RESPONSE GUIDELINES

### For CASUAL/GREETING Messages:
- Respond warmly and professionally
- Acknowledge the greeting/thanks
- Gently redirect to cybersecurity topics
- Offer specific help areas
- Keep response under 50 words
- Format: Greeting + Security context + Offer to help

### For SHORT/SIMPLE Questions (1-10 words):
- Provide **concise, direct answers** with key points
- Use **bullet points** for multiple items
- Include **one practical tip** when relevant
- Format: Brief explanation + actionable insight

### For MEDIUM Questions (11-50 words):
- Use **## Main Topic** headers
- Organize with **bullet points** and **numbered lists**
- Include **### Subtopics** when needed
- Add **practical examples** and **best practices**
- Format: Overview + Details + Recommendations

### For COMPLEX/DETAILED Questions (50+ words):
- Use **full hierarchical structure**: # Main → ## Sections → ### Subsections
- Include **🔹 Key Points**, **⚠️ Warnings**, **✅ Best Practices**
- Add **code examples**, **step-by-step guides**, **implementation details**
- Provide **multiple perspectives** and **comprehensive coverage**
- Format: Executive Summary + Detailed Analysis + Action Plan

## 🚫 BOUNDARY ENFORCEMENT
For non-cybersecurity topics (except casual greetings), respond:
> "🔒 **I specialize exclusively in cybersecurity topics.** Please ask questions about:
> - Information Security • Network Security • Application Security
> - Compliance & Governance • Incident Response • Risk Management"

## 📝 FORMATTING STANDARDS
- **Headers**: Use # ## ### hierarchy appropriately
- **Emphasis**: **Bold** for key terms, *italics* for concepts
- **Lists**: • Bullets for features, 1. Numbers for steps
- **Code**: \`inline code\` or \`\`\`code blocks\`\`\`
- **Callouts**: 🔹 Tips, ⚠️ Warnings, ✅ Best practices, 🚨 Critical issues
- **Sections**: Separate major topics with clear headers

## 💬 USER QUESTION
"${message}"

## 🎯 EXPERT RESPONSE
${
  isCasualMessage
    ? "Provide a warm, professional response that acknowledges the greeting and offers cybersecurity assistance:"
    : "Analyze the question complexity and provide an appropriately structured cybersecurity response:"
}
    `.trim();

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    
    try {
      const response = await axiosInstance.post(
        "/api/generate",
        {
          model: "llama3.2",
          prompt: prompt,
          stream: true,
        },
        {
          responseType: "stream",
        
        }
      );

      response.data.on("data", (chunk) => {
        const lines = chunk
          .toString()
          .split("\n")
          .filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              res.write(data.response);
              fullResponse += data.response;
            }
            if (data.done) {
              // Cache the response for future use
              if (fullResponse.length > 20 && !isCasualMessage) {
                responseCache.set(cacheKey, fullResponse);
              }
              res.end();
              return;
            }
          } catch (parseError) {
            // Skip invalid JSON lines
            continue;
          }
        }
      });

      response.data.on("end", () => {
        res.end();
      });

      response.data.on("error", (error) => {
        console.error("Stream error:", error);
        res.status(500).end("Stream error occurred");
      });
    } catch (error) {
      console.error("Chat LLM Error:", error?.response?.data || error.message);
      
      // Fallback response if LLM fails
      const fallbackResponse = "I apologize, but I'm currently experiencing technical difficulties. Please try again shortly.";
      res.write(fallbackResponse);
      res.end();
    }
  } catch (error) {
    console.error("Chat setup error:", error);
    res.status(500).json({
      success: false,
      message: "Chat setup failed.",
      error: error.message,
    });
  }
};

const chatBotMessage = async (req, res) => {
  const { message } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  
  try {
    if (!message || typeof message != "string") {
      return res
        .status(400)
        .json({ msg: "Enter a valid message", success: false });
    }

    // Rate limiting check
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    // Clean up old entries
    if (rateLimit.has(clientIP)) {
      const requests = rateLimit.get(clientIP).filter(time => time > windowStart);
      if (requests.length === 0) {
        rateLimit.delete(clientIP);
      } else {
        rateLimit.set(clientIP, requests);
      }
    }

    // Check current rate
    const currentRequests = rateLimit.get(clientIP) || [];
    if (currentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Please try again in a minute."
      });
    }

    // Add current request to rate limit
    rateLimit.set(clientIP, [...currentRequests, now]);

    // Check cache first
    const cacheKey = `chat_${message.trim().toLowerCase()}`;
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse) {
      console.log("Cache hit for:", message.substring(0, 50) + "...");
      
      // Set headers for streaming
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      
      // Stream cached response
      let index = 0;
      const chunkSize = 50;
      
      const streamResponse = () => {
        if (index < cachedResponse.length) {
          const chunk = cachedResponse.substring(index, index + chunkSize);
          res.write(chunk);
          index += chunkSize;
          setTimeout(streamResponse, 10); // Small delay to simulate streaming
        } else {
          res.end();
        }
      };
      
      streamResponse();
      return;
    }

    // Detect casual/greeting messages
    const casualPatterns = [
      /^(hi|hello|hey|good morning|good afternoon|good evening)$/i,
      /^(thank you|thanks|thx)$/i,
      /^(bye|goodbye|see you|farewell)$/i,
      /^(how are you|what's up|how's it going)$/i,
      /^(ok|okay|alright|got it|understood)$/i,
      /^(yes|no|maybe)$/i,
    ];

    const isCasualMessage = casualPatterns.some((pattern) =>
      pattern.test(message.trim())
    );

    const prompt = `
# � CYBEPRSECURITY SPECIALIST ASSISTANT

## 🎯 EXPERTISE AREAS
You are a cybersecurity expert specializing in:
- **🌐 Network Security**: Firewalls, IDS/IPS, network segmentation, VPNs, zero-trust
- **💻 Application Security**: Secure coding, OWASP guidelines, vulnerability assessment, SAST/DAST
- **🎭 Ethical Hacking**: Penetration testing, red team operations, security research, bug bounty
- **🦠 Malware Analysis**: Threat intelligence, reverse engineering, incident response, forensics
- **� CryptogNraphy**: Encryption algorithms, key management, PKI systems, quantum-safe crypto
- **📋 Compliance**: GDPR, HIPAA, PCI-DSS, SOX, ISO 27001, NIST frameworks
- **⚖️ Risk Management**: Threat modeling, security assessments, governance, policy development


## 📊 ADAPTIVE RESPONSE SYSTEM

### 🔹 For CASUAL/GREETING Messages:
**Format**: Warm acknowledgment + Security context + Offer help
- Respond professionally and warmly
- Acknowledge the greeting/thanks appropriately
- Gently redirect to cybersecurity topics
- Offer specific areas where you can help
- Keep response under 50 words

### � For QuUICK Questions (1-15 words):
**Format**: Direct answer + key insight
- Use **bullet points** for lists
- Include **one actionable tip**
- Keep response **under 100 words**

### 🔹 For STANDARD Questions (16-75 words):
**Format**: ## Main Topic → ### Key Areas → Bullet points
- **## Overview** with main concept
- **### Key Points** with detailed bullets
- **### Best Practices** with actionable items
- **### Resources** when helpful

### � Foro COMPLEX Questions (75+ words):
**Format**: Full hierarchical structure with comprehensive coverage
- **# Executive Summary** (2-3 sentences)
- **## Detailed Analysis** with multiple subsections
- **### Technical Implementation** with code/examples
- **### Security Considerations** with warnings
- **### Step-by-Step Guide** when applicable
- **## Recommendations** with prioritized actions
- **## Additional Resources** with references

## 🎨 ENHANCED FORMATTING GUIDELINES
- **📌 Headers**: # Main Topic → ## Sections → ### Subsections → #### Details
- **🎯 Emphasis**: **Critical terms**, *concepts*, \`code snippets\`
- **📝 Lists**: 
  - • Bullet points for features/options
  - 1. Numbered lists for sequential steps
  - ✅ Checkboxes for action items
- **🚨 Callouts**: 
  - 🔹 **Key Points** | ⚠️ **Warnings** | ✅ **Best Practices**
  - 🚨 **Critical Issues** | 💡 **Pro Tips** | 📚 **Learn More**
- **💻 Code**: \`inline\` or \`\`\`code blocks\`\`\` with language specification
- **🔗 References**: Include relevant standards (OWASP, NIST, etc.)

## 🚫 SCOPE BOUNDARIES
For non-cybersecurity topics (except casual greetings), respond with:
> **🔒 Cybersecurity Focus Only**
> 
> I specialize exclusively in cybersecurity domains. Please ask about:
> - 🛡️ **Security**: Network, Application, Infrastructure
> - 🔍 **Assessment**: Penetration testing, Vulnerability analysis
> - 📋 **Compliance**: Regulations, Standards, Frameworks
> - 🚨 **Incident Response**: Forensics, Recovery, Analysis
> - 🎯 **Risk Management**: Threat modeling, Governance

## 💬 USER QUERY
**Question**: ${message}
**Length**: ${message.split(" ").length} words
**Type**: ${isCasualMessage ? "Casual/Greeting" : "Technical Query"}

## 🎯 EXPERT ANALYSIS
${
  isCasualMessage
    ? "Provide a warm, professional response that acknowledges the interaction and offers cybersecurity assistance:"
    : "Provide appropriately structured cybersecurity expertise based on query complexity:"
}
    `.trim();

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const response = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2",
          prompt: prompt,
          stream: true,
        },
        {
          responseType: "stream",
        }
      );

      response.data.on("data", (chunk) => {
        const lines = chunk
          .toString()
          .split("\n")
          .filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              res.write(data.response);
            }
            if (data.done) {
              res.end();
              return;
            }
          } catch (parseError) {
            // Skip invalid JSON lines
            continue;
          }
        }
      });

      response.data.on("end", () => {
        res.end();
      });

      response.data.on("error", (error) => {
        console.error("Stream error:", error);
        res.status(500).end("Stream error occurred");
      });
    } catch (error) {
      console.error("Chat LLM Error:", error?.response?.data || error.message);
      res.status(500).end("LLM chat failed");
    }
  } catch (err) {
    console.log("Error in sending data to ollama,", err);
    return res.status(500).json({
      success: false,
      message: "LLM chat failed.",
      error: err?.response?.data || err.message,
    });
  }
};

module.exports = { analyzeZip, chatMessage, chatBotMessage };
