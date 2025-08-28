/**
 * Utility functions for searching and filtering news articles
 */

// List of cybersecurity and computer-related keywords for content filtering
const CYBERSECURITY_KEYWORDS = [
  'cybersecurity', 'cyber security', 'data breach', 'malware', 'virus', 'ransomware',
  'phishing', 'hacking', 'hacker', 'vulnerability', 'exploit', 'zero-day', 'patch',
  'firewall', 'antivirus', 'encryption', 'decryption', 'cryptography', 'authentication',
  'authorization', 'ddos', 'botnet', 'trojan', 'worm', 'spyware', 'adware', 'keylogger',
  'social engineering', 'penetration testing', 'pentest', 'security audit', 'compliance',
  'gdpr', 'hipaa', 'pci', 'nist', 'iso 27001', 'cert', 'incident response', 'forensics',
  'digital forensics', 'threat intelligence', 'siem', 'soc', 'endpoint security',
  'network security', 'cloud security', 'iot security', 'mobile security', 'web security',
  'application security', 'appsec', 'devsecops', 'secure coding', 'owasp', 'cve',
  'mitre att&ck', 'threat actor', 'apt', 'advanced persistent threat', 'insider threat',
  'security awareness', 'training', 'certification', 'cisco', 'microsoft', 'aws',
  'azure', 'google cloud', 'cloudflare', 'akamai', 'fortinet', 'palo alto', 'check point',
  'crowdstrike', 'sentinelone', 'carbon black', 'sophos', 'kaspersky', 'mcafee',
  'symantec', 'trend micro', 'ibm security', 'splunk', 'qualys', 'tenable', 'rapid7',
  'proofpoint', 'mimecast', 'barracuda', 'okta', 'duo', 'ping identity', 'sailpoint',
  'cyberark', 'beyondtrust', 'thycotic', '1password', 'lastpass', 'dashlane', 'bitwarden'
];

/**
 * Checks if an article is cybersecurity/computer-related
 * @param {Object} article - News article object
 * @returns {boolean} - True if article is relevant
 */
export const isCybersecurityArticle = (article) => {
  if (!article) return false;
  
  const content = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  
  return CYBERSECURITY_KEYWORDS.some(keyword => 
    content.includes(keyword.toLowerCase())
  );
};

/**
 * Filters articles to only include cybersecurity/computer-related content
 * @param {Array} articles - Array of news articles
 * @returns {Array} - Filtered articles
 */
export const filterCybersecurityArticles = (articles) => {
  if (!Array.isArray(articles)) return [];
  
  return articles.filter(isCybersecurityArticle);
};

/**
 * Filters articles based on a search query
 * @param {Array} articles - Array of news articles
 * @param {string} query - Search query
 * @returns {Array} - Filtered articles
 */
export const filterArticlesByQuery = (articles, query) => {
  if (!query) return articles;

  const lowerCaseQuery = query.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerCaseQuery) ||
    (article.description && article.description.toLowerCase().includes(lowerCaseQuery)) ||
    (article.source && article.source.name.toLowerCase().includes(lowerCaseQuery)) ||
    (article.content && article.content.toLowerCase().includes(lowerCaseQuery))
  );
};
