/**
 * Law Data Structure and Sample Data for Cybersecurity Laws Documentation
 * 
 * This file contains the law interface definitions, sample data, and utility functions
 * for managing cybersecurity laws in the frontend application.
 */

/**
 * Law Entity Interface (JSDoc for type documentation)
 * @typedef {Object} Law
 * @property {string} id - Unique identifier for the law
 * @property {string} act - Name of the act (e.g., "Information Technology Act, 2000")
 * @property {string} section - Section number (e.g., "Section 43A")
 * @property {string} theory - Detailed explanation of the law
 * @property {string[]} keywords - Keywords for enhanced search
 * @property {Date} lastUpdated - Last update date
 * @property {string} [category] - Optional category classification
 * @property {string[]} [relatedSections] - Optional related sections
 */

/**
 * Sample Cybersecurity Laws Data
 * @type {Law[]}
 */
export const lawsData = [
  {
    id: "ita-43a",
    act: "Information Technology Act, 2000",
    section: "Section 43A",
    theory: "Where a body corporate, possessing, dealing or handling any sensitive personal data or information in a computer resource which it owns, controls or operates, is negligent in implementing and maintaining reasonable security practices and procedures and thereby causes wrongful loss or wrongful gain to any person, such body corporate shall be liable to pay damages by way of compensation to the person so affected.",
    keywords: ["data protection", "compensation", "negligence", "sensitive personal data", "security practices"],
    lastUpdated: new Date("2023-01-01"),
    category: "Data Protection",
    relatedSections: ["Section 43", "Section 72A"]
  },
  {
    id: "ita-66",
    act: "Information Technology Act, 2000",
    section: "Section 66",
    theory: "If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.",
    keywords: ["computer fraud", "dishonest", "fraudulent", "imprisonment", "fine"],
    lastUpdated: new Date("2023-01-01"),
    category: "Cyber Crimes",
    relatedSections: ["Section 43", "Section 66A", "Section 66B"]
  },
  {
    id: "ita-66a",
    act: "Information Technology Act, 2000",
    section: "Section 66A",
    theory: "Any person who sends, by means of a computer resource or a communication device, any information that is grossly offensive or has menacing character; or any information which he knows to be false, but for the purpose of causing annoyance, inconvenience, danger, obstruction, insult, injury, criminal intimidation, enmity, hatred or ill-will, persistently by making use of such computer resource or a communication device, shall be punishable with imprisonment for a term which may extend to three years and with fine.",
    keywords: ["offensive content", "menacing", "false information", "annoyance", "criminal intimidation"],
    lastUpdated: new Date("2023-01-01"),
    category: "Cyber Crimes",
    relatedSections: ["Section 66", "Section 66B", "Section 66C"]
  },
  {
    id: "ita-66b",
    act: "Information Technology Act, 2000",
    section: "Section 66B",
    theory: "Whoever, dishonestly receives or retains any stolen computer resource or communication device knowing or having reason to believe the same to be stolen computer resource or communication device, shall be punished with imprisonment of either description for a term which may extend to three years or with fine which may extend to rupees one lakh or with both.",
    keywords: ["stolen computer resource", "dishonestly receives", "communication device", "imprisonment"],
    lastUpdated: new Date("2023-01-01"),
    category: "Cyber Crimes",
    relatedSections: ["Section 66", "Section 66A", "Section 66C"]
  },
  {
    id: "ita-66c",
    act: "Information Technology Act, 2000",
    section: "Section 66C",
    theory: "Whoever, fraudulently or dishonestly make use of the electronic signature, password or any other unique identification feature of any other person, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to rupees one lakh.",
    keywords: ["identity theft", "electronic signature", "password", "unique identification", "fraudulent use"],
    lastUpdated: new Date("2023-01-01"),
    category: "Identity Theft",
    relatedSections: ["Section 66", "Section 66B", "Section 66D"]
  },
  {
    id: "ita-66d",
    act: "Information Technology Act, 2000",
    section: "Section 66D",
    theory: "Whoever, by means of any communication device or computer resource cheats by personation, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.",
    keywords: ["cheating", "personation", "communication device", "computer resource", "impersonation"],
    lastUpdated: new Date("2023-01-01"),
    category: "Identity Theft",
    relatedSections: ["Section 66C", "Section 66E", "Section 66F"]
  },
  {
    id: "ita-66e",
    act: "Information Technology Act, 2000",
    section: "Section 66E",
    theory: "Whoever, intentionally or knowingly captures, publishes or transmits the image of a private area of any person without his or her consent, under circumstances violating the privacy of that person, shall be punished with imprisonment which may extend to three years or with fine not exceeding two lakh rupees, or with both.",
    keywords: ["privacy violation", "image capture", "private area", "consent", "publishing"],
    lastUpdated: new Date("2023-01-01"),
    category: "Privacy Violation",
    relatedSections: ["Section 66D", "Section 66F", "Section 67"]
  },
  {
    id: "ita-66f",
    act: "Information Technology Act, 2000",
    section: "Section 66F",
    theory: "Whoever does any act with intent to threaten the unity, integrity, security or sovereignty of India or with intent to strike terror or likely to strike terror in the people or any section of the people in India or in any foreign country, by denying or causing the denial of access to any person authorized to access computer resource or by accessing or attempting to access a computer resource without authorization or by introducing or causing to introduce any computer contaminant or computer virus, shall be punishable with imprisonment which may extend to imprisonment for life.",
    keywords: ["cyber terrorism", "national security", "unity", "integrity", "sovereignty", "terror", "unauthorized access"],
    lastUpdated: new Date("2023-01-01"),
    category: "Cyber Terrorism",
    relatedSections: ["Section 66E", "Section 67", "Section 70"]
  },
  {
    id: "ita-67",
    act: "Information Technology Act, 2000",
    section: "Section 67",
    theory: "Whoever publishes or transmits or causes to be published or transmitted in the electronic form, any material which is lascivious or appeals to the prurient interest or if its effect is such as to tend to deprave and corrupt persons who are likely, having regard to all relevant circumstances, to read, see or hear the matter contained or embodied in it, shall be punished on first conviction with imprisonment of either description for a term which may extend to three years and with fine which may extend to five lakh rupees.",
    keywords: ["obscene content", "electronic form", "lascivious", "prurient interest", "deprave", "corrupt"],
    lastUpdated: new Date("2023-01-01"),
    category: "Obscene Content",
    relatedSections: ["Section 66F", "Section 67A", "Section 67B"]
  },
  {
    id: "ita-72a",
    act: "Information Technology Act, 2000",
    section: "Section 72A",
    theory: "Save as otherwise provided in this Act or any other law for the time being in force, any person including an intermediary who, while providing services under the terms of lawful contract, has secured access to any material containing personal information about another person, with the intent to cause or knowing that he is likely to cause wrongful loss or wrongful gain discloses, without the consent of the person concerned, or in breach of a lawful contract, such personal information to any other person, shall be punished with imprisonment for a term which may extend to three years, or with fine which may extend to five lakh rupees, or with both.",
    keywords: ["personal information", "disclosure", "consent", "wrongful loss", "wrongful gain", "intermediary"],
    lastUpdated: new Date("2023-01-01"),
    category: "Data Protection",
    relatedSections: ["Section 43A", "Section 72", "Section 87"]
  }
];

export default lawsData;