/**
 * Tests for Search Utilities
 */

import { 
  searchLaws, 
  extractSearchTerms, 
  findMatches, 
  sanitizeSearchQuery,
  getSearchStats 
} from '../searchUtils';

// Mock law data for testing
const mockLaws = [
  {
    id: "test-1",
    act: "Information Technology Act, 2000",
    section: "Section 43A",
    theory: "Data protection and compensation for negligence in security practices",
    keywords: ["data protection", "compensation", "negligence"],
    category: "Data Protection"
  },
  {
    id: "test-2", 
    act: "Information Technology Act, 2000",
    section: "Section 66",
    theory: "Computer fraud and dishonest activities with imprisonment penalties",
    keywords: ["computer fraud", "dishonest", "imprisonment"],
    category: "Cyber Crimes"
  },
  {
    id: "test-3",
    act: "Cyber Security Act, 2023",
    section: "Section 10",
    theory: "Network security requirements for critical infrastructure",
    keywords: ["network security", "critical infrastructure"],
    category: "Infrastructure Security"
  }
];

describe('searchLaws', () => {
  test('returns all laws when query is empty', () => {
    expect(searchLaws('', mockLaws)).toEqual(mockLaws);
    expect(searchLaws('   ', mockLaws)).toEqual(mockLaws);
    expect(searchLaws(null, mockLaws)).toEqual(mockLaws);
  });

  test('searches in act names', () => {
    const results = searchLaws('Information Technology', mockLaws);
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('test-1');
    expect(results[1].id).toBe('test-2');
  });

  test('searches in section numbers', () => {
    const results = searchLaws('43A', mockLaws);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('test-1');
  });

  test('searches in theory content', () => {
    const results = searchLaws('fraud', mockLaws);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('test-2');
  });

  test('searches in keywords', () => {
    const results = searchLaws('network security', mockLaws);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('test-3');
  });

  test('searches in category', () => {
    const results = searchLaws('Cyber Crimes', mockLaws);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('test-2');
  });

  test('is case insensitive', () => {
    const results = searchLaws('DATA PROTECTION', mockLaws);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('test-1');
  });

  test('handles partial matches', () => {
    const results = searchLaws('secur', mockLaws);
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('extractSearchTerms', () => {
  test('splits query into terms', () => {
    expect(extractSearchTerms('data protection')).toEqual(['data', 'protection']);
    expect(extractSearchTerms('  multiple   spaces  ')).toEqual(['multiple', 'spaces']);
  });

  test('handles empty queries', () => {
    expect(extractSearchTerms('')).toEqual([]);
    expect(extractSearchTerms('   ')).toEqual([]);
    expect(extractSearchTerms(null)).toEqual([]);
  });

  test('filters out empty terms', () => {
    expect(extractSearchTerms('word1  word2')).toEqual(['word1', 'word2']);
  });
});

describe('findMatches', () => {
  const text = "This is a test text with some test words";
  const searchTerms = ['test', 'text'];

  test('finds all matches', () => {
    const matches = findMatches(text, searchTerms);
    expect(matches).toHaveLength(3); // 'test' appears twice, 'text' once
  });

  test('returns matches with correct positions', () => {
    const matches = findMatches(text, ['test']);
    expect(matches[0].start).toBe(10); // First 'test'
    expect(matches[0].end).toBe(14);
    expect(matches[1].start).toBe(30); // Second 'test'
    expect(matches[1].end).toBe(34);
  });

  test('handles empty inputs', () => {
    expect(findMatches('', searchTerms)).toEqual([]);
    expect(findMatches(text, [])).toEqual([]);
    expect(findMatches(text, null)).toEqual([]);
  });
});

describe('sanitizeSearchQuery', () => {
  test('removes harmful characters', () => {
    expect(sanitizeSearchQuery('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    expect(sanitizeSearchQuery('test{malicious}code')).toBe('testmaliciouscode');
    expect(sanitizeSearchQuery('normal[brackets]')).toBe('normalbrackets');
  });

  test('preserves normal search characters', () => {
    expect(sanitizeSearchQuery('data protection 123')).toBe('data protection 123');
    expect(sanitizeSearchQuery('section-43A')).toBe('section-43A');
  });

  test('limits query length', () => {
    const longQuery = 'a'.repeat(300);
    const sanitized = sanitizeSearchQuery(longQuery);
    expect(sanitized.length).toBe(200);
  });

  test('handles invalid inputs', () => {
    expect(sanitizeSearchQuery(null)).toBe('');
    expect(sanitizeSearchQuery(undefined)).toBe('');
    expect(sanitizeSearchQuery(123)).toBe('');
  });
});

describe('getSearchStats', () => {
  test('calculates correct statistics', () => {
    const stats = getSearchStats(mockLaws, [mockLaws[0]], 'data');
    expect(stats.totalLaws).toBe(3);
    expect(stats.matchingLaws).toBe(1);
    expect(stats.hasQuery).toBe(true);
    expect(stats.query).toBe('data');
    expect(stats.percentage).toBe(33); // 1/3 * 100, rounded
  });

  test('handles empty results', () => {
    const stats = getSearchStats(mockLaws, [], 'nonexistent');
    expect(stats.totalLaws).toBe(3);
    expect(stats.matchingLaws).toBe(0);
    expect(stats.percentage).toBe(0);
  });

  test('handles no query', () => {
    const stats = getSearchStats(mockLaws, mockLaws, '');
    expect(stats.hasQuery).toBe(false);
    expect(stats.percentage).toBe(100);
  });
});